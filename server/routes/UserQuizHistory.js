const express = require('express');
const router = express.Router();
const { UserQuizHistory } = require('../models');
const { User } = require('../models');
const { Op } = require("sequelize");
const yup = require('yup');
const sendQuizResultEmail = require('../middlewares/email');

router.post('/userhistory/:quizId', async (req, res) => {
    let data = req.body;
    const { quizId } = req.params;
    const { userId, title, description, score, dateTaken } = data;

    try {
        const userInfo = await User.findByPk(userId);
        if (!userInfo) {
            return res.status(404).json({ message: 'User not found' });
        }

        let validationSchema = yup.object({
            quizId: yup.number().integer().required(),
            userId: yup.number().integer().required(),
            title: yup.string().trim().max(100).required(),
            description: yup.string().trim().required(),
            score: yup.number().integer().min(0).max(100).required(),
            dateTaken: yup.date().required()
        });

        data = await validationSchema.validate({ quizId, userId, title, description, score, dateTaken }, { abortEarly: false });
        data.quizid = parseInt(quizId, 10);

        console.log('Data to be inserted:', data); // Log data to be inserted
        await UserQuizHistory.create(data);

        // // Send response after successfully creating the history
        // await sendQuizResultEmail(userInfo.email, title, score);
        // return res.status(200).json({ message: 'Quiz history saved and email sent' });

    } catch (err) {
        if (err instanceof yup.ValidationError) {
            console.error('Validation error:', err.errors);
            return res.status(400).json({ errors: err.errors });
        }
        console.error('Internal server error:', err);
        return res.status(500).json({ error: err.message });
    }
});


// Get all quiz history for the logged-in user
router.get('/userhistory/:id', async (req, res) => {
    let id = req.params.id;
    try {
        const history = await UserQuizHistory.findAll({ where: { userid: id }, order: [['id', 'ASC']] });
        res.json(history);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update a specific quiz history record
router.put('/userhistory/:quizid', async (req, res) => {
    const { quizid, id } = req.params;
    let data = req.body;

    let validationSchema = yup.object({
        quizid: yup.number().integer().required(),
        userid: yup.number().integer().required(),
        title: yup.string().trim().max(100).required(),
        description: yup.string().trim().required(),
        score: yup.number().integer().min(0).max(100).required(),
        dateTaken: yup.date().required()
    });

    try {
        data = await validationSchema.validate(data, { abortEarly: false });
        data.quizid = parseInt(quizid, 10);
        data.userid = parseInt(userid, 10);
        let [num] = await UserQuizHistory.update(data, { where: { id: id, quizid: quizid, userid: userid } });
        if (num === 1) {
            res.json({ message: "User's quiz history was updated successfully." });
        } else {
            res.status(400).json({ message: `Cannot update User's quiz history with id ${id}.` });
        }
    } catch (err) {
        if (err instanceof yup.ValidationError) {
            return res.status(400).json({ errors: err.errors });
        }
        res.status(500).json({ error: err.message });
    }
});

// Delete a specific quiz history record
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await UserQuizHistory.destroy({ where: { id, userid: req.user.id } });

        if (deleted === 1) {
            res.json({ message: 'Quiz history deleted successfully' });
        } else {
            res.status(404).json({ error: 'Quiz history not found' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
