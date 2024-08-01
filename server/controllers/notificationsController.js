const Notification = require('../models/Notification');

exports.getAllNotifications = async (req, res) => {
  try {
    console.log('Fetching all notifications');
    const notifications = await Notification.findAll();
    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error.message);
    res.status(500).json({ message: error.message });
  }
};

exports.addNotification = async (req, res) => {
  try {
    console.log('Adding a notification:', req.body);
    const newNotification = await Notification.create(req.body);
    res.status(201).json(newNotification);
  } catch (error) {
    console.error('Error adding notification:', error.message);
    res.status(400).json({ message: error.message });
  }
};

exports.deleteNotification = async (req, res) => {
  try {
    console.log('Deleting a notification with id:', req.params.id);
    const deleted = await Notification.destroy({ where: { id: req.params.id } });
    if (deleted) {
      res.json({ message: 'Notification deleted' });
    } else {
      res.status(404).json({ message: 'Notification not found' });
    }
  } catch (error) {
    console.error('Error deleting notification:', error.message);
    res.status(500).json({ message: error.message });
  }
};
