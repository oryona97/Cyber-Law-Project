const { User, Conversation, Message, Topic, ExpertConfig, Lead } = require('../models');
const { Op } = require('sequelize');
const aiService = require('../services/aiService');
const whatsappService = require('../services/whatsappService');

// Verification Token (This should match what you set in the Meta Dashboard)
const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || 'CYBERLAW_VERIFY_TOKEN';

/**
 * Handle the Verification Handshake (GET)
 */
exports.verifyWebhook = (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    } else {
      res.sendStatus(403);
    }
  } else {
    res.sendStatus(400); // Bad Request if parameters are missing
  }
};

/**
 * Handle Incoming Messages (POST)
 */
exports.handleMessage = async (req, res) => {
  const body = req.body;

  // console.log('Incoming Webhook:', JSON.stringify(body, null, 2));

  // Check if this is an event from a WhatsApp page subscription
  if (body.object === 'whatsapp_business_account') {
    
    try {
      // Iterate over each entry
      for (const entry of body.entry) {
        for (const change of entry.changes) {
          const value = change.value;

          if (value.messages && value.messages.length > 0) {
            const message = value.messages[0];
            const from = message.from; // User's phone number
            const textBody = message.text ? message.text.body : null;

            if (textBody) {
               console.log(`Received message from ${from}: ${textBody}`);

               // 1. Find or Create User
               const [user, created] = await User.findOrCreate({
                 where: { whatsapp_number: from },
                 defaults: { name: 'Unknown User' } 
               });

               // 2. Find Active Conversation
               let conversation = await Conversation.findOne({
                 where: { 
                   user_id: user.id, 
                   status: { [Op.or]: ['active', 'waiting_for_lead'] }
                 }
               });

               if (!conversation) {
                 console.log('Starting new conversation for user', user.id);
                 conversation = await Conversation.create({
                   user_id: user.id,
                   status: 'active'
                   // topic_id: null (Will determine later)
                 });
               }

               // 3. Save User Message
               await Message.create({
                 conversation_id: conversation.id,
                 sender: 'user',
                 text: textBody
               });

               console.log(`Message saved to conversation ${conversation.id}`);

               // --- A. CONTACT INFO CAPTURE (If waiting for lead) ---
               if (conversation.status === 'waiting_for_lead') {
                 // The user just sent their contact info/name
                 await user.update({ name: textBody }); // Simplified: saving entire text as name/contact
                 
                 // Find the lead to update it (optional, but good for linking)
                 const lead = await Lead.findOne({ where: { conversation_id: conversation.id } });
                 if (lead) {
                    // Could update lead status here if needed
                 }

                 const thanksMsg = "Thank you. A lawyer has been notified and will contact you shortly.";
                 await whatsappService.sendMessage(from, thanksMsg);
                 await Message.create({ conversation_id: conversation.id, sender: 'ai', text: thanksMsg });

                 await conversation.update({ status: 'closed' });
                 continue; // Stop processing
               }


               // --- B. TOPIC SELECTION LOGIC ---
               if (!conversation.topic_id) {
                 const activeTopics = await Topic.findAll({ where: { is_active: true } });
                 const choice = parseInt(textBody.trim());

                 // Check if user sent a valid number
                 if (!isNaN(choice) && choice > 0 && choice <= activeTopics.length) {
                   const selectedTopic = activeTopics[choice - 1];
                   conversation.topic_id = selectedTopic.id;
                   await conversation.save();

                   // Send Confirmation
                   const confirmMsg = `You selected *${selectedTopic.name}*. \n${selectedTopic.description}\n\nHow can I help you?`;
                   
                   await Message.create({
                     conversation_id: conversation.id,
                     sender: 'ai',
                     text: confirmMsg
                   });
                   await whatsappService.sendMessage(from, confirmMsg);
                   
                   continue; // Stop here, wait for next user input

                 } else {
                   // Show Menu
                   let menuMsg = "Welcome to our Legal Assistant. Please reply with the number of your topic:\n";
                   activeTopics.forEach((t, index) => {
                     menuMsg += `${index + 1}. ${t.name}\n`;
                   });

                   await Message.create({
                     conversation_id: conversation.id,
                     sender: 'ai',
                     text: menuMsg
                   });
                   await whatsappService.sendMessage(from, menuMsg);
                   
                   continue; // Stop here
                 }
               }

               // --- C. TRIAGE & LEAD TRIGGER ---
               // 1. Fetch History & Expert Config
               const history = await Message.findAll({
                 where: { conversation_id: conversation.id },
                 order: [['created_at', 'ASC']],
                 limit: 20 // increased limit for better summary
               });

               let expertConfig = null;
               let systemPrompt = "You are a helpful legal assistant.";

               if (conversation.topic_id) {
                 expertConfig = await ExpertConfig.findOne({ 
                    where: { topic_id: conversation.topic_id } 
                 });
                 if (expertConfig) {
                   systemPrompt = expertConfig.system_prompt;
                 }
               }

               // 2. Check Turn Count
               const userMsgCount = await Message.count({
                 where: { conversation_id: conversation.id, sender: 'user' }
               });

               // 3. Trigger Lead Creation if threshold met
               if (expertConfig && userMsgCount >= expertConfig.max_depth) {
                  // Check if lead already exists to avoid duplicates
                  const existingLead = await Lead.findOne({ where: { conversation_id: conversation.id } });
                  
                  if (!existingLead) {
                    console.log('Max depth reached. Generating Lead...');
                    
                    // Generate Summary
                    const contextString = history.map(msg => `${msg.sender}: ${msg.text}`).join('\n');
                    const summaryData = await aiService.generateLeadSummary(contextString);

                    // Create Lead
                    await Lead.create({
                      conversation_id: conversation.id,
                      user_id: user.id,
                      topic_id: conversation.topic_id,
                      summary: summaryData.summary,
                      urgency: summaryData.urgency,
                      status: 'new'
                    });

                    // Ask for Contact
                    const contactMsg = "Based on our conversation, I believe you need a human lawyer. Please provide your Name and Phone Number so we can contact you.";
                    await whatsappService.sendMessage(from, contactMsg);
                    await Message.create({ conversation_id: conversation.id, sender: 'ai', text: contactMsg });
                    
                    await conversation.update({ status: 'waiting_for_lead' });
                    continue; // Stop here
                  }
               }

               // 4. Generate AI Reply (Standard Flow)
               // Construct Context String
               const context = history.map(msg => 
                 `${msg.sender === 'user' ? 'User' : 'AI'}: ${msg.text}`
               ).join('\n');

               // Call AI
               const prompt = `${context}\nUser: ${textBody}\nAI:`;
               const aiResponseText = await aiService.generateResponse(prompt, systemPrompt);

               // 5. Save AI Reply
               await Message.create({
                 conversation_id: conversation.id,
                 sender: 'ai',
                 text: aiResponseText
               });

               // 6. Send to WhatsApp
               await whatsappService.sendMessage(from, aiResponseText);
               console.log(`AI replied to ${from}`);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error processing webhook:', error);
    }

    res.sendStatus(200); // Acknowledge receipt immediately
  } else {
    res.sendStatus(404);
  }
};
