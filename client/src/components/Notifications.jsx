import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { List, ListItem, ListItemText, Typography } from '@mui/material';

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const mockUserId = 1; // Hardcoded user ID for testing

  useEffect(() => {
    axios.get(`/api/notifications?userId=${mockUserId}`)
      .then(response => {
        // Ensure the response data is an array
        setNotifications(Array.isArray(response.data) ? response.data : []);
      })
      .catch(error => console.error(error));
  }, []);

  return (
    <div>
      <Typography variant="h6">Notifications</Typography>
      <List>
        {notifications.map(notification => (
          <ListItem key={notification.id}>
            <ListItemText primary={notification.message} />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default Notification;
