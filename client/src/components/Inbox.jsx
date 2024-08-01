import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { List, ListItem, ListItemText, Button, TextField, Grid, Typography, Container } from '@mui/material';

const Inbox = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState({ recipient: '', subject: '', content: '' });

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const result = await axios.get('/api/messages');
        setMessages(result.data);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };
    fetchMessages();
  }, []);

  const handleSendMessage = async () => {
    try {
      await axios.post('/api/messages', newMessage);
      setNewMessage({ recipient: '', subject: '', content: '' });
      alert('Message sent successfully');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <Container>
      <Typography variant="h6">Inbox</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Recipient"
            value={newMessage.recipient}
            onChange={(e) => setNewMessage({ ...newMessage, recipient: e.target.value })}
            fullWidth
          />
          <TextField
            label="Subject"
            value={newMessage.subject}
            onChange={(e) => setNewMessage({ ...newMessage, subject: e.target.value })}
            fullWidth
          />
          <TextField
            label="Content"
            value={newMessage.content}
            onChange={(e) => setNewMessage({ ...newMessage, content: e.target.value })}
            fullWidth
            multiline
            rows={4}
          />
          <Button variant="contained" onClick={handleSendMessage}>Send Message</Button>
        </Grid>
      </Grid>
      <Typography variant="h6" style={{ marginTop: '20px' }}>Messages</Typography>
      <List>
        {messages.map((message, index) => (
          <ListItem key={index}>
            <ListItemText primary={message.subject} secondary={message.content} />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default Inbox;
