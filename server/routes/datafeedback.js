const express = require('express');
const router = express.Router();
const { DataFeedback, User } = require('../models'); // Added User model for user lookup
const { Op } = require("sequelize");
const yup = require("yup");

router.post("/", async (req, res) => {
    let data = req.body;

    // Validate request body
    let validationSchema = yup.object({
        name: yup.string().trim().min(3).max(80).required(),
        ranking: yup.number().min(0).max(5).required(),
        best: yup.string().trim().min(3).max(500).required(),
        improvement: yup.string().trim().min(3).max(500).required()
    });

    try {
        data = await validationSchema.validate(data, { abortEarly: false });

        // Fetch the user from the database
        const user = await User.findOne({ where: { name: data.name } });
        if (!user) {
            return res.status(400).json({ errors: ['The name does not match the account.'] });
        }

        // Process valid data
        let result = await DataFeedback.create(data);
        res.json(result);
    } catch (err) {
        res.status(400).json({ errors: err.errors });
    }
});

router.get("/", async (req, res) => {
    let condition = {};
    let search = req.query.search;
    if (search) {
        condition[Op.or] = [
            { name: { [Op.like]: `%${search}%` } },
            { ranking: { [Op.like]: `%${search}%` } },
            { best: { [Op.like]: `%${search}%` } },
            { improvement: { [Op.like]: `%${search}%` } }
        ];
    }

    let list = await DataFeedback.findAll({
        where: condition,
        order: [['createdAt', 'DESC']]
    });
    res.json(list);
});

router.get("/:id", async (req, res) => {
    let id = req.params.id;
    let datafeedback = await DataFeedback.findByPk(id);
    if (!datafeedback) {
        res.sendStatus(404);
        return;
    }
    res.json(datafeedback);
});

router.put("/:id", async (req, res) => {
    let id = req.params.id;
    let datafeedback = await DataFeedback.findByPk(id);
    if (!datafeedback) {
        res.sendStatus(404);
        return;
    }

    let data = req.body;
    let validationSchema = yup.object({
        name: yup.string().trim().min(3).max(80).required(),
        ranking: yup.number().min(0).max(5).required(),
        best: yup.string().trim().min(3).max(500).required(),
        improvement: yup.string().trim().min(3).max(500).required()
    });

    try {
        data = await validationSchema.validate(data, { abortEarly: false });
        let num = await DataFeedback.update(data, { where: { id: id } });
        if (num == 1) {
            res.json({ message: "DataFeedback was updated successfully." });
        } else {
            res.status(400).json({ message: `Cannot update DataFeedback with id ${id}.` });
        }
    } catch (err) {
        res.status(400).json({ errors: err.errors });
    }
});

router.delete("/:id", async (req, res) => {
    let id = req.params.id;
    let num = await DataFeedback.destroy({ where: { id: id } });
    if (num == 1) {
        res.json({ message: "DataFeedback was deleted successfully." });
    } else {
        res.status(400).json({ message: `Cannot delete DataFeedback with id ${id}.` });
    }
});

module.exports = router;