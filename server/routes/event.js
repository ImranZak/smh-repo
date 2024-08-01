const express = require('express');
const router = express.Router();
const { Event } = require('../models');
const { Op } = require("sequelize");
const yup = require("yup");

//API ENDPOINT 1 FOR ADDING EVENT
router.post("/", async (req, res) => {
    let data = req.body;
    // Validate request body
    let validationSchema = yup.object({
        name: yup.string().trim().min(3).max(100).required(),
        description: yup.string().trim().min(3).max(500).required(),
        status: yup.string().oneOf(['Completed', 'Upcoming', 'Cancelled']).required(),
        type: yup.string().oneOf(['In-Person', 'Online', 'TBD'], 'Invalid type').required('Type of event is required'),
        notes: yup.string().trim().max(500),
        date: yup.date().required().min(new Date(), 'Event Date cannot be in the past'),
        location: yup.string().trim().nullable(),
    });
    try {
        data = await validationSchema.validate(data,
            { abortEarly: false });
        let result = await Event.create(data);
        res.json(result);
    }
    catch (err) {
        res.status(400).json({ errors: err.errors });
    }
});

//API ENDPOINT 2 SEARCHING EVENTS
router.get("/", async (req, res) => {
    let condition = {};
    let search = req.query.search;
    if (search) {
        condition[Op.or] = [
            { name: { [Op.like]: `%${search}%` } },
            { description: { [Op.like]: `%${search}%` } },
            { status: { [Op.like]: `%${search}%` } },
            { type: { [Op.like]: `%${search}%` } },
            { notes: { [Op.like]: `%${search}%` } },
        ];
    }
    let list = await Event.findAll({
        where: condition,
        order: [['createdAt', 'DESC']],
    });
    res.json(list);
});


//API ENDPOINT 3 FOR OPENING SPECIFIC EVENTS
router.get("/:id", async (req, res) => {
    let id = req.params.id;
    let event = await Event.findByPk(id)
    // Check id not found
    if (!event) {
        res.sendStatus(404);
        return;
    }
    res.json(event);
});

//API ENDPOINT 4 FOR UPDATE BUTTON
router.put("/:id", async (req, res) => {
    let id = req.params.id;
    // Check id not found
    let event = await Event.findByPk(id);
    if (!event) {
        res.sendStatus(404);
        return;
    }
    let data = req.body;
    // Validate request body
    let validationSchema = yup.object({
        name: yup.string().trim().min(3).max(100),
        description: yup.string().trim().min(3).max(500),
        status: yup.string().oneOf(['Completed', 'Upcoming', 'Cancelled']).required(),
        type: yup.string().oneOf(['In-Person', 'Online', 'TBD'], 'Invalid type').required('Type of event is required'),
        notes: yup.string().trim().max(500),
        date: yup.date().required().min(new Date(), 'Event Date cannot be in the past'),
    });
    try {
        data = await validationSchema.validate(data,
            { abortEarly: false });

        let num = await Event.update(data, {
            where: { id: id }
        });
        if (num == 1) {
            res.json({
                message: "Event was updated successfully."
            });
        }
        else {
            res.status(400).json({
                message: `Cannot update event with id ${id}.`
            });
        }
    }
    catch (err) {
        res.status(400).json({ errors: err.errors });
    }
});

//API ENDPOINT 5 FOR DELETING
router.delete("/:id", async (req, res) => {
    let id = req.params.id;
    // Check id not found
    let event = await Event.findByPk(id);
    if (!event) {
        res.sendStatus(404);
        return;
    }

    let num = await Event.destroy({
        where: { id: id }
    })
    if (num == 1) {
        res.json({
            message: "Event was deleted successfully."
        });
    }
    else {
        res.status(400).json({
            message: `Cannot delete event with id ${id}.`
        });
    }
});
module.exports = router;