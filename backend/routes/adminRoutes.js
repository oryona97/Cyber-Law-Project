const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// Get all topics (and their experts)
router.get('/topics', adminController.getAllTopics);

// Update a Topic
router.put('/topics/:id', adminController.updateTopic);

// Update an Expert Config
router.put('/experts/:id', adminController.updateExpertConfig);

module.exports = router;
