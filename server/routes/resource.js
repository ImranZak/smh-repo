const express = require('express');
const router = express.Router();
const { Resource } = require('../models');
const { Op } = require("sequelize");
const yup = require("yup");

// POST: Create a new resource
router.post("/", async (req, res) => {
    let data = req.body;

    // Define validation schema including the new tag field
    const validationSchema = yup.object({
        title: yup.string().trim().max(255).required(),
        description: yup.string().trim().required(),
        status: yup.string().trim().oneOf(["Active", "Inactive"]).required(),
        tag: yup.string().trim().oneOf(['waste reduction', 'energy conservation', 'water management', 'green living tips']).required()
    });

    try {
        // Validate request body
        data = await validationSchema.validate(data, { abortEarly: false });
        
        // Create new resource
        const resource = await Resource.create(data);
        res.status(201).json(resource);
    } catch (err) {
        if (err instanceof yup.ValidationError) {
            return res.status(400).json({ error: err.errors });
        }
        res.status(500).json({ error: err.message });
    }
});

// GET: Retrieve all resources with optional search query
router.get("/", async (req, res) => {
    let condition = {};
    const search = req.query.search;
    const tag = req.query.tag;

    if (search) {
        condition[Op.or] = [
            { title: { [Op.like]: `%${search}%` } },
            { description: { [Op.like]: `%${search}%` } },
            { status: { [Op.like]: `%${search}%` } },
        ];
    }

    if (tag) {
        condition.tag = tag;
    }

    try {
        // Retrieve resources based on condition
        const resources = await Resource.findAll({
            where: condition,
            order: [['createdAt', 'DESC']] // Optional: order by creation date
        });
        res.status(200).json(resources);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET: Retrieve a single resource by ID
router.get("/:id", async (req, res) => {
    const id = req.params.id;

    try {
        const resource = await Resource.findByPk(id);

        if (!resource) {
            return res.status(404).json({ error: 'Resource not found' });
        }

        res.status(200).json(resource);
    } catch (error) {
        console.error('Error fetching resource:', error);
        res.status(500).json({ error: 'An error occurred while fetching the resource' });
    }
});

// PUT: Update a resource by ID
router.put("/:id", async (req, res) => {
    const id = req.params.id;
    
    try {
        // Check if the resource exists
        const resource = await Resource.findByPk(id);
        if (!resource) {
            return res.status(404).json({ error: 'Resource not found' });
        }

        let data = req.body;
        
        // Define validation schema including the new tag field
        const validationSchema = yup.object({
            title: yup.string().trim().max(255).required(),
            description: yup.string().trim().required(),
            status: yup.string().trim().oneOf(["Active", "Inactive"]).required(),
            tag: yup.string().trim().oneOf(['waste reduction', 'energy conservation', 'water management', 'green living tips']).required()
        });

        // Validate request body
        data = await validationSchema.validate(data, { abortEarly: false });
        
        // Update resource
        await resource.update(data);
        res.status(200).json({ message: 'Resource was updated successfully.' });
    } catch (err) {
        if (err instanceof yup.ValidationError) {
            return res.status(400).json({ error: err.errors });
        }
        res.status(500).json({ error: err.message });
    }
});

// DELETE: Delete a resource by ID
router.delete("/:id", async (req, res) => {
    const id = req.params.id;
    
    try {
        // Delete resource
        const numDeleted = await Resource.destroy({
            where: { id: id }
        });

        if (numDeleted === 1) {
            res.status(200).json({ message: 'Resource was deleted successfully.' });
        } else {
            res.status(400).json({ message: `Cannot delete Resource with id ${id}.` });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
