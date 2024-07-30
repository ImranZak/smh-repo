const express = require('express');
const router = express.Router();
const { Staff } = require('../models');
const { Op, DATEONLY } = require("sequelize");
const yup = require("yup");


// Custom regex for validation

// Uses staff domain
const emailRegex = /^[a-zA-Z0-9._%+-]+@smhstaff\.com$/;

// 8-10 digits with optional country code
const phoneRegex = /^(?:\+\d{1,3})?\d{8,10}$/

// Min 8 characters, 1 uppercase, 1 lowercase, 1 digit, no whitespaces, and some special characters allowed :) 
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d@#$%^&+=]{8,100}$/


// Create Staff
router.post("/", async (req, res) => {
    let data = req.body;
    // Validate request body
    let validationSchema = yup.object({
        // TODO: homeAddress validation for all endpoints
        name: yup.string().trim().min(3).max(100).required(),
        birthDate: yup.date().min(new Date().getFullYear() - 100, `Minimum birth year is ${new Date().getFullYear() - 100}`).max(new Date().getFullYear() - 18, `Maximum birth year is ${(new Date().getFullYear() - 18)}`).required(),
        email: yup.string().trim().lowercase().min(3).max(100).email().matches(emailRegex, 'Email must be from @smhstaff.com').required(),
        phoneNumber: yup.string().trim().matches(phoneRegex, 'Phone number must be 8-10 digits with valid country code if international').required(),
        homeAddress: yup.string().trim().min(3).max(100).required(),
        password: yup.string().trim().matches(passwordRegex, "Password must have at least 8 characters, 1 uppercase, 1 lowercase, 1 digit, and no whitespaces. Special characters (@,#,$,%,^,&,+,=) are allowed").required(),
        role: yup.string().trim().min(3).max(500).required(),
        department: yup.string().trim().min(2).max(500).required(),
        joinDate: yup.date().min('01/01/2002', `Minimum join year is 2002`).max(new Date().getFullYear(), `Maximum join year is ${new Date().getFullYear()}`).required()
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

// Get All Staff (With Optional Search Query)
router.get("/", async (req, res) => {
    let condition = {};
    let search = req.query.search;
    let strong = req.query.strong ?? false;
    if (search) {
        // bool: strong -> if true check for exactly matching variables (Op.eq)
        if (strong == "true") {
            condition[Op.or] = [
                { name: search },
                { birthDate: search},
                { email: search },
                { phoneNumber: search },
                { homeAddress: search },
                { role: search },
                { department: search },
                { joinDate: search},
            ];
        }
        else {
            condition[Op.or] = [
                { name: { [Op.like]: `%${search}%` } },
                { birthDate: { [Op.like]: `%${search}%` } },
                { email: { [Op.like]: `%${search}%` } },
                { phoneNumber: { [Op.like]: `%${search}%` } },
                { homeAddress: { [Op.like]: `%${search}%` } },
                { role: { [Op.like]: `%${search}%` } },
                { department: { [Op.like]: `%${search}%` } },
                { joinDate: { [Op.like]: `%${search}%` } },
            ];
        }
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
        birthDate: yup.date().min(new Date().getFullYear() - 100, `Minimum birth year is ${new Date().getFullYear() - 100}`).max(new Date().getFullYear() - 18, `Maximum birth year is ${(new Date().getFullYear() - 18)}`).required(),
        email: yup.string().trim().lowercase().min(3).max(100).email().matches(emailRegex, 'Email must be from @smhstaff.com').required(),
        phoneNumber: yup.string().trim().matches(phoneRegex, 'Phone number must be 8-10 digits with valid country code if international').required(),
        homeAddress: yup.string().trim().min(3).max(100).required(),
        password: yup.string().trim().matches(passwordRegex, "Password must have at least 8 characters, 1 uppercase, 1 lowercase, 1 digit, and no whitespaces. Special characters (@,#,$,%,^,&,+,=) are allowed").required(),
        role: yup.string().trim().min(3).max(500).required(),
        department: yup.string().trim().min(2).max(500).required(),
        joinDate: yup.date().min('01/01/2002', `Minimum join year is 2002`).max(new Date().getFullYear(), `Maximum join year is ${new Date().getFullYear()}`).required()
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
        await Staff.destroy({
            where: {},
            truncate: true
        });
    } catch (err) {
        res.status(500).json({
            message: "Failed to delete all staff."
        });
    }
    try {
        const staffData = [
            {
                name: "John Doe",
                birthDate: new Date("1992-01-01"),
                email: "johndoe@smhstaff.com",
                phoneNumber: "12345678",
                homeAddress: "123 Sembawang Road",
                password: "SMHStaff2024",
                role: "Admin",
                department: "IT",
                joinDate: new Date("2020-01-01"),
            },
            {
                name: "Jane Smith",
                birthDate: new Date("2002-01-01"),
                email: "janesmith@smhstaff.com",
                homeAddress: "123 Sembawang Road",
                phoneNumber: "98765432",
                password: "SMHStaff2024",
                role: "Staff",
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