const express = require('express');
const router = express.Router();
const { Question } = require('../models');
const { Op } = require("sequelize");
const yup = require("yup");

// Create a question
router.post("/quizzes/:quizId/questions", async (req, res) => {
    let data = req.body;
    const { quizId } = req.params;

    // Validate request body
    let validationSchema = yup.object({
        question_text: yup.string('Must be string').trim().required(),
        question_items: yup.string('Must be string').trim().nullable(),
        question_type: yup.string('Must be string').trim().oneOf(['multiple_choice', 'Open_Ended']).required(),
        answer_text: yup.string('Must be string').trim().required()
    });

    try {
        data = await validationSchema.validate(data, { abortEarly: false });
        data.quizId = parseInt(quizId, 10); // Ensure quizId is added to the data

        // Process valid data
        let result = await Question.create(data);
        res.json(result);
    } catch (err) {
        if (err instanceof yup.ValidationError) {
            return res.status(400).json({ error: err.errors });
        }
        res.status(500).json({ error: err.message });
    }
});

// Update a question
router.put("/quizzes/:quizId/questions/:id", async (req, res) => {
    const { quizId, id } = req.params;
    let data = req.body;

    // Validate request body
    let validationSchema = yup.object({
        question_text: yup.string('Must be string').trim().required(),
        question_items: yup.string('Must be string').trim().nullable(),
        question_type: yup.string('Must be string').trim().oneOf(['multiple_choice', 'Open_Ended']).required(),
        answer_text: yup.string('Must be string').trim().required()
    });

    try {
        // Process valid data
        data = await validationSchema.validate(data, { abortEarly: false });
        data.quizId = parseInt(quizId, 10); // Ensure quizId is added to the data

        let [num] = await Question.update(data, { where: { id: id, quizId: quizId } });
        if (num === 1) {
            res.json({ message: "Question was updated successfully." });
        } else {
            res.status(400).json({ message: `Cannot update Question with id ${id}.` });
        }
    } catch (err) {
        if (err instanceof yup.ValidationError) {
            return res.status(400).json({ error: err.errors });
        }
        res.status(500).json({ error: err.message });

    }
});

// Get all questions for a quiz
router.get('/quizzes/:quizId/questions', async (req, res) => {
    const { quizId } = req.params;
    try {
        let list = await Question.findAll({
            where: { quizId },
            order: [['id', 'ASC']]
        });
        res.json(list);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/quizzes/:quizId/questions/:id', async (req, res) => {
    const { id, quizId } = req.params;
    try {
        const question = await Question.findOne({
            where: { id, quizId }
        });
        if (question) {
            res.json(question);
        } else {
            res.status(404).json({ message: `Question with id ${id} not found.` });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});







// Delete a question
router.delete("/quizzes/:quizId/questions/:id", async (req, res) => {
    const { id, quizId } = req.params;

    try {
        let num = await Question.destroy({ where: { id, quizId } });
        if (num === 1) {
            res.json({ message: "Question was deleted successfully." });
        } else {
            res.status(400).json({ message: `Cannot delete Question with id ${id}.` });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
