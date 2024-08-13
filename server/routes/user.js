const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const { User } = require("../models");
const yup = require("yup");
const { sign } = require('jsonwebtoken'); 
const { validateToken } = require('../middlewares/auth');
const { sendVerifyEmail } = require('../middlewares/email');
require('dotenv').config();

// Regular expressions
const phoneRegex = /^(?:\+\d{1,3})?\d{8,10}$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d\S]{8,100}$/;

// Generate Verification Code
function generateVerificationCode() {
    return bcrypt.hash((Math.floor(Math.random() * (1000000 - 111111 + 1)) + 111111).toString(), 10).toString();
}

// Register User
router.post("/register", async (req, res) => {
    let data = req.body;

    // Validate request body 
    const validationSchema = yup.object({ 
        name: yup.string().trim().min(3).max(50).required()
        .matches(/^[a-zA-Z '-,.]+$/, "Name only allows letters, spaces, and characters: ' - , ."),
        email: yup.string().trim().lowercase().email().max(50).matches(/^(?!.*@smhuser\.com$).+$/, "Invalid email").required(),
        password: yup.string().trim().min(8).max(50).required()
        .matches(passwordRegex, "Password must have 8 characters, 1 uppercase, 1 lowercase, 1 digit, no whitespaces")
    });
    try {
        data = await validationSchema.validate(data, { abortEarly: false });
    } catch (err) {
        return res.status(400).json({ errors: err.errors });
    }

    // Check if email exists
    try {
        const user = await User.findOne({ where: { email: data.email } });
        if (user) {
            return res.status(400).json({ message: "Email already exists." });
        }

        // Hash password and create user
        data.password = await bcrypt.hash(data.password, 10);
        const result = await User.create(data);
        return res.json({ message: `Email ${result.email} was registered successfully.` });
    } catch (err) {
        return res.status(500).json({ message: "Error registering user.", error: err.message });
    }
});

// Login User
router.post("/login", async (req, res) => {
    let data = req.body;

    // Validate request body
    const validationSchema = yup.object({
        email: yup.string().trim().lowercase().email().max(50).required(),
        password: yup.string().trim().min(8).max(50).required()
    });

    try {
        data = await validationSchema.validate(data, { abortEarly: false });

        // Check email and password
        const user = await User.findOne({ where: { email: data.email } });
        if (!user) {
            return res.status(400).json({ message: "Email or password is not correct." });
        }

        const match = await bcrypt.compare(data.password, user.password);
        if (!match) {
            return res.status(400).json({ message: "Email or password is not correct." });
        }

        // Return user info and access token
        const userInfo = { id: user.id, email: user.email, name: user.name };
        const accessToken = sign(userInfo, process.env.APP_SECRET, { expiresIn: process.env.TOKEN_EXPIRES_IN });

        return res.json({ accessToken, user: userInfo });
    } catch (err) {
        return res.status(400).json({ message: "Validation error", errors: err.errors });
    }
});

// Authenticate User
router.get("/auth", validateToken, (req, res) => {
    const userInfo = {
        id: req.user.id,
        email: req.user.email,
        name: req.user.name,
    };
    return res.json({ user: userInfo });
});

// Send verification email
router.post("/verify", async (req, res) => {
    const { email } = req.body;

    try {
        const verificationCode = Math.floor(Math.random() * (1000000 - 111111 + 1)) + 111111;
        const hashedVerificationCode = await bcrypt.hash(verificationCode.toString(), 10);
        
        await User.update({ verificationCode: hashedVerificationCode }, { where: { email } });
        await sendVerifyEmail(email, verificationCode);

        return res.status(200).send('Email sent');
    } catch (error) {
        return res.status(500).send(`Error sending email: ${error.message}`);
    }
});

// Verify user
router.put("/verify/:id", async (req, res) => {
    const id = req.params.id;
    const { verificationCode } = req.body;

    try {
        const user = await User.findByPk(id);
        if (!user) {
            return res.sendStatus(404);
        }

        const match = await bcrypt.compare(verificationCode, user.verificationCode);
        if (!match) {
            return res.status(400).json({ message: "Verification code is incorrect" });
        }

        await User.update({ verified: true }, { where: { id } });
        return res.json({ message: "User was verified successfully." });
    } catch (error) {
        return res.status(500).send(`Error verifying user: ${error.message}`);
    }
});

// Unverify user
router.put("/unverify/:id", async (req, res) => {
    const id = req.params.id;

    try {
        const user = await User.findByPk(id);
        if (!user) {
            return res.sendStatus(404);
        }

        await User.update({ verified: false }, { where: { id } });
        return res.json({ message: "User was unverified successfully." });
    } catch (error) {
        return res.status(500).send(`Error unverifying user: ${error.message}`);
    }
});

// Get All Users (With Optional Search Query)
router.get("/", async (req, res) => {
    const condition = {};
    const search = req.query.search;

    if (search) {
        condition[Op.or] = [
            { name: { [Op.like]: `%${search}%` } },
            { email: { [Op.like]: `%${search}%` } },
            { phoneNumber: { [Op.like]: `%${search}%` } },
            { mailingAddress: { [Op.like]: `%${search}%` } },
        ];
    }
    
    try {
        const list = await User.findAll({
            where: condition,
            order: [['createdAt', 'ASC']]
        });
        return res.json(list);
    } catch (err) {
        return res.status(500).json({ message: "Error fetching users", error: err.message });
    }
});

// Get User By Id
router.get("/:id", async (req, res) => {
    const id = req.params.id;

    try {
        const user = await User.findByPk(id);
        if (!user) {
            return res.sendStatus(404);
        }
        return res.json(user);
    } catch (err) {
        return res.status(500).json({ message: "Error fetching user", error: err.message });
    }
});

// Update User By Id
router.put("/:id", async (req, res) => {
    const id = req.params.id;
    const data = req.body;

    // Validate request body
    const validationSchema = yup.object({
        name: yup.string().max(100, 'Name must be at most 100 characters')
            .matches(/^[a-zA-Z '-,.]+$/, "Name only allows letters, spaces, and characters: ' - , .")
            .required('Name is required'),
        birthDate: yup.date().min(new Date().getFullYear() - 100, `Maximum birth year is ${new Date().getFullYear() - 100}`)
            .max(new Date().getFullYear() - 12, `Minimum birth year is ${new Date().getFullYear() - 12}`)
            .nullable(),
        email: yup.string().email('Invalid email format').max(100, 'Email must be at most 100 characters').required('Email is required'),
        phoneNumber: yup.string().max(20, 'Phone number must be at most 20 characters')
            .matches(phoneRegex, 'Phone number must be 8-10 digits with valid country code if international')
            .nullable(),
        mailingAddress: yup.string().max(100, 'Mailing address must be at most 100 characters').nullable(),
    });

    try {
        const user = await User.findByPk(id);
        if (!user) {
            return res.sendStatus(404);
        }

        const validatedData = await validationSchema.validate(data, { abortEarly: false });
        await User.update(validatedData, { where: { id } });

        return res.json({ message: "User was updated successfully." });
    } catch (err) {
        return res.status(400).json({ errors: err.errors || err.message });
    }
});

// Change User Password By Id
router.put("/password/:id", async (req, res) => {
    const id = req.params.id;
    const { currentPassword, newPassword } = req.body;

    // Validate request body
    const validationSchema = yup.object({
        currentPassword: yup.string().trim().required("Old password is required"),
        newPassword: yup.string().trim().min(8, "Password must be at least 8 characters")
            .max(100, "Password must be at most 100 characters")
            .required("New password is required")
            .matches(passwordRegex, "Password must have 8 characters, 1 uppercase, 1 lowercase, 1 digit, no whitespaces")
    });

    try {
        const user = await User.findByPk(id);
        if (!user) {
            return res.sendStatus(404);
        }

        const validatedData = await validationSchema.validate({ currentPassword, newPassword }, { abortEarly: false });

        const currentPasswordMatch = await bcrypt.compare(validatedData.currentPassword, user.password);
        if (!currentPasswordMatch) {
            return res.status(400).json({ message: "Current password is incorrect" });
        }

        const newPasswordMatch = await bcrypt.compare(validatedData.newPassword, user.password);
        if (newPasswordMatch) {
            return res.status(400).json({ message: "New password cannot match current password" });
        }

        user.password = await bcrypt.hash(validatedData.newPassword, 10);
        await User.update({ password: user.password }, { where: { id } });

        return res.json({ message: "User password was updated successfully." });
    } catch (err) {
        return res.status(400).json({ errors: err.errors || err.message });
    }
});

// Delete User By Id
router.delete("/:id", async (req, res) => {
    const id = req.params.id;

    try {
        const user = await User.findByPk(id);
        if (!user) {
            return res.sendStatus(404);
        }

        await User.destroy({ where: { id } });
        return res.json({ message: "User was deleted successfully." });
    } catch (err) {
        return res.status(500).json({ message: "Error deleting user", error: err.message });
    }
});

// Delete All Users
router.delete("/", async (req, res) => {
    try {
        const userIds = await User.findAll({ attributes: ['id'] });
        
        for (let i = 0; i < userIds.length; i++) {
            await User.destroy({ where: { id: userIds[i].id } });
        }

        return res.json({ message: "All users were deleted successfully." });
    } catch (err) {
        return res.status(500).json({ message: "Failed to delete all users.", error: err.message });
    }
});

// Populate User
router.post("/populate", async (req, res) => {
    try {
        const userIds = await User.findAll({ attributes: ['id'] });
        
        for (let i = 0; i < userIds.length; i++) {
            await User.destroy({ where: { id: userIds[i].id } });
        }

        const userData = [
            {
                name: "Mary Jane",
                birthDate: new Date("1992-01-01"),
                email: "maryjane@gmail.com",
                verified: true,
                phoneNumber: "111111111",
                mailingAddress: "123 Woodlands Drive",
                password: await bcrypt.hash("Password1", 10)
            },
            {
                name: "Peter Parker",
                birthDate: new Date("2002-01-01"),
                email: "peterparker@gmail.com",
                verified: false,
                mailingAddress: "765 Yio Chu Kang Road",
                phoneNumber: "22222222",
                password: await bcrypt.hash("Password1", 10)
            }
        ];

        const result = await User.bulkCreate(userData);
        return res.json(result);
    } catch (err) {
        return res.status(500).json({ message: `${err.message}: Failed to populate user.` });
    }
});
    
module.exports = router;
