const Message = require('../models/Message');

exports.getAllMessages = async (req, res) => {
  try {
    console.log('Fetching all messages');
    const messages = await Message.findAll();
    res.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error.message);
    res.status(500).json({ message: error.message });
  }
};

exports.addMessage = async (req, res) => {
  try {
    console.log('Adding a message:', req.body);
    const newMessage = await Message.create(req.body);
    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Error adding message:', error.message);
    res.status(400).json({ message: error.message });
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    console.log('Deleting a message with id:', req.params.id);
    const deleted = await Message.destroy({ where: { id: req.params.id } });
    if (deleted) {
      res.json({ message: 'Message deleted' });
    } else {
      res.status(404).json({ message: 'Message not found' });
    }
  } catch (error) {
    console.error('Error deleting message:', error.message);
    res.status(500).json({ message: error.message });
  }
};
