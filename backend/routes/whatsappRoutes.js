const express = require('express');
const router = express.Router();
const whatsappController = require('../controllers/whatsappController');

// The Handshake (GET)
router.get('/webhook', whatsappController.verifyWebhook);

// Receiving Messages (POST)
router.post('/webhook', whatsappController.handleMessage);

module.exports = router;
