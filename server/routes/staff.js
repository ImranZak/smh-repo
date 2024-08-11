const express = require('express');
const router = express.Router();
const { Staff } = require('../models');
const { Op } = require("sequelize");
const yup = require("yup");
const bcrypt = require("bcrypt");
const { sign } = require('jsonwebtoken'); 
const { validateToken } = require('../middlewares/auth');


// Uses staff domain
const emailRegex = /^[a-zA-Z0-9._%+-]+@smhstaff\.com$/;

// 8-10 digits with optional country code
const phoneRegex = /^(?:\+\d{1,3})?\d{8,10}$/

// Min 8 characters, 1 uppercase, 1 lowercase, 1 digit, no whitespaces 
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d\S]{8,100}$/;


// Login Staff
router.post("/login", async (req, res) => {
    let data = req.body;

    // Validate request body
    let validationSchema = yup.object({
        email: yup.string().trim().lowercase().email().max(100).required(),
        password: yup.string().trim().min(8).max(100).required()
    });

    try {
        data = await validationSchema.validate(data,
            { abortEarly: false });

        // Check email and password
        let errorMsg = "Email or password is not correct.";
        let staff = await Staff.findOne({
            where: { email: data.email }
        });
        if (!staff) {
            res.status(400).json({ message: errorMsg });
            return;
        }
        let match = await bcrypt.compare(data.password, staff.password);
        if (!match) {
            res.status(400).json({ message: errorMsg });
            return;
        }

        // Return user info
        let staffInfo = {
            id: staff.id,
            email: staff.email,
            name: staff.name
        };
        let accessToken = sign(staffInfo, process.env.APP_SECRET, 
            { expiresIn: process.env.TOKEN_EXPIRES_IN });
        res.json({
            accessToken: accessToken,
            user: staffInfo
        });
    }
    catch (err) {
        res.status(400).json({ errors: err.errors });
        return;
    }
});


// Authenticate Staff 
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


// Create Staff
router.post("/", async (req, res) => {
    let data = req.body;
    // Validate request body
    let validationSchema = yup.object({
        name: yup
            .string()
            .trim()
            .min(3)
            .max(100)
            .matches(
                /^[a-zA-Z '-,.]+$/,
                "name only allow letters, spaces and characters: ' - , ."
            )
            .required(),
        birthDate: yup
            .date()
            .min(
                new Date().getFullYear() - 100,
                `Minimum birth year is ${new Date().getFullYear() - 100}`
            )
            .max(
                new Date().getFullYear() - 17,
                `Maximum birth year is ${new Date().getFullYear() - 18}`
            )
            .required(),
        email: yup
            .string()
            .trim()
            .lowercase()
            .min(3)
            .max(100)
            .email()
            .matches(emailRegex, "Email must be from @smhstaff.com")
            .required(),
        phoneNumber: yup
            .string()
            .trim()
            .matches(
                phoneRegex,
                "Phone number must be 8-10 digits with valid country code if international"
            )
            .required(),
        homeAddress: yup
            .string()
            .trim()
            .min(3)
            .max(100)
            .required(),
        password: yup
            .string()
            .trim()
            .matches(passwordRegex,"Password must have at least 8 characters, 1 uppercase, 1 lowercase, 1 digit, and no whitespaces. Special characters (@,#,$,%,^,&,+,=) are allowed")
            .required(),
        role: yup
            .string()
            .trim()
            .min(3)
            .max(500)
            .required(),
        department: yup
            .string()
            .trim()
            .min(2)
            .max(500)
            .required(),
        joinDate: yup
            .date()
            .min("01/01/2002", `Minimum join year is 2002`)
            .max(new Date().getFullYear() + 1, `Maximum join year is ${new Date().getFullYear()}`)
            .required(),
    });
    try {
        data = await validationSchema.validate(data,
            { abortEarly: false });
            
        data.password = await bcrypt.hash(data.password, 10);
        let result = await Staff.create(data);
        res.json(result);
    }
    catch (err) {
        res.status(400).json({ errors: err.errors });
    }
});

// Get All Staff (With Optional Search Query)
router.get("/", async (req, res) => {
    let condition = {};
    let search = req.query.search;
    if (search) {
        condition[Op.or] = [
            { name: { [Op.like]: `%${search}%` } },
            { email: { [Op.like]: `%${search}%` } },
            { phoneNumber: { [Op.like]: `%${search}%` } },
            { homeAddress: { [Op.like]: `%${search}%` } },
            { role: { [Op.like]: `%${search}%` } },
            { department: { [Op.like]: `%${search}%` } }
        ];
    }
    
    let list = await Staff.findAll({
        where: condition,
        order: [['createdAt', 'ASC']]
    });
    res.json(list);
});

// Get Staff By Id
router.get("/:id", async (req, res) => {
    let id = req.params.id;
    let staff = await Staff.findByPk(id);
    // Check id not found
    if (!staff) {
        res.sendStatus(404);
        return;
    }
    res.json(staff);
});

// Update Staff By Id
router.put("/:id", async (req, res) => {
    let id = req.params.id;
    // Check id not found
    let staff = await Staff.findByPk(id);
    if (!staff) {
        res.sendStatus(404);
        return;
    }
    
    let data = req.body;
    // Validate request body
    let validationSchema = yup.object({
        name: yup.string().trim().min(3).max(100).matches(/^[a-zA-Z '-,.]+$/, "name only allow letters, spaces and characters: ' - , .").required(),
        birthDate: yup.date().min(new Date().getFullYear() - 100, `Minimum birth year is ${new Date().getFullYear() - 100}`).max(new Date().getFullYear() - 17, `Maximum birth year is ${(new Date().getFullYear() - 18)}`).required(),
        email: yup.string().trim().lowercase().min(3).max(100).email().matches(emailRegex, 'Email must be from @smhstaff.com').required(),
        phoneNumber: yup.string().trim().matches(phoneRegex, 'Phone number must be 8-10 digits with valid country code if international').required(),
        homeAddress: yup.string().trim().min(3).max(100).required(),
        password: yup.string().trim().matches(passwordRegex, "Password must have at least 8 characters, 1 uppercase, 1 lowercase, 1 digit, and no whitespaces. Special characters (@,#,$,%,^,&,+,=) are allowed").required(),
        role: yup.string().trim().min(3).max(500).required(),
        department: yup.string().trim().min(2).max(500).required(),
        joinDate: yup.date().min('01/01/2002', `Minimum join year is 2002`).max(new Date().getFullYear()+1, `Maximum join year is ${new Date().getFullYear()}`).required()
    });
    try {
        data = await validationSchema.validate(data,
            { abortEarly: false });

        data.password = data.password || await bcrypt.hash(data.password, 10);
        let num = await Staff.update(data, {
            where: { id: id }
        });
        if (num == 1) {
            res.json({
                message: "Staff was updated successfully."
            });
        }
        else {
            res.status(400).json({
                message: `Cannot update staff with id ${id}.`
            });
        }
    }
    catch (err) {
        res.status(400).json({ errors: err.errors });
    }
});

// Delete Staff By Id
router.delete("/:id", async (req, res) => {
    let id = req.params.id;
    // Check id not found
    let staff = await Staff.findByPk(id);
    if (!staff) {
        res.sendStatus(404);
        return;
    }

    let num = await Staff.destroy({
        where: { id: id }
    })
    if (num == 1) {
        res.json({
            message: "Staff was deleted successfully."
        });
    }
    else {
        res.status(400).json({
            message: `Cannot delete staff with id ${id}.`
        });
    }
});

// Delete All Staff
router.delete("/", async (req, res) => {
    try {
        let staffIds = await Staff.findAll({
            attributes: ['id']
        });
        
        for (let i = 0; i < staffIds.length; i++) {
            await Staff.destroy({
            where: { id: staffIds[i].id }
            });
        }
        res.json({
            message: "All staff were deleted successfully."
        });
    } catch (err) {
        res.status(500).json({
            message: "Failed to delete all staff."
        });
    }
});

// Populate Staff
router.post("/populate", async (req, res) => {
    try {
        let staffIds = await Staff.findAll({
            attributes: ['id']
        });
        
        for (let i = 0; i < staffIds.length; i++) {
            await Staff.destroy({
            where: { id: staffIds[i].id }
            });
        }
    } catch (err) {
        res.status(500).json({
            message: "Failed to delete all staff."
        });
        return;
    }
    try {
        const staffData = [
            {
                name: "John Doe",
                birthDate: new Date("1992-01-01"),
                email: "johndoe@smhstaff.com",
                phoneNumber: "12345678",
                homeAddress: "123 Sembawang Road",
                password: await bcrypt.hash("SMHStaff2024", 10),
                role: "Web Developer",
                department: "IT",
                joinDate: new Date("2020-01-01"),
            },
            {
                name: "Jane Smith",
                birthDate: new Date("2002-01-01"),
                email: "janesmith@smhstaff.com",
                homeAddress: "123 Sembawang Road",
                phoneNumber: "98765432",
                password: await bcrypt.hash("SMHStaff2024", 10),
                role: "HR Assistant",
                department: "HR",
                joinDate: new Date("2024-01-01"),
            }
        ];

        const result = await Staff.bulkCreate(staffData);
        res.json(result);
    } catch (err) {
        res.status(500).json({
            message: `${err}: Failed to populate staff.`
        });
    }
});

module.exports = router;