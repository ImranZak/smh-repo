// routes/friendsRoutes.js
const express = require('express');
const router = express.Router();
const friendsController = require('../controllers/friendsController');
const authenticateToken = require('../middleware/authenticateToken');

router.get('/friends', authenticateToken, friendsController.getAllFriends);
router.post('/friends', authenticateToken, friendsController.addFriend);
router.delete('/friends/:id', authenticateToken, friendsController.removeFriend);

module.exports = router;
