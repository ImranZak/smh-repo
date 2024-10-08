import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import UserContext from '../contexts/UserContext';
import { Button, TextField, Typography } from '@mui/material';

const Messages = () => {
    const { user } = useContext(UserContext);
    const [message, setMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [foundFriends, setFoundFriends] = useState([]);
    const [recipientId, setRecipientId] = useState('');
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        if (user) {
            fetchMessages();
        }
    }, [user]);

    const searchFriends = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await axios.get(`/api/friends/${user.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("API Response:", response);
            if (response.headers['content-type'].includes('application/json')) {
                const friendsList = Array.isArray(response.data) ? response.data : [];
                console.log("Filtered Friends List:", friendsList);
                setFoundFriends(friendsList.filter(friend =>
                    friend.friend.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
                    friend.status === 'accepted'
                ));
            } else {
                console.error("Unexpected data format from friends API:", response.data);
            }
        } catch (error) {
            console.error('Error fetching friends:', error);
        }
    };

    const fetchMessages = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await axios.get(`/api/messages/inbox/${user.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.headers['content-type'].includes('application/json')) {
                setMessages(Array.isArray(response.data) ? response.data : []);
            } else {
                console.error("Unexpected data format from messages API:", response.data);
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const sendMessage = async () => {
        if (!recipientId || !message.trim()) {
            alert("Please select a recipient and enter a message.");
            return;
        }

        try {
            const token = localStorage.getItem('accessToken');
            await axios.post('/api/messages', {
                senderId: user.id,
                recipientId,
                content: message
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setMessage('');
            fetchMessages();
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const handleSelectFriend = (friendId) => {
        setRecipientId(friendId);
    };

    return (
        <div>
            <Typography variant="h5">Messages</Typography>
            <div style={{ margin: '20px 0' }}>
                <TextField
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search for a friend to message"
                    fullWidth
                    variant="outlined"
                    style={{ marginBottom: '10px' }}
                />
                <Button variant="contained" color="primary" onClick={searchFriends}>
                    Search Friends
                </Button>

                <div style={{ marginTop: '10px' }}>
                    {foundFriends.length > 0 ? (
                        foundFriends.map(friend => (
                            <div key={friend.friend.id} style={{ marginBottom: '10px' }}>
                                <Button
                                    variant="outlined"
                                    color={recipientId === friend.friend.id ? 'secondary' : 'default'}
                                    onClick={() => handleSelectFriend(friend.friend.id)}
                                >
                                    {friend.friend.name}
                                </Button>
                            </div>
                        ))
                    ) : (
                        <Typography>No friends found. Try searching with different terms.</Typography>
                    )}
                </div>

                <TextField
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter your message"
                    fullWidth
                    multiline
                    rows={4}
                    variant="outlined"
                    style={{ marginTop: '10px' }}
                />
                <Button variant="contained" color="primary" onClick={sendMessage} style={{ marginTop: '10px' }}>
                    Send Message
                </Button>
                <Button variant="outlined" color="secondary" onClick={fetchMessages} style={{ marginLeft: '10px', marginTop: '10px' }}>
                    Refresh Messages
                </Button>
            </div>
            <div style={{ marginTop: '20px' }}>
                <Typography variant="h6">Inbox</Typography>
                <ul>
                    {Array.isArray(messages) && messages.length > 0 ? (
                        messages.map((msg) => (
                            <li key={msg.id}>
                                <strong>From:</strong> {msg.sender.name}<br />
                                <strong>Message:</strong> {msg.content}
                            </li>
                        ))
                    ) : (
                        <li>No messages found.</li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default Messages;
