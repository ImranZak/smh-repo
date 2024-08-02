const express = require('express');
const router = express.Router();
const messagesController = require('../controllers/messagesController');

router.get('/', messagesController.getAllMessages);
router.post('/', messagesController.addMessage);
router.delete('/:id', messagesController.deleteMessage);

module.exports = router;
