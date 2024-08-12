const express = require('express');
const router = express.Router();
const { SignUp, Event } = require('../models');
const { Op } = require("sequelize");
const yup = require("yup");
const { validateToken } = require('../middlewares/auth');

router.get("/", validateToken, async (req, res) => {
    try {
        const userid = req.user.id; // Assuming `validateToken` middleware sets the logged-in user's ID in req.user
        const signups = await SignUp.findAll({
            where: { userid: userid },
            include: [
                { model: Event, as: "event" }, // Include event details
            ],
            order: [['createdAt', 'DESC']]
        });
        res.json(signups);
    } catch (err) {
        console.error('Error fetching user events:', err);
        res.status(500).json({ error: 'Failed to retrieve events' });
    }
});

module.exports = router;