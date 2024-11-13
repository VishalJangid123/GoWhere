const express = require('express');
const router = express.Router();
const User = require('../Models/User');
const Event = require('../Models/Event');
const authMiddleware = require('./middleware/authMiddleware');

// Route to get user profile
router.get('/:userId', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).populate('attendedEvents');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Route to update user profile picture
router.put('/:userId/profile-picture', authMiddleware, async (req, res) => {
    const { profilePicture } = req.body;
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.profilePicture = profilePicture;
        await user.save();
        res.status(200).json({ message: 'Profile picture updated', user });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Route to update attended events and badge
router.put('/:userId/attend-event/:eventId', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        const event = await Event.findById(req.params.eventId);
        
        if (!user || !event) return res.status(404).json({ message: 'User or event not found' });
        
        if (!user.attendedEvents.includes(event._id)) {
            user.attendedEvents.push(event._id);
            user.updateBadge(); // Update badge based on attended events
            await user.save();
        }

        event.attendees.push(user._id);
        await event.save();

        res.status(200).json({ message: 'Event attended and badge updated', user });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
