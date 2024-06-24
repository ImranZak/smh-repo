const express = require('express');
const router = express.Router();
const { Question } = require('../models');
const { Op } = require("sequelize");
const yup = require("yup");

// Create a question
router.post("/:quizId", async (req, res) => {
    let data = req.body;
    const { quizId } = req.params;
    
    // Validate request body
    let validationSchema = yup.object({
        question_text: yup.string().trim().required(),
        question_type: yup.string().trim().oneOf(['multiple_choice', 'Open_Ended']).required(),
        answer_text: yup.string().trim().required()
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

// Get all questions for a quiz
router.get('/:quizId', async (req, res) => {
    const { quizId } = req.params;
    let condition = { quizId };

    // Search functionality
    let search = req.query.search;
    if (search) {
        condition[Op.or] = [
            { question_text: { [Op.like]: `%${search}%` } },
            { question_type: { [Op.like]: `%${search}%` } },
            { answer_text: { [Op.like]: `%${search}%` } }
        ];
    }

    try {
        let list = await Question.findAll({
            where: condition,
            order: [['id', 'ASC']]
        });
        res.json(list);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update a question
router.put("/:quizId/:id", async (req, res) => {
    const { id, quizId } = req.params;
    let data = req.body;

    // Validate request body
    let validationSchema = yup.object({
        question_text: yup.string().trim().required(),
        question_type: yup.string().trim().oneOf(['multiple_choice', 'Open_Ended']).required(),
        answer_text: yup.string().trim().required()
    });

    try {
        // Process valid data
        data = await validationSchema.validate(data, { abortEarly: false });
        data.quizId = parseInt(quizId, 10); // Ensure quizId is added to the data

        let [num] = await Question.update(data, { where: { id, quizId } });
        if (num === 1) {
            res.json({ message: "Question was updated successfully." });
        } else {
            res.status(400).json({ message: `Cannot update Question with id ${id}.` });
        }
    } catch (err) {
        res.status(400).json({ errors: err.errors });
    }
});

// Delete a question
router.delete("/:quizId/:id", async (req, res) => {
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
