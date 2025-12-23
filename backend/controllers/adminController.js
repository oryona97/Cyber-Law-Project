const { Topic, ExpertConfig, User, Conversation, Message } = require('../models');
const { Op } = require('sequelize');

/**
 * GET /api/admin/simulator/history/:phone
 * Fetch chat history for the simulator based on phone number
 */
exports.getSimulatorHistory = async (req, res) => {
  const { phone } = req.params;

  try {
    const user = await User.findOne({ where: { whatsapp_number: phone } });
    if (!user) {
      return res.json([]); // No user yet, return empty history
    }

    // Find the most recent active or waiting conversation
    const conversation = await Conversation.findOne({
      where: { 
        user_id: user.id 
      },
      order: [['created_at', 'DESC']]
    });

    if (!conversation) {
      return res.json([]);
    }

    const messages = await Message.findAll({
      where: { conversation_id: conversation.id },
      order: [['created_at', 'ASC']]
    });

    res.json(messages);
  } catch (error) {
    console.error('Error fetching simulator history:', error);
    res.status(500).json({ error: 'Failed to fetch history' });
  }
};

/**
 * DELETE /api/admin/simulator/history/:phone
 * Clear all chat history for the simulator user
 */
exports.clearSimulatorHistory = async (req, res) => {
  const { phone } = req.params;

  try {
    const user = await User.findOne({ where: { whatsapp_number: phone } });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Find all conversations for this user
    const conversations = await Conversation.findAll({
      where: { user_id: user.id }
    });
    
    const conversationIds = conversations.map(c => c.id);

    if (conversationIds.length > 0) {
      // Delete Messages first
      await Message.destroy({
        where: { conversation_id: { [Op.in]: conversationIds } }
      });

      // Delete Conversations
      await Conversation.destroy({
        where: { id: { [Op.in]: conversationIds } }
      });
    }

    res.json({ message: 'History cleared successfully' });
  } catch (error) {
    console.error('Error clearing history:', error);
    res.status(500).json({ error: 'Failed to clear history' });
  }
};

/**
 * GET /api/admin/topics
 * Fetch all topics with their expert configs
 */
exports.getAllTopics = async (req, res) => {
  try {
    const topics = await Topic.findAll({
      include: [{ model: ExpertConfig, as: 'expertConfig' }]
    });
    res.json(topics);
  } catch (error) {
    console.error('Error fetching topics:', error);
    res.status(500).json({ error: 'Failed to fetch topics' });
  }
};

/**
 * PUT /api/admin/topics/:id
 * Update Topic details
 */
exports.updateTopic = async (req, res) => {
  const { id } = req.params;
  const { name, description, is_active } = req.body;

  try {
    const topic = await Topic.findByPk(id);
    if (!topic) return res.status(404).json({ error: 'Topic not found' });

    await topic.update({ name, description, is_active });
    res.json(topic);
  } catch (error) {
    console.error('Error updating topic:', error);
    res.status(500).json({ error: 'Failed to update topic' });
  }
};

/**
 * PUT /api/admin/experts/:id
 * Update Expert Configuration (System Prompt)
 */
exports.updateExpertConfig = async (req, res) => {
  const { id } = req.params; // This is expert_config_id
  const { system_prompt, max_depth } = req.body;

  try {
    const config = await ExpertConfig.findByPk(id);
    if (!config) return res.status(404).json({ error: 'Expert config not found' });

    await config.update({ system_prompt, max_depth });
    res.json(config);
  } catch (error) {
    console.error('Error updating expert config:', error);
    res.status(500).json({ error: 'Failed to update expert config' });
  }
};

/**
 * POST /api/admin/topics
 * Create a new Topic & Expert Config
 */
exports.createTopic = async (req, res) => {
  const { name, description, system_prompt, max_depth } = req.body;

  if (!name || !system_prompt) {
    return res.status(400).json({ error: 'Name and System Prompt are required' });
  }

  try {
    const topic = await Topic.create({
      name,
      description,
      is_active: true
    });

    const expertConfig = await ExpertConfig.create({
      topic_id: topic.id,
      title: `${name} Expert`,
      system_prompt,
      max_depth: max_depth || 5
    });

    res.status(201).json({ topic, expertConfig });
  } catch (error) {
    console.error('Error creating topic:', error);
    res.status(500).json({ error: 'Failed to create topic' });
  }
};

/**
 * DELETE /api/admin/topics/:id
 * Soft delete (Deactivate) a topic
 */
exports.deleteTopic = async (req, res) => {
  const { id } = req.params;

  try {
    const topic = await Topic.findByPk(id);
    if (!topic) {
      return res.status(404).json({ error: 'Topic not found' });
    }

    await topic.update({ is_active: false });
    res.json({ message: 'Topic deactivated successfully' });
  } catch (error) {
    console.error('Error deleting topic:', error);
    res.status(500).json({ error: 'Failed to delete topic' });
  }
};
