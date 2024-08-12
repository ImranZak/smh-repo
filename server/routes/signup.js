const express = require('express');
const router = express.Router();
const { SignUp, Event } = require('../models');
const { Op } = require("sequelize");
const yup = require("yup");
const { validateToken } = require('../middlewares/auth');

router.post("/", validateToken, async (req, res) => {
    let data = req.body;
    // Validate request body
    let validationSchema = yup.object({
        user_name: yup.string().trim().min(3).max(100).required('User Name is required'),
        email: yup.string().trim().email('Invalid email format').required('Email is required'),
        phone: yup.string().trim().matches(/^[0-9]{8}$/, 'Phone number must be exactly 8 digits').required(),
        nric: yup.string().trim().matches(/^[STFG]\d{7}[A-Z]$/, 'Invalid NRIC format').required(),
        eventId: yup.number().required(),
    });
    try {
        data = await validationSchema.validate(data,
            { abortEarly: false });

        const event = await Event.findByPk(data.eventId);
        if (!event) {
            return res.status(404).json({ errors: ['Event not found'] });
        }

        const existingSignUp = await SignUp.findOne({
            where: {
                user_name: data.user_name,
                eventId: data.eventId,
            },
        });

        if (existingSignUp) {
            return res.status(400).json({ errors: ['User already signed up for this event'] });
        }

        data.userId = req.user.id

        let result = await SignUp.create(data);
        res.json(result);
    }
    catch (err) {
        console.error('Validation or DB Error:', err);
        res.status(400).json({ errors: err.errors || ['An error occurred'] });
    }
});

router.get("/", async (req, res) => {
    let condition = {};
    let search = req.query.search;
    if (search) {
        condition[Op.or] = [
            { user_name: { [Op.like]: `%${search}%` } },
            { email: { [Op.like]: `%${search}%` } },
            { phone: { [Op.like]: `%${search}%` } },
            { nric: { [Op.like]: `%${search}%` } },
        ];
    }
    let list = await SignUp.findAll({
        where: condition,
        order: [['createdAt', 'DESC']],
    });
    res.json(list);
});

module.exports = router;