import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { List, ListItem, ListItemText, Typography } from '@mui/material';

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Fetch the user's ID and then fetch their notifications
    const fetchUserAndNotifications = async () => {
      try {
        const userResponse = await axios.get('/api/user');
        setUserId(userResponse.data.id);

        const response = await axios.get(`/api/notifications/${userResponse.data.id}`);
        setNotifications(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchUserAndNotifications();
  }, []);

  return (
    <div>
      <Typography variant="h6">Notifications</Typography>
      <List>
        {notifications.map((notification, index) => (
          <ListItem key={index}>
            <ListItemText primary={notification.message} />
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default Notification;