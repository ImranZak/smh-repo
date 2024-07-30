const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const { User } = require("../models");
const yup = require("yup");

router.post("/register", async (req, res) => {
    let data = req.body;

    // Validate request body 
    let validationSchema = yup.object({
        name: yup.string().trim().min(3).max(50).required(),
        email: yup.string().trim().lowercase().email().max(50).required(),
        password: yup.string().trim().min(8).max(50).required(),
    });
    try {
        data = await validationSchema.validate(data, { abortEarly: false });
        // Process valid data …
    } catch (err) {
        res.status(400).json({ errors: err.errors });
    }

    // Hash passowrd
    data.password = await bcrypt.hash(data.password, 10);
    // Create user
    let result = await User.create(data);
    res.json({ message: `Email ${result.email} was registered successfully.` });
});

module.exports = router;
