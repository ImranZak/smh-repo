const express = require('express');
const router = express.Router();
const { Staff } = require('../models');
const { Op } = require("sequelize");
const yup = require("yup");


// Custom regex for validation

// Uses staff domain
const emailRegex = /^[a-zA-Z0-9._%+-]+@smhstaff\.com$/;

// 8-10 digits with optional country code
const phoneRegex = /^(?:\+\d{1,3})?\d{8,10}$/

// Min 8 characters, 1 uppercase, 1 lowercase, 1 digit, no whitespaces, and special characters allowed :) 
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@#$%^&+=]{8,100}$/


// Create Staff
router.post("/", async (req, res) => {
    let data = req.body;
    // Validate request body
    let validationSchema = yup.object({
        name: yup.string().trim().min(3).max(100).required(),
        email: yup.string().trim().min(3).max(100).email().matches(emailRegex, 'Email must be from @smhstaff.com').required(),
        phoneNumber: yup.string().trim().matches(phoneRegex, 'Phone number must be 8-10 digits with valid country code if international').required(),
        password: yup.string().trim().matches(passwordRegex, "Password must have at least 8 characters, 1 uppercase, 1 lowercase, 1 digit, and no whitespaces").required(),
        role: yup.string().trim().min(3).max(500).required(),
        department: yup.string().trim().min(3).max(500).required()
    });
    try {
        data = await validationSchema.validate(data,
            { abortEarly: false });
        let result = await Staff.create(data);
        res.json(result);
    }
    catch (err) {
        res.status(400).json({ errors: err.errors });
    }
});

// Get All Staff (With Optional Query)
router.get("/", async (req, res) => {
    let condition = {};
    let search = req.query.search;
    let strong_search = req.query.strong_search;
    if (search) {
        condition[Op.or] = [
            { name: { [Op.like]: `%${search}%` } },
            { email: { [Op.like]: `%${search}%` } },
            { phoneNumber: { [Op.like]: `%${search}%` } },
            { role: { [Op.like]: `%${search}%` } },
            { department: { [Op.like]: `%${search}%` } }
        ];
    }
    if (strong_search) {
        condition[Op.or] = [
            { name: strong_search },
            { role: strong_search }
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
        name: yup.string().trim().min(3).max(100).required(),
        email: yup.string().trim().min(3).max(100).email().matches(emailRegex, 'Email must be from @smhstaff.com').required(),
        phoneNumber: yup.string().trim().matches(phoneRegex, 'Phone number must be 8-10 digits with valid country code if international').required(),
        password: yup.string().trim().matches(passwordRegex, "Password must have at least 8 characters, 1 uppercase, 1 lowercase, 1 digit, and no whitespaces").required(),
        role: yup.string().trim().min(3).max(500).required(),
        department: yup.string().trim().min(3).max(500).required()
    });
    try {
        data = await validationSchema.validate(data,
            { abortEarly: false });

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
        await Staff.destroy({
            where: {},
            truncate: true
        });
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
        const staffData = [
            {
                name: "John Doe",
                email: "johndoe@smhstaff.com",
                phoneNumber: "12345678",
                password: "SMHStaff2024",
                role: "Admin",
                department: "IT"
            },
            {
                name: "Jane Smith",
                email: "janesmith@smhstaff.com",
                phoneNumber: "98765432",
                password: "SMHStaff2024",
                role: "Staff",
                department: "HR"
            }
        ];

        const result = await Staff.bulkCreate(staffData);
        res.json(result);
    } catch (err) {
        res.status(500).json({
            message: "Failed to populate staff."
        });
    }
});

module.exports = router;