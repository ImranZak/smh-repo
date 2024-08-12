const express = require('express');
const router = express.Router();
const friendsController = require('../controllers/friendsController');

router.get('/:userId', friendsController.getAllFriends);
router.get('/requests/:userId', friendsController.getFriendRequests);
router.post('/:userId', friendsController.addFriend);
router.delete('/:userId/:friendshipId', friendsController.deleteFriend);
router.post('/accept/:friendRequestId', friendsController.acceptFriendRequest);

module.exports = router;
