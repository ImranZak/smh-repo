const express = require('express');
const router = express.Router();
const { upload } = require('../middlewares/Upload');

// POST: Upload a file
router.post('/upload', upload, (req, res) => {
    try {
        if (req.file) {
            res.status(201).json({ filename: req.file.filename });
        } else {
            res.status(400).json({ message: "No file uploaded" });
        }
    } catch (err) {
        console.error('Error in POST /upload:', err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;