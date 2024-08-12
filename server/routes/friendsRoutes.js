const express = require('express');
const router = express.Router();
const friendsController = require('../controllers/friendsController');

router.get('/friends', friendsController.getAllFriends);
router.post('/friends', friendsController.addFriend);
router.delete('/friends/:id', friendsController.deleteFriend);

module.exports = router;
