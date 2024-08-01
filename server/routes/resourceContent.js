const express = require('express');
const router = express.Router();
const { ResourceContent } = require('../models');
const { Op } = require("sequelize");
const yup = require("yup");
const { upload } = require('../middlewares/Upload');

// POST: Create a new resource content
router.post("/:postId", async (req, res) => {
    const { postId } = req.params;
    let data = req.body;

    const validationSchema = yup.object({
        type: yup.string().oneOf(['text', 'videoLink', 'image', 'video', 'file']).required(),
    });

    try {
        // Validate request body
        data = await validationSchema.validate(data, { abortEarly: false });

        // Add postId to the data object
        data.resourceId = postId;

        // Create new resource content
        let resourceContent = await ResourceContent.create(data);
        res.status(201).json(resourceContent);
    } catch (err) {
        console.error('Error in POST /resourceContent/:postId:', err); // Add detailed logging
        if (err instanceof yup.ValidationError) {
            return res.status(400).json({ error: err.errors });
        }
        res.status(500).json({ error: err.message });
    }
});

// GET: Retrieve all resource contents with optional search query
router.get("/:postId", async (req, res) => {
    const { postId } = req.params;
    let condition = { resourceId: postId };
    const search = req.query.search;

    if (search) {
        condition[Op.or] = [
            { resourceId: { [Op.like]: `%${search}%` } },
            { type: { [Op.like]: `%${search}%` } },
        ];
    }

    try {
        // Retrieve resource contents based on condition and order by id
        const resourceContents = await ResourceContent.findAll({
            where: condition,
            order: [['id', 'ASC']] // Order by id
        });
        res.status(200).json(resourceContents);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET: Retrieve a single resource content by ID
router.get("/one/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const resourceContent = await ResourceContent.findByPk(id);

        if (!resourceContent) {
            return res.status(404).json({ error: 'ResourceContent not found' });
        }

        res.status(200).json(resourceContent);
    } catch (error) {
        console.error('Error fetching resource content:', error);
        res.status(500).json({ error: 'An error occurred while fetching the resource content' });
    }
});

// PUT: Update a resource content by ID
router.put("/:id/:postId", upload, async (req, res) => {
    const { id, postId } = req.params;

    let validationSchema = yup.object({
        type: yup.string().oneOf(['text', 'image', 'videoLink', 'video', 'file']).required()
    });

    try {
        // Check if the resource content exists
        const resourceContent = await ResourceContent.findByPk(id);
        if (!resourceContent) {
            return res.status(404).json({ error: 'ResourceContent not found' });
        }

        let data = req.body;

        // Validate request body
        data = await validationSchema.validate(data, { abortEarly: false });

        // Handle file upload if present
        if (req.file) {
            data.filePath = req.file.path;
            data.fileName = req.file.filename;
        }

        // Add postId to the data object
        data.resourceId = postId;

        // Update resource content
        await resourceContent.update(data);
        res.status(200).json({ message: 'ResourceContent was updated successfully.' });
    } catch (err) {
        if (err instanceof yup.ValidationError) {
            return res.status(400).json({ error: err.errors });
        }
        res.status(500).json({ error: err.message });
    }
});

// DELETE: Delete a resource content by ID and postId
router.delete("/:id/:postId", async (req, res) => {
    const { id, postId } = req.params;
    
    try {
        // Check if the resource content exists with the given postId
        const resourceContent = await ResourceContent.findOne({
            where: {
                id: id,
                resourceId: postId
            }
        });

        if (!resourceContent) {
            return res.status(404).json({ error: 'ResourceContent not found' });
        }

        // Delete resource content
        await resourceContent.destroy();
        res.status(200).json({ message: 'ResourceContent was deleted successfully.' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;