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
const quizRoute = require('./routes/quiz');
app.use("/quiz", quizRoute);

const questionRoute = require('./routes/question');
app.use("/quiz/question", questionRoute);

const userquizhistoryRoute = require('./routes/UserQuizHistory');
app.use("/user/quiz", userquizhistoryRoute);

const resource = require('./routes/resource');
app.use("/resource", resource);

const resourceContent = require('./routes/resourceContent');
app.use("/resourceContent", resourceContent);

const eventRoute = require('./routes/event');
app.use("/event", eventRoute);

const fileRoute = require('./routes/file');
app.use("/file", fileRoute);
// Routes
const staffRoute = require('./routes/staff');
app.use("/staff", staffRoute);
const userRoute = require('./routes/user'); 
app.use("/user", userRoute);

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
