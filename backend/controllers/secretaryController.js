const { Lead, Lawyer, User, Topic } = require('../models');
const { Op } = require('sequelize');

// TODO: Integrate Nodemailer for email notifications

/**
 * GET /api/secretary/leads
 * Fetch all leads (with user and topic info)
 */
exports.getAllLeads = async (req, res) => {
  try {
    const leads = await Lead.findAll({
      include: [
        { model: User, attributes: ['name', 'whatsapp_number'] },
        { model: Topic, attributes: ['name'] },
        { model: Lawyer, attributes: ['name', 'email'] } // Include assigned lawyer if any
      ],
      order: [['created_at', 'DESC']]
    });
    res.json(leads);
  } catch (error) {
    console.error('Error fetching leads:', error);
    res.status(500).json({ error: 'Failed to fetch leads' });
  }
};

/**
 * GET /api/secretary/lawyers
 * Fetch active lawyers
 */
exports.getAllLawyers = async (req, res) => {
  try {
    const lawyers = await Lawyer.findAll({
      where: { is_active: true }
    });
    res.json(lawyers);
  } catch (error) {
    console.error('Error fetching lawyers:', error);
    res.status(500).json({ error: 'Failed to fetch lawyers' });
  }
};

/**
 * POST /api/secretary/leads/:id/assign
 * Assign a lawyer to a lead
 */
exports.assignLawyer = async (req, res) => {
  const { id } = req.params; // Lead ID
  const { lawyer_id } = req.body;

  try {
    const lead = await Lead.findByPk(id);
    if (!lead) return res.status(404).json({ error: 'Lead not found' });

    const lawyer = await Lawyer.findByPk(lawyer_id);
    if (!lawyer) return res.status(404).json({ error: 'Lawyer not found' });

    // Update Lead
    await lead.update({
      lawyer_id: lawyer.id,
      status: 'assigned'
    });

    // TODO: Send Email to Lawyer

    res.json({ message: 'Lawyer assigned successfully', lead });
  } catch (error) {
    console.error('Error assigning lawyer:', error);
    res.status(500).json({ error: 'Failed to assign lawyer' });
  }
};
