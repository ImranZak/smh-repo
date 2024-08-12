import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Friends = () => {
    const [friends, setFriends] = useState([]);
    const [newFriend, setNewFriend] = useState('');

    useEffect(() => {
        fetchFriends();
    }, []);

    const fetchFriends = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/friends');
            setFriends(response.data);
        } catch (error) {
            console.error('Error fetching friends:', error);
        }
    };

    const addFriend = async () => {
        try {
            const response = await http.get(`/api/user/search`, {
                params: { search: searchQuery },
            });
            setSearchResult(response.data);
        } catch (error) {
            console.error('Error searching user:', error);
            setSearchResult(null);
        }
    };

    const addFriend = async (friendId) => {
        if (!friendId) {
            console.error('No friendId provided');
            return;
        }
        try {
            await http.post(`/api/friends/${user.id}`, { friendId });
            fetchFriends();
        } catch (error) {
            console.error('Error adding friend:', error);
        }
    };
    

    const acceptFriendRequest = async (friendRequestId) => {
        try {
            await axios.delete(`http://localhost:3001/api/friends/${id}`);
            setFriends(friends.filter(friend => friend.id !== id));
        } catch (error) {
            console.error('Error accepting friend request:', error);
        }
    };

    const removeFriend = async (friendshipId) => {
        try {
            await http.delete(`/api/friends/${user.id}/${friendshipId}`);
            fetchFriends();
        } catch (error) {
            console.error('Error removing friend:', error);
        }
    };

    return (
        <div>
            <h2>Friends List</h2>
            <input 
                type="text" 
                value={newFriend} 
                onChange={(e) => setNewFriend(e.target.value)} 
                placeholder="Add a new friend" 
            />
            <button onClick={addFriend}>Add Friend</button>
            <ul>
                {friends.map(friend => (
                    <li key={friend.id}>
                        {friend.name}
                        <button onClick={() => deleteFriend(friend.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Friends;
