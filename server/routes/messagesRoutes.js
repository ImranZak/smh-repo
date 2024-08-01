const express = require('express');
const router = express.Router();
const messagesController = require('../controllers/messagesController');

router.get('/', messagesController.getAllMessages);
router.post('/', messagesController.sendMessage);
router.delete('/:id', messagesController.deleteMessage);

module.exports = router;
