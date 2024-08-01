import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Messages = () => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const response = await axios.get('http://localhost:3001/api/messages');
            setMessages(response.data);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const sendMessage = async () => {
        try {
            const response = await axios.post('http://localhost:3001/api/messages', { content: newMessage });
            setMessages([...messages, response.data]);
            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const deleteMessage = async (id) => {
        try {
            await axios.delete(`http://localhost:3001/api/messages/${id}`);
            setMessages(messages.filter(message => message.id !== id));
        } catch (error) {
            console.error('Error deleting message:', error);
        }
    };

    return (
        <div>
            <h2>Messages</h2>
            <input 
                type="text" 
                value={newMessage} 
                onChange={(e) => setNewMessage(e.target.value)} 
                placeholder="Send a new message" 
            />
            <button onClick={sendMessage}>Send Message</button>
            <ul>
                {messages.map(message => (
                    <li key={message.id}>
                        {message.content}
                        <button onClick={() => deleteMessage(message.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Messages;