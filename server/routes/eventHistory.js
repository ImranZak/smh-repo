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

router.delete("/:id", validateToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const signupId = req.params.id;

        // Check if the sign-up exists and belongs to the user
        const signup = await SignUp.findOne({
            where: { id: signupId, userId: userId }
        });

        if (!signup) {
            return res.status(404).json({ error: 'Sign-up not found or does not belong to this user' });
        }

        // Delete the sign-up
        await signup.destroy();
        res.json({ message: 'Sign-up cancelled successfully' });
    } catch (err) {
        console.error('Error cancelling sign-up:', err);
        res.status(500).json({ error: 'Failed to cancel sign-up' });
    }
});

module.exports = router;