const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { User } = require("../models");
const yup = require("yup");
const { sign } = require('jsonwebtoken'); 
const { validateToken } = require('../middlewares/auth');
require('dotenv').config();


// Register User
router.post("/register", async (req, res) => {
    let data = req.body;

    // Validate request body 
    let validationSchema = yup.object({ 
        // TODO: Update this to match staff model AFTER review 2
        name: yup.string().trim().min(3).max(50).required()
        .matches(/^[a-zA-Z '-,.]+$/, "name only allow letters, spaces and characters: ' - , ."),
        email: yup.string().trim().lowercase().email().max(50).matches(/^(?!.*@smhstaff\.com$).+$/, "Invalid email").required(),
        password: yup.string().trim().min(8).max(50).required()
        .matches(/^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/, "password at least 1 letter and 1 number")
    });
    try {
        data = await validationSchema.validate(data, { abortEarly: false });
        // Process valid data …
    } catch (err) {
        res.status(400).json({ errors: err.errors });
    }

    // Check email 
    let user = await User.findOne(
        { where: { email: data.email } 
    });
    if (user) {
        res.status(400).json({ message: "Email already exists." });
        return;
    }

    // Hash password
    data.password = await bcrypt.hash(data.password, 10);
    // Create user
    let result = await User.create(data);
    res.json({ message: `Email ${result.email} was registered successfully.` });
});


// Login User
router.post("/login", async (req, res) => {
    let data = req.body;

    // Validate request body
    let validationSchema = yup.object({
        email: yup.string().trim().lowercase().email().max(50).required(),
        password: yup.string().trim().min(8).max(50).required()
    });

    try {
        data = await validationSchema.validate(data,
            { abortEarly: false });

        // Check email and password
        let errorMsg = "Email or password is not correct.";
        let user = await User.findOne({
            where: { email: data.email }
        });
        if (!user) {
            res.status(400).json({ message: errorMsg });
            return;
        }
        let match = await bcrypt.compare(data.password, user.password);
        if (!match) {
            res.status(400).json({ message: errorMsg });
            return;
        }

        // Return user info
        let userInfo = {
            id: user.id,
            email: user.email,
            name: user.name
        };
        let accessToken = sign(userInfo, process.env.APP_SECRET, 
            { expiresIn: process.env.TOKEN_EXPIRES_IN });
        res.json({
            accessToken: accessToken,
            user: userInfo
        });
    }
    catch (err) {
        res.status(400).json({ errors: err.errors });
        return;
    }
});


// Authenticate User
router.get("/auth", validateToken, (req, res) => {
    let userInfo = {
        id: req.user.id,
        email: req.user.email,
        name: req.user.name,
    };
    res.json({ 
        user: userInfo 
    });
});

// TODO: Continue lab5b by adding Booking table and one-to-many relationship between them

module.exports = router;
