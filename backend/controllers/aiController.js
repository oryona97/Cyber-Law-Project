const aiService = require('../services/aiService');
const { ExpertConfig, Topic } = require('../models');

exports.chat = async (req, res) => {
  try {
    const { message, topicId } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    let systemPrompt = 'You are a helpful assistant.';

    // If a topic is selected, fetch the specific expert persona
    if (topicId) {
      const expertConfig = await ExpertConfig.findOne({ where: { topic_id: topicId } });
      if (expertConfig) {
        systemPrompt = expertConfig.system_prompt;
      }
    }

    // Call the AI Service
    const aiResponse = await aiService.generateResponse(message, systemPrompt);

    res.json({
      reply: aiResponse
    });

  } catch (error) {
    console.error('Error in chat controller:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
