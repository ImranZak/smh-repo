import React, { useState, useEffect, useContext } from 'react';
import UserContext from '../contexts/UserContext';
import http from '../http'; // Import the correct http instance

const Friends = () => {
    const [friends, setFriends] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResult, setSearchResult] = useState(null);
    const { user } = useContext(UserContext);

    useEffect(() => {
        if (user) {
            fetchFriends();
        }
    }, [user]);

    const fetchFriends = async () => {
        try {
            const response = await http.get(`/api/friends/${user.id}`);
            setFriends(response.data);
        } catch (error) {
            console.error('Error fetching friends:', error);
            setFriends([]);
        }
    };

    const searchUser = async () => {
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
        try {
            await http.post(`/api/friends/${user.id}`, { friendId });
            fetchFriends();
        } catch (error) {
            console.error('Error adding friend:', error);
        }
    };

    const acceptFriendRequest = async (friendRequestId) => {
        try {
            await http.post(`/api/friends/accept/${friendRequestId}`);
            fetchFriends();
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
            <h2 style={{ marginBottom: '10px' }}>Friends</h2>
            <ul>
                {friends.length > 0 ? (
                    friends.map(friend => (
                        <li key={friend.friendshipId}>
                            {friend.friend && friend.friend.name ? friend.friend.name : 'Unknown Friend'}
                            {friend.status === 'accepted' ? (
                                <button
                                    onClick={() => removeFriend(friend.friendshipId)}
                                    style={{
                                        marginLeft: '10px',
                                        padding: '5px 10px',
                                        borderRadius: '5px',
                                        border: 'none',
                                        backgroundColor: '#dc3545',
                                        color: '#fff',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Remove
                                </button>
                            ) : friend.isSender ? (
                                <button
                                    onClick={() => removeFriend(friend.friendshipId)}
                                    style={{
                                        marginLeft: '10px',
                                        padding: '5px 10px',
                                        borderRadius: '5px',
                                        border: 'none',
                                        backgroundColor: '#dc3545',
                                        color: '#fff',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Cancel Request
                                </button>
                            ) : (
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button
                                        onClick={() => acceptFriendRequest(friend.friendshipId)}
                                        style={{
                                            padding: '5px 10px',
                                            borderRadius: '5px',
                                            border: 'none',
                                            backgroundColor: '#28a745',
                                            color: '#fff',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Accept
                                    </button>
                                    <button
                                        onClick={() => removeFriend(friend.friendshipId)}
                                        style={{
                                            padding: '5px 10px',
                                            borderRadius: '5px',
                                            border: 'none',
                                            backgroundColor: '#dc3545',
                                            color: '#fff',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Reject
                                    </button>
                                </div>
                            )}
                        </li>
                    ))
                ) : (
                    <li key="no-friends">No friends found</li>
                )}
            </ul>

            <h2 style={{ marginBottom: '10px' }}>Search Users</h2>
            <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter email or name"
                style={{
                    marginTop: '10px',
                    padding: '5px',
                    width: 'calc(100% - 22px)',
                    borderRadius: '5px',
                    border: '1px solid #ccc'
                }}
            />
            <button
                onClick={searchUser}
                style={{
                    marginTop: '10px',
                    padding: '5px 10px',
                    borderRadius: '5px',
                    border: 'none',
                    backgroundColor: '#28a745',
                    color: '#fff',
                    cursor: 'pointer',
                    width: '100%'
                }}
            >
                Search
            </button>
            {searchResult && (
                <div style={{ marginTop: '10px' }}>
                    <p>User found: {searchResult.name} ({searchResult.email})</p>
                    <button
                        onClick={() => addFriend(searchResult.id)}
                        style={{
                            padding: '5px 10px',
                            borderRadius: '5px',
                            border: 'none',
                            backgroundColor: '#17a2b8',
                            color: '#fff',
                            cursor: 'pointer'
                        }}
                    >
                        Add Friend
                    </button>
                </div>
            )}
        </div>
    );
};

export default Friends;
