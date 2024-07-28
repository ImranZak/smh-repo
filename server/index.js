const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());

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

const db = require('./models');
db.sequelize.sync({ alter: true })
    .then(() => {
        let port = process.env.APP_PORT;
        app.listen(port, () => {
            console.log(`⚡ Sever running on http://localhost:${port}`);
        });
    })
    .catch((err) => {
        console.log(err);
    });