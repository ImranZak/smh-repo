const express = require('express');
const router = express.Router();
const messagesController = require('../controllers/messagesController');
const { validateToken } = require('../middlewares/auth');
const { Op } = require("sequelize");  // Ensure this is imported


router.get('/inbox/:userId', validateToken, messagesController.getAllMessages);
router.post('/', validateToken, messagesController.addMessage);
router.delete('/:id', validateToken, messagesController.deleteMessage);

module.exports = router;