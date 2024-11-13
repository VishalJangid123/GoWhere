const express = require('express');
const router = express.Router();
const Event = require('../Models/Event');
const User = require('../Models/User');
const authMiddleware = require('./middleware/authMiddleware');

// Route to create a new event
router.post('/create', authMiddleware, async (req, res) => {
    const {
        name, description, location, images, notesForAttendees,
        tags, date, startTime, endTime, createdBy
    } = req.body;

    try {
        const newEvent = new Event({
            name,
            description,
            location: {
                type: 'Point',
                coordinates: location.coordinates,
            },
            images,
            notesForAttendees,
            tags,
            date,
            time: {
                startTime,
                endTime,
            },
            createdBy,
        });

        await newEvent.save();
        res.status(201).json({ message: 'Event created successfully', event: newEvent });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Route to update event details
router.put('/:eventId/update', authMiddleware, async (req, res) => {
    const {
        name, description, location, images, notesForAttendees,
        tags, date, startTime, endTime
    } = req.body;

    try {
        const event = await Event.findById(req.params.eventId);
        if (!event) return res.status(404).json({ message: 'Event not found' });

        if (name) event.name = name;
        if (description) event.description = description;
        if (location) event.location.coordinates = location.coordinates;
        if (images) event.images = images;
        if (notesForAttendees) event.notesForAttendees = notesForAttendees;
        if (tags) event.tags = tags;
        if (date) event.date = date;
        if (startTime && endTime) {
            event.time.startTime = startTime;
            event.time.endTime = endTime;
        }

        await event.save();
        res.status(200).json({ message: 'Event updated successfully', event });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
