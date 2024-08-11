const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

// Enable CORS
app.use(cors({
    origin: process.env.CLIENT_URL
}));

// Simple Route
app.get("/", (req, res) => {
    res.send("Welcome to the learning space.");
});
// Routes
const eventRoute = require('./routes/event');
<<<<<<< Updated upstream
app.use("/event", eventRoute);
=======
const fileRoute = require('./routes/file');
const signupRoute = require('./routes/signup');
const userRoute = require('./routes/user');
const staffRoute = require('./routes/staff');
const eventHistoryRoute = require('./routes/eventHistory');

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
app.use("/file", fileRoute);
app.use("/signup", signupRoute);
app.use("/user", userRoute);
app.use("/datafeedback", dataFeedback);
app.use('/staff', staffRoute)
app.use('/eventHistory', eventHistoryRoute);
>>>>>>> Stashed changes

const fileRoute = require('./routes/file');
app.use("/file", fileRoute);

const db = require('./models');
db.sequelize.sync({ alter: true })
    .then(() => {
        let port = process.env.APP_PORT;
        app.listen(port, () => {
            console.log(`⚡ Server running on http://localhost:${port}`);
        });
    })
    .catch((err) => {
        console.log('Unable to connect to the database:', err);
    });