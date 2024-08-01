const express = require('express');
const router = express.Router();
const { UserQuizHistory } = require('../models');
const { Op } = require("sequelize");
const yup = require('yup');

// Create a new quiz history record
router.post('/userhistory/:quizid', async (req, res) => {
    let data = req.body;
    const { quizid } = req.params;
    const { userid, title, description, score, dateTaken } = data;

    let validationSchema = yup.object({
        quizid: yup.number().integer().required(),
        userid: yup.number().integer().required(),
        title: yup.string().trim().max(100).required(),
        description: yup.string().trim().required(),
        score: yup.number().integer().min(0).max(100).required(),
        dateTaken: yup.date().required()
    });

    try {
        data = await validationSchema.validate({ quizid, userid, title, description, score, dateTaken }, { abortEarly: false });
        data.quizid = parseInt(quizid, 10);

        console.log('Data to be inserted:', data); // Log data to be inserted
        const newHistory = await UserQuizHistory.create(data);
        res.json(newHistory);
    } catch (err) {
        if (err instanceof yup.ValidationError) {
            console.error('Validation error:', err.errors);
            return res.status(400).json({ errors: err.errors });
        }
        console.error('Internal server error:', err);
        res.status(500).json({ error: err.message });
    }
});

// Get all quiz history for the logged-in user
router.get('/userhistory/:id', async (req, res) => {
    let id = req.params.id;
    try {
        const history = await UserQuizHistory.findAll({ where: { userid: id }, order: [['id', 'ASC']]  });
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
