const { Topic, ExpertConfig } = require('../models');

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
