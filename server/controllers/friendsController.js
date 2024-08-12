const Friend = require('../models/Friend');

exports.getAllFriends = async (req, res) => {
    try {
        const { userId } = req.params;
        const friends = await Friend.findAll({
            where: {
                [Op.or]: [
                    { userId },
                    { friendId: userId }
                ],
                status: 'accepted'
            },
            include: [
                {
                    model: User,
                    as: 'user', 
                    attributes: ['id', 'name', 'email']
                },
                {
                    model: User,
                    as: 'friendUser', 
                    attributes: ['id', 'name', 'email']
                }
            ]
        });

        const formattedFriends = friends.map(friend => {
            const isSender = (friend.userId === parseInt(userId));  // Determine if current user is the sender
            const friendData = isSender ? friend.friendUser : friend.user;
            return {
                friendshipId: friend.id,
                friend: friendData,
                status: friend.status,
                isSender: isSender,  // Include whether the current user is the sender
                createdAt: friend.createdAt,
                updatedAt: friend.updatedAt
            };
        });

        res.json(formattedFriends);
    } catch (error) {
        console.error('Error fetching friends:', error.message);
        res.status(500).json({ message: 'Failed to fetch friends. Please try again later.' });
    }
};

exports.getFriendRequests = async (req, res) => {
    try {
        const { userId } = req.params;
        const friendRequests = await Friend.findAll({
            where: { friendId: userId, status: 'pending' },
            include: [
                {
                    model: User,
                    as: 'user', 
                    attributes: ['id', 'name', 'email']
                }
            ]
        });

        console.log('Pending Friend Requests:', friendRequests); // Log the pending requests

        res.json(friendRequests);
    } catch (error) {
        console.error('Error fetching friend requests:', error.message);
        res.status(500).json({ message: 'Failed to fetch friend requests. Please try again later.' });
    }
};

// Add a friend request
exports.addFriend = async (req, res) => {
    try {
        const { userId } = req.params;
        const { friendId } = req.body;

        if (!friendId) {
            console.log('Friend ID is missing.');
            return res.status(400).json({ message: 'Friend ID is required.' });
        }

        const existingFriendship = await Friend.findOne({
            where: {
                [Op.or]: [
                    { userId, friendId },
                    { userId: friendId, friendId: userId }
                ]
            }
        });

        if (existingFriendship) {
            console.log('Existing friendship or request found:', existingFriendship);
            return res.status(400).json({ message: 'Friend request or friendship already exists.' });
        }

        const newFriendRequest = await Friend.create({
            userId: userId,
            friendId: friendId,
            status: 'pending',
        });

        const friendData = await User.findByPk(friendId, {
            attributes: ['id', 'name', 'email']
        });

        console.log('Friend request successfully created:', newFriendRequest);
        res.status(201).json({
            friendship: newFriendRequest,
            friend: friendData
        });
    } catch (error) {
        console.error('Error adding friend request:', error.message);
        res.status(500).json({ message: 'Failed to add friend request. Please try again later.' });
    }
};

// Accept a friend request
exports.acceptFriendRequest = async (req, res) => {
    try {
        const { friendRequestId } = req.params;

        const friendRequest = await Friend.findByPk(friendRequestId);

        if (!friendRequest) {
            return res.status(404).json({ message: 'Friend request not found.' });
        }

        friendRequest.status = 'accepted';
        await friendRequest.save();

        res.status(200).json(friendRequest);
    } catch (error) {
        console.error('Error accepting friend request:', error.message);
        res.status(500).json({ message: 'Failed to accept friend request. Please try again later.' });
    }
};

// Delete a friend
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
