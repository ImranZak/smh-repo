const Message = require('../models/Message');
const Friend = require('../models/Friend');
const User = require('../models/User');

exports.getAllMessages = async (req, res) => {
    const { userId } = req.params;
    try {
        const messages = await Message.findAll({
            where: {
                [Op.or]: [
                    { senderId: userId },
                    { recipientId: userId }
                ]
            },
            order: [['createdAt', 'DESC']],
            include: [
                { model: User, as: 'sender', attributes: ['id', 'name'] },
                { model: User, as: 'recipient', attributes: ['id', 'name'] }
            ]
        });
        res.json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error.message);
        res.status(500).json({ message: error.message });
    }
};

exports.addMessage = async (req, res) => {
    const { senderId, recipientId, content } = req.body;

    try {
        // Check if the users are accepted friends
        const friendship = await Friend.findOne({
            where: {
                [Op.or]: [
                    { userId: senderId, friendId: recipientId, status: 'accepted' },
                    { userId: recipientId, friendId: senderId, status: 'accepted' }
                ]
            }
        });

        if (!friendship) {
            return res.status(403).json({ message: 'You can only send messages to your friends.' });
        }

        // Create and save the message
        const newMessage = await Message.create({ senderId, recipientId, content });
        res.status(201).json(newMessage);
    } catch (error) {
        console.error('Error adding message:', error.message);
        res.status(400).json({ message: error.message });
    }
};

exports.deleteMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Message.destroy({ where: { id } });
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
