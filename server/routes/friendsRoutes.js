const express = require('express');
const router = express.Router();
const friendsController = require('../controllers/friendsController');

router.get('/:userId', friendsController.getAllFriends);  // Fetch friends and pending requests by userId
router.get('/requests/:userId', friendsController.getFriendRequests); // Fetch friend requests by userId
router.post('/:userId', friendsController.addFriend);     // Add a friend by userId
router.delete('/:userId/:friendshipId', friendsController.deleteFriend);
router.post('/accept/:friendRequestId', friendsController.acceptFriendRequest); // Accept a friend request

module.exports = router;
