const express = require('express');
const router = express.Router();
const secretaryController = require('../controllers/secretaryController');

// Get all leads
router.get('/leads', secretaryController.getAllLeads);

// Get all lawyers
router.get('/lawyers', secretaryController.getAllLawyers);

// Assign a lawyer to a lead
router.post('/leads/:id/assign', secretaryController.assignLawyer);

module.exports = router;
