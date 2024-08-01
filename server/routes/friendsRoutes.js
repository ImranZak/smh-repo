const express = require('express');
const router = express.Router();
const friendsController = require('../controllers/friendsController');

router.get('/', friendsController.getAllFriends);
router.post('/', friendsController.addFriend);
router.delete('/:id', friendsController.deleteFriend);

module.exports = router;
