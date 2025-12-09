const { User, Conversation, Message, Topic, ExpertConfig } = require('../models');
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
                   status: 'active' 
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

               // 4. Generate AI Reply
               
               // Fetch last 10 messages for context
               const history = await Message.findAll({
                 where: { conversation_id: conversation.id },
                 order: [['created_at', 'ASC']],
                 limit: 10
               });

               // Construct Context String
               const context = history.map(msg => 
                 `${msg.sender === 'user' ? 'User' : 'AI'}: ${msg.text}`
               ).join('\n');

               // Determine System Prompt
               let systemPrompt = "You are a helpful legal assistant. Briefly answer the user's questions.";
               
               if (conversation.topic_id) {
                 const expertConfig = await ExpertConfig.findOne({ 
                    where: { topic_id: conversation.topic_id } 
                 });
                 if (expertConfig) {
                   systemPrompt = expertConfig.system_prompt;
                 }
               }

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
