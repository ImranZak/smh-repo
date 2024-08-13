const express = require('express');
const {sendQuizResultEmail} = require('../middlewares/email');
const router = express.Router();

// Route that utilizes the email middleware
router.post('/', (req, res) => {
    const { to, quizTitle, score } = req.body;

    if (!to || !quizTitle || !score) {
        return res.status(400).send('Missing required fields');
    }

    sendQuizResultEmail(to, quizTitle, score)
        .then(() => {
            res.status(200).send('Email sent successfully');
        })
        .catch((error) => {
            console.error('Error sending email:', error);
            res.status(500).send('Failed to send email');
        });
});

module.exports = router;