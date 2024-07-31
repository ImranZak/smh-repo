const express = require('express');
const router = express.Router();
const { Quiz } = require('../models')
const { Op } = require("sequelize");
const yup = require("yup");

router.post("/", async (req, res) => {
    let data = req.body;
    // Validate request body
    let validationSchema = yup.object({
        title: yup.string().trim().max(100).required(),
        description: yup.string().trim().required(),
        status: yup.string().trim().oneOf(["Active", "Inactive"]).required(),
        tag: yup.string().trim().oneOf(['waste reduction', 'energy conservation', 'water management', 'green living tips']).required()
    });
    try {
        data = await validationSchema.validate(data,
            { abortEarly: false });
        // Process valid data
        let result = await Quiz.create(data);
        res.json(result);
    }
    catch (err) {
        if (err instanceof yup.ValidationError) {
            return res.status(400).json({ error: err.errors });
        }
        res.status(500).json({ error: err.message });
    }
});

router.get("/", async (req, res) => {
    let condition = {};
    let search = req.query.search;
    if (search) {
        condition[Op.or] = [
            { title: { [Op.like]: `%${search}%` } },
            { description: { [Op.like]: `%${search}%` } },
            { status: { [Op.like]: `%${search}%` } },
            { tag: { [Op.like]: `%${search}%` } }
        ];
    }
    // You can add condition for other columns here
    // e.g. condition.columnName = value;

    let list = await Quiz.findAll({
        where: condition,
        order: [['id', 'ASC']]
    });
    res.json(list);
});

router.get("/:id", async (req, res) => {
    const id = req.params.id;

    try {
        let quiz = await Quiz.findByPk(id);

        if (!quiz) {
            return res.status(404).json({ error: 'Quiz not found' });
        }

        res.json(quiz);
    } catch (error) {
        console.error('Error fetching quiz:', error);
        res.status(500).json({ error: 'An error occurred while fetching the quiz' });
    }
});

router.put("/:id", async (req, res) => {
    let id = req.params.id;
    // Check id not found
    let quiz = await Quiz.findByPk(id);
    if (!quiz) {
        res.sendStatus(404);
        return;
    }
    let data = req.body;
    let validationSchema = yup.object({
        title: yup.string().trim().max(100).required(),
        description: yup.string().trim().required(),
        status: yup.string().trim().oneOf(["Active", "Inactive"]).required(),
        tag: yup.string().trim().oneOf(['waste reduction', 'energy conservation', 'water management', 'green living tips']).required()
    });
    try {

        // Process valid data
        data = await validationSchema.validate(data,
            { abortEarly: false })
        let num = await Quiz.update(data, {
            where: { id: id }
        });
        if (num == 1) {
            res.json({
                message: "Quiz was updated successfully."
            });
        }
        else {
            res.status(400).json({
                message: `Cannot update Quiz with id ${id}.`
            });

        }
    }
    catch (err) {
        res.status(400).json({ errors: err.errors });
    }
});

router.delete("/:id", async (req, res) => {
    let id = req.params.id;
    let num = await Quiz.destroy({
        where: { id: id }
    })
    if (num == 1) {
        res.json({
            message: "Quiz was deleted successfully."
        });
    }
    else {
        res.status(400).json({
            message: `Cannot delete Quiz with id ${id}.`
        });
    }
});

module.exports = router;