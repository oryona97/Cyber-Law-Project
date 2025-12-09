This folder is for Routes.

Purpose:
Routes define the URL endpoints of your API (e.g., /api/users, /api/login) and map them to specific Controller functions.

Why use it?
It separates the "where" (URL) from the "what" (logic/controller).

Example:
// authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/login', authController.login);

module.exports = router;
