const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const usageRoutes = require('./routes/usageRoutes');
const friendsRoutes = require('./routes/friendsRoutes');
const messagesRoutes = require('./routes/messagesRoutes');
const notificationsRoutes = require('./routes/notificationsRoutes');
const staffRoutes = require('./routes/staffRoutes'); // Add staff routes
const sequelize = require('./utils/database');

const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:3001' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/usage', usageRoutes);
app.use('/api/friends', friendsRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/staff', staffRoutes); // Add staff routes

console.log('Routes have been set up.');

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
