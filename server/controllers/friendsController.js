const Friend = require('../models/Friend');

exports.getAllFriends = async (req, res) => {
  try {
    console.log('Fetching all friends');
    const friends = await Friend.findAll();
    res.json(friends);
  } catch (error) {
    console.error('Error fetching friends:', error.message);
    res.status(500).json({ message: error.message });
  }
};

exports.addFriend = async (req, res) => {
  try {
    console.log('Adding a friend:', req.body);
    const newFriend = await Friend.create(req.body);
    res.status(201).json(newFriend);
  } catch (error) {
    console.error('Error adding friend:', error.message);
    res.status(400).json({ message: error.message });
  }
};

exports.deleteFriend = async (req, res) => {
  try {
    console.log('Deleting a friend with id:', req.params.id);
    const deleted = await Friend.destroy({ where: { id: req.params.id } });
    if (deleted) {
      res.json({ message: 'Friend deleted' });
    } else {
      res.status(404).json({ message: 'Friend not found' });
    }
  } catch (error) {
    console.error('Error deleting friend:', error.message);
    res.status(500).json({ message: error.message });
  }
};
