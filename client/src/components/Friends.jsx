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
            const response = await axios.post('http://localhost:3001/api/friends', { name: newFriend });
            setFriends([...friends, response.data]);
            setNewFriend('');
        } catch (error) {
            console.error('Error adding friend:', error);
        }
    };

    const deleteFriend = async (id) => {
        try {
            await axios.delete(`http://localhost:3001/api/friends/${id}`);
            setFriends(friends.filter(friend => friend.id !== id));
        } catch (error) {
            console.error('Error deleting friend:', error);
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
