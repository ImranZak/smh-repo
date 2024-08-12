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


// 8-10 digits with optional country code
const phoneRegex = /^(?:\+\d{1,3})?\d{8,10}$/

// Min 8 characters, 1 uppercase, 1 lowercase, 1 digit, no whitespaces 
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d\S]{8,100}$/;

function generateVerificationCode() {
    return bcrypt.hash((Math.floor(Math.random() * (1000000 - 111111 + 1)) + 111111).toString(), 10).toString();
}

// Register User
router.post("/register", async (req, res) => {
    let data = req.body;

    // Validate request body 
    let validationSchema = yup.object({ 
        name: yup.string().trim().min(3).max(50).required()
        .matches(/^[a-zA-Z '-,.]+$/, "name only allow letters, spaces and characters: ' - , ."),
        email: yup.string().trim().lowercase().email().max(50).matches(/^(?!.*@smhuser\.com$).+$/, "Invalid email").required(),
        password: yup.string().trim().min(8).max(50).required()
        .matches(passwordRegex, "Min 8 characters, 1 uppercase, 1 lowercase, 1 digit, no whitespaces")
    });
    try {
        data = await validationSchema.validate(data, { abortEarly: false });
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

// Send verification email
router.post("/verify", async (req, res) => {
    const verificationCode = Math.floor(Math.random() * (1000000 - 111111 + 1)) + 111111;
    const email = req.body.email;
    try {
        const hashedVerificationCode = await bcrypt.hash(verificationCode.toString(), 10);
        await User.update({ verificationCode: hashedVerificationCode }, {
            where: { email: email }
        });
        await sendVerifyEmail(email, verificationCode);
        res.status(200).send('Email sent');
    } catch (error) {
        res.status(500).send(`Error sending email: ${error}`);
    }
});

// Verify user
router.put("/verify/:id", async (req, res) => {
    const id = req.params.id;
    let user = await User.findByPk(id);
    // Check id not found
    if (!user) {
        res.sendStatus(404);
        return;
    }

    let data = req.body;
    try {
        let match = await bcrypt.compare(data.verificationCode, user.verificationCode);
        if (!match) {
            res.status(400).json({ message: "Verification code is incorrect" });
            return;
        }
        let num = await User.update({ verified: true }, {
            where: { id: id }
        });
        if (num == 1) {
            res.json({
                message: "User was verified successfully."
            });
        }
        else {
            res.status(400).json({
                message: `Cannot update user with id ${id}. `
            });
        }
    } catch (error) {
        res.status(500).send(`Error verifying user: ${error}`);
    }
});

// Unverify user
router.put("/unverify/:id", async (req, res) => {
    const id = req.params.id;
    let user = await User.findByPk(id);
    // Check id not found
    if (!user) {
        res.sendStatus(404);
        return;
    }
    try {
        let num = await User.update({ verified: false }, {
            where: { id: id }
        });
        if (num == 1) {
            res.json({
                message: "User was unverified successfully."
            });
        }
        else {
            res.status(400).json({
                message: `Cannot update user with id ${id}. `
            });
        }
    } catch (error) {
        res.status(500).send(`Error unverifying user: ${error}`);
    }
});

// Get All Users (With Optional Search Query)
router.get("/", async (req, res) => {
    let condition = {};
    let search = req.query.search;
    if (search) {
        condition[Op.or] = [
            { name: { [Op.like]: `%${search}%` } },
            { email: { [Op.like]: `%${search}%` } },
            { phoneNumber: { [Op.like]: `%${search}%` } },
            { mailingAddress: { [Op.like]: `%${search}%` } },
            { password: { [Op.like]: `%${search}%` } },
        ];
    }
    
    let list = await User.findAll({
        where: condition,
        order: [['createdAt', 'ASC']]
    });
    res.json(list);
});

// Get User By Id
router.get("/:id", async (req, res) => {
    let id = req.params.id;
    let user = await User.findByPk(id);
    // Check id not found
    if (!user) {
        res.sendStatus(404);
        return;
    }
    res.json(user);
});

// Update User By Id
router.put("/:id", async (req, res) => {
    let id = req.params.id;
    // Check id not found
    let user = await User.findByPk(id);
    if (!user) {
        res.sendStatus(404);
        return;
    }

    let data = req.body;
    // Validate request body
    let validationSchema = yup.object({
        name: yup
            .string()
            .max(100, 'Name must be at most 100 characters')
            .matches(/^[a-zA-Z '-,.]+$/, "name only allow letters, spaces and characters: ' - , .")
            .required('Name is required'),
        birthDate: yup
            .date()
            .min(new Date().getFullYear() - 100, `Maximum birth year is ${new Date().getFullYear() - 100}`)
            .max(new Date().getFullYear() - 12, `Minimum birth year is ${(new Date().getFullYear() - 13)}`)
            .nullable(),
        email: yup.string()
            .email('Invalid email format')
            .max(100, 'Email must be at most 100 characters')
            .required('Email is required'),
        phoneNumber: yup.string()
            .max(20, 'Phone number must be at most 20 characters')
            .matches(phoneRegex, 'Phone number must be 8-10 digits with valid country code if international')
            .nullable(),
        mailingAddress: yup.string()
            .max(100, 'Home address must be at most 100 characters')
            .nullable()
    });
    try {
        data = await validationSchema.validate(data,
            { abortEarly: false });

        let num = await User.update(data, {
            where: { id: id }
        });
        if (num == 1) {
            res.json({
                message: "User was updated successfully."
            });
        }
        else {
            res.status(400).json({
                message: `Cannot update user with id ${id}.`
            });
        }
    }
    catch (err) {
        res.status(400).json({ errors: err.errors });
    }
});

// Change User Password By Id
router.put("/password/:id", async (req, res) => {
    let id = req.params.id;
    // Check id not found
    let user = await User.findByPk(id);
    if (!user) {
        res.sendStatus(404);
        return;
    }
    
    let data = req.body;
    // Validate request body
    let validationSchema = yup.object({
        currentPassword: yup
            .string()
            .trim()
            .required("Old password is required"),
        newPassword: yup
            .string()
            .trim()
            .min(8, "Password must be at least 8 characters")
            .max(100, "Password must be at most 100 characters")
            .required("New password is required")
            .matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d\S]{8,100}$/,
                "Min 8 characters, 1 uppercase, 1 lowercase, 1 digit, no whitespaces"
            )
    });
    try {
        data = await validationSchema.validate(data,
            { abortEarly: false });

        let current_password_match = await bcrypt.compare(data.currentPassword, user.password);
        if (!current_password_match) {
            res.status(400).json({ message: "Current password is incorrect" });
            return;
        }
        let new_password_match = await bcrypt.compare(data.newPassword, user.password);
        if (new_password_match) {
            res.status(400).json({ message: "New password cannot match current password" });
            return;
        }
        user.password = await bcrypt.hash(data.newPassword, 10);
        
        let num = await User.update({ password: user.password }, {
            where: { id: id }
        });
        if (num == 1) {
            res.json({
                message: "User was updated successfully."
            });
        }
        else {
            res.status(400).json({
                message: `Cannot update user with id ${id}. `
            });
        }
    }
    catch (err) {
        res.status(400).json({ errors: err.errors });
    }
});

// Delete User By Id
router.delete("/:id", async (req, res) => {
    let id = req.params.id;
    // Check id not found
    let user = await User.findByPk(id);
    if (!user) {
        res.sendStatus(404);
        return;
    }

    let num = await User.destroy({
        where: { id: id }
    })
    if (num == 1) {
        res.json({
            message: "User was deleted successfully."
        });
    }
    else {
        res.status(400).json({
            message: `Cannot delete user with id ${id}.`
        });
    }
});

// Delete All Users
router.delete("/", async (req, res) => {
    try {
        let userIds = await User.findAll({
            attributes: ['id']
        });
        
        for (let i = 0; i < userIds.length; i++) {
            await User.destroy({
                where: { id: userIds[i].id }
            });
        }
        res.json({
            message: "All users were deleted successfully."
        });
    } catch (err) {
        res.status(500).json({
            message: "Failed to delete all users."
        });
    }
});

// Populate User
router.post("/populate", async (req, res) => {
    try {
        let userIds = await User.findAll({
            attributes: ['id']
        });
        
        for (let i = 0; i < userIds.length; i++) {
            await User.destroy({
                where: { id: userIds[i].id }
            });
        }
    } catch (err) {
        res.status(500).json({
            message: "Failed to delete all user."
        });
        return
    }
    try {
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
        res.json(result);
    } catch (err) {
        res.status(500).json({
            message: `${err}: Failed to populate user.`
        });
    }
});

module.exports = router;
