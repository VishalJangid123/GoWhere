const express = require('express');
const router = express.Router();
const Event = require('../Models/Event');
const User = require('../Models/User');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage, limits: { fileSize: 20 * 1024 * 1024 } });

// Route to create a new event
router.post('/create', authMiddleware, upload.single('image'), async (req, res) => {
    let {
        name, location, notesForAttendees,
        tags, date, time
    } = req.body;

    location = JSON.parse(location);
    tags = JSON.parse(tags);
    date = new Date(JSON.parse(date));
    // Check if the image was uploaded
    console.log(req.body)
    let imageUrl = [];
    if (req.file) {
        try {
            // Upload image to ImgBB
            const formData = new FormData();
            formData.append('image', req.file.buffer.toString('base64'));

            const response = await axios.post('https://api.imgbb.com/1/upload', formData, {
                params: { key: process.env.IMG_URIBB_API_KEY },
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            });

            // Get the image URL from ImgBB response
            console.log(response.data)
            imageUrl.push(response.data.data.url);
        } catch (error) {
            console.error('Error uploading image:', error);
            return res.status(500).json({ message: 'Image upload failed' });
        }
    }

    // Create the new event document
    try {
        const newEvent = new Event({
            name,
            location: {
                type: 'Point',
                coordinates: location.coordinates,
                name: location.name,
                street: location.street,
                district: location.district,
                province: location.province
            },
            notesForAttendees,
            tags,
            date,
            time,
            createdBy: req.user.id,
            images: imageUrl, // Save the image URL if available
        });
        console.log("Images")
        console.log(imageUrl)
        console.log(newEvent)
        await newEvent.save();
        res.status(201).json({ message: 'Event created successfully', event: newEvent });
    } catch (err) {
        console.log(err);
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

router.get('/all', authMiddleware, async (req, res) => {

    try {

        let result = await Event.find({});
        res.status(201).json({ message: 'Event Recv', events: result });
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Server error' });
    }
});


router.get('/:eventId', authMiddleware, async (req, res) => {
    try {
        const { eventId } = req.params;

        // Find the event by ID and populate creator and attendees
        const event = await Event.findById(eventId)
            .populate('createdBy', 'fullName email profilePicture badge') // Get specific fields from the creator
            .populate({
                path: 'attendees',
                select: 'fullName email profilePicture badge', // Get specific fields from the attendees
            });

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        res.status(200).json({
            id: event._id,
            name: event.name,
            location: event.location,
            eventTime: event.eventTime,
            images: event.images,
            tags: event.tags,
            notesForAttendees: event.notesForAttendees,
            createdBy: event.createdBy, // Includes name, email, profile picture, and badge
            attendees: event.attendees, // Includes list of attendees with their details
            createdAt: event.createdAt,
            updatedAt: event.updatedAt,
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});




module.exports = router;
