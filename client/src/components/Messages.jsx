import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import UserContext from '../contexts/UserContext';
import { Button, TextField, Typography, List, ListItem, ListItemText, Divider, Box } from '@mui/material';

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
            if (response.headers['content-type'].includes('application/json')) {
                const friendsList = Array.isArray(response.data) ? response.data : [];
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
            setMessage('');  // Clear the input after sending
            fetchMessages();
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const handleSelectFriend = (friendId) => {
        setRecipientId(friendId);
    };

    return (
        <Box>
            <Typography variant="h5">Messages</Typography>
            <Box marginY={2}>
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

                <Box marginTop={2}>
                    {foundFriends.length > 0 ? (
                        foundFriends.map(friend => (
                            <Box key={friend.friend.id} marginBottom={2}>
                                <Button
                                    variant={recipientId === friend.friend.id ? 'contained' : 'outlined'}
                                    color={recipientId === friend.friend.id ? 'secondary' : 'default'}
                                    onClick={() => handleSelectFriend(friend.friend.id)}
                                    fullWidth
                                >
                                    {friend.friend.name}
                                </Button>
                            </Box>
                        ))
                    ) : (
                        <Typography>No friends found. Try searching with different terms.</Typography>
                    )}
                </Box>

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
            </Box>
            <Box marginTop={4}>
                <Typography variant="h6">Inbox</Typography>
                <List>
                    {Array.isArray(messages) && messages.length > 0 ? (
                        messages.map((msg) => (
                            <React.Fragment key={msg.id}>
                                <ListItem alignItems="flex-start">
                                    <ListItemText
                                        primary={`From: ${msg.sender.name}`}
                                        secondary={
                                            <>
                                                <Typography
                                                    component="span"
                                                    variant="body2"
                                                    color="textPrimary"
                                                >
                                                    {msg.content}
                                                </Typography>
                                                {" — "}
                                                {new Date(msg.createdAt).toLocaleString()}
                                            </>
                                        }
                                    />
                                </ListItem>
                                <Divider component="li" />
                            </React.Fragment>
                        ))
                    ) : (
                        <ListItem>
                            <ListItemText primary="No messages found." />
                        </ListItem>
                    )}
                </List>
            </Box>
        </Box>
    );
};

export default Messages;
