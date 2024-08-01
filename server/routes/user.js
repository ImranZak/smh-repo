const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const { User } = require("../models");
const yup = require("yup");
const { sign } = require('jsonwebtoken'); 
const { validateToken } = require('../middlewares/auth');
require('dotenv').config();


// 8-10 digits with optional country code
const phoneRegex = /^(?:\+\d{1,3})?\d{8,10}$/

// Min 8 characters, 1 uppercase, 1 lowercase, 1 digit, no whitespaces 
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d\S]{8,100}$/;


// Register User
router.post("/register", async (req, res) => {
    let data = req.body;

    // Validate request body 
    let validationSchema = yup.object({ 
        // TODO: Update this to match user model AFTER review 2
        name: yup.string().trim().min(3).max(50).required()
        .matches(/^[a-zA-Z '-,.]+$/, "name only allow letters, spaces and characters: ' - , ."),
        email: yup.string().trim().lowercase().email().max(50).matches(/^(?!.*@smhuser\.com$).+$/, "Invalid email").required(),
        password: yup.string().trim().min(8).max(50).required()
        .matches(passwordRegex, "Min 8 characters, 1 uppercase, 1 lowercase, 1 digit, no whitespaces")
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


// Create User
router.post("/", async (req, res) => {
    let data = req.body;
    // Validate request body
    let validationSchema = yup.object({
        name: yup.string().trim().min(3).max(100).matches(/^[a-zA-Z '-,.]+$/, "name only allow letters, spaces and characters: ' - , .").required(),
        birthDate: yup.date().nullable().min(new Date().getFullYear() - 100, `Minimum birth year is ${new Date().getFullYear() - 100}`).max(new Date().getFullYear() - 12, `Maximum birth year is ${(new Date().getFullYear() - 13)}`),
        email: yup.string().trim().lowercase().min(3).max(100).email().required(),
        phoneNumber: yup.string().trim().matches(phoneRegex, 'Phone number must be 8-10 digits with valid country code if international').nullable(),
        mailingAddress: yup.string().trim().min(3).max(100).nullable(),
        password: yup.string().trim().matches(passwordRegex, "Password must have at least 8 characters, 1 uppercase, 1 lowercase, 1 digit, and no whitespaces. Special characters (@,#,$,%,^,&,+,=) are allowed").required()
    });
    try {
        data = await validationSchema.validate(data,
            { abortEarly: false });
            
        data.password = await bcrypt.hash(data.password, 10);
        let result = await User.create(data);
        res.json(result);
    }
    catch (err) {
        res.status(400).json({ errors: err.errors });
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
        name: yup.string().trim().min(3).max(100).matches(/^[a-zA-Z '-,.]+$/, "name only allow letters, spaces and characters: ' - , .").required(),
        birthDate: yup.date().nullable().min(new Date().getFullYear() - 100, `Minimum birth year is ${new Date().getFullYear() - 100}`).max(new Date().getFullYear() - 12, `Maximum birth year is ${(new Date().getFullYear() - 13)}`),
        email: yup.string().trim().lowercase().min(3).max(100).email().required(),
        phoneNumber: yup.string().trim().matches(phoneRegex, 'Phone number must be 8-10 digits with valid country code if international').nullable(),
        mailingAddress: yup.string().trim().min(3).max(100).nullable(),
        password: yup.string()
    });
    try {
        data = await validationSchema.validate(data,
            { abortEarly: false });

        data.password = await bcrypt.hash(data.password, 10);
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
        // TODO: Implement department-role requirement to department :P
        const userData = [
            {
                name: "Mary Jane",
                birthDate: new Date("1992-01-01"),
                email: "maryjane@gmail.com",
                phoneNumber: "111111111",
                mailingAddress: "123 Woodlands Drive",
                password: await bcrypt.hash("Password1", 10)
            },
            {
                name: "Peter Parker",
                birthDate: new Date("2002-01-01"),
                email: "peterparker@gmail.com",
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
