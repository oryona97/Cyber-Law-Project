const { Lead, Lawyer, User, Topic } = require('../models');
const { Op } = require('sequelize');
const emailService = require('../services/emailService');

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
    // Fetch lead with details for email
    const lead = await Lead.findByPk(id, {
      include: [
        { model: User },
        { model: Topic }
      ]
    });
    if (!lead) return res.status(404).json({ error: 'Lead not found' });

    const lawyer = await Lawyer.findByPk(lawyer_id);
    if (!lawyer) return res.status(404).json({ error: 'Lawyer not found' });

    // Update Lead
    await lead.update({
      lawyer_id: lawyer.id,
      status: 'assigned'
    });

    // Send Email Notification
    await emailService.sendAssignmentEmail(lawyer.email, {
      topic: lead.Topic?.name || 'General Legal Issue',
      urgency: lead.urgency,
      summary: lead.summary,
      userName: lead.User?.name || 'Unknown',
      userPhone: lead.User?.whatsapp_number
    });

    res.json({ message: 'Lawyer assigned successfully', lead });
  } catch (error) {
    console.error('Error assigning lawyer:', error);
    res.status(500).json({ error: 'Failed to assign lawyer' });
  }
};

/**
 * POST /api/secretary/lawyers
 * Create a new lawyer
 */
exports.createLawyer = async (req, res) => {
  const { name, email, phone } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Lawyer name is required' });
  }

  try {
    const lawyer = await Lawyer.create({
      name,
      email,
      phone,
      is_active: true
    });
    res.status(201).json(lawyer);
  } catch (error) {
    console.error('Error creating lawyer:', error);
    res.status(500).json({ error: 'Failed to create lawyer' });
  }
};

/**
 * DELETE /api/secretary/lawyers/:id
 * Soft delete a lawyer (set is_active = false)
 */
exports.deleteLawyer = async (req, res) => {
  const { id } = req.params;

  try {
    const lawyer = await Lawyer.findByPk(id);
    if (!lawyer) {
      return res.status(404).json({ error: 'Lawyer not found' });
    }

    // Soft delete
    await lawyer.update({ is_active: false });
    
    res.json({ message: 'Lawyer deactivated successfully' });
  } catch (error) {
    console.error('Error deleting lawyer:', error);
    res.status(500).json({ error: 'Failed to delete lawyer' });
  }
};
