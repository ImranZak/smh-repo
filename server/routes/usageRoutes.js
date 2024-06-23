const express = require('express');
const router = express.Router();
const Usage = require('../models/Usage');

// Create a new usage record
router.post('/', async (req, res) => {
    try {
        const usage = await Usage.create(req.body);
        res.status(201).json(usage);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Read all usage records
router.get('/', async (req, res) => {
    try {
        const usages = await Usage.findAll();
        res.status(200).json(usages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update a usage record
router.put('/:id', async (req, res) => {
    try {
        const [updated] = await Usage.update(req.body, {
            where: { id: req.params.id },
        });
        if (updated) {
            const updatedUsage = await Usage.findOne({ where: { id: req.params.id } });
            res.status(200).json(updatedUsage);
        } else {
            throw new Error('Usage not found');
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete a usage record
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await Usage.destroy({
            where: { id: req.params.id },
        });
        if (deleted) {
            res.status(204).send();
        } else {
            throw new Error('Usage not found');
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
