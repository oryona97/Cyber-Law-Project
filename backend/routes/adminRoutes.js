const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Get all topics (and their experts)
router.get('/topics', adminController.getAllTopics);

// Update a Topic
router.put('/topics/:id', adminController.updateTopic);

// Update an Expert Config
router.put('/experts/:id', adminController.updateExpertConfig);

// Create a new Topic
router.post('/topics', adminController.createTopic);

// Deactivate a Topic
router.delete('/topics/:id', adminController.deleteTopic);

// Simulator: Get History
router.get('/simulator/history/:phone', adminController.getSimulatorHistory);

// Simulator: Clear History
router.delete('/simulator/history/:phone', adminController.clearSimulatorHistory);

module.exports = router;
