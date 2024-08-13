const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Simple Route
app.get("/", (req, res) => {
    res.send("Welcome to the learning space.");
});

// Routes from HEAD branch
const usageRoutes = require('./routes/usageRoutes');
const friendsRoutes = require('./routes/friendsRoutes');
const messagesRoutes = require('./routes/messagesRoutes');
const notificationsRoutes = require('./routes/notificationsRoutes');
const staffRoutes = require('./routes/staff');
const quizRoute = require('./routes/quiz');
const questionRoute = require('./routes/question');
const userquizhistoryRoute = require('./routes/UserQuizHistory');
const resource = require('./routes/resource');
const resourceContent = require('./routes/resourceContent');
const eventRoute = require('./routes/event');
const eventHistoryRoute = require('./routes/eventHistory'); 
const fileRoute = require('./routes/file');
const signupRoute = require('./routes/signup');
const userRoute = require('./routes/user');  // User route registered under /api/user
const staffRoute = require('./routes/staff');
const markerRoute = require('./routes/marker');
const sendquizemailRoute = require('./routes/quizEmail');

// Routes from Feedback branch
const dataFeedback = require('./routes/datafeedback');

// Apply routes
app.use('/api/usage', usageRoutes);
app.use('/api/friends', friendsRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/staff', staffRoutes);
app.use("/quiz", quizRoute);
app.use("/quiz/question", questionRoute);
app.use("/user/quiz", userquizhistoryRoute);
app.use("/resource", resource);
app.use("/resourceContent", resourceContent);
app.use("/event", eventRoute);
app.use('/eventHistory', eventHistoryRoute);
app.use("/file", fileRoute);
app.use("/signup", signupRoute);
app.use("/api/user", userRoute);  // Ensure /api/user handles login, registration, etc.
app.use("/datafeedback", dataFeedback);
app.use('/staff', staffRoute);
app.use('/marker', markerRoute);
app.use('/sendquizemail', sendquizemailRoute);

// This middleware will catch all undefined API routes and return a JSON error response
app.use((req, res, next) => {
    if (req.url.startsWith('/api/')) {
        res.status(404).json({ error: 'API route not found' });
    } else {
        next();
    }
});

console.log('Routes have been set up.');

const db = require('./models');
db.sequelize.sync({force : true})  // Change to true if you want to drop and recreate the database each time.
    .then(() => {
        const port = process.env.APP_PORT || 3001;
        app.listen(port, () => {
            console.log(`⚡ Server running on http://localhost:${port}`);
        });
    })
    .catch((err) => {
        console.log('Unable to connect to the database:', err);
    });
