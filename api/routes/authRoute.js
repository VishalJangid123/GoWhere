const express = require('express');
const router = express.Router();
const User = require('../Models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Load environment variables (for JWT secret)
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

// Sign-up route
router.post('/signup', async (req, res) => {
    console.log("Register called")
    console.log(req.body)
    const { fullName, email, password } = req.body;
    try {
        // Check if the user already exists
        let existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create a new user
        const newUser = new User({
            fullName,
            username : fullName,
            email,
            password,
        });

        // Save the new user (password hashing is done in the User model's pre-save hook)
        await newUser.save();

        // Generate a JWT token
        const token = jwt.sign({ id: newUser._id }, JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePicture: newUser.profilePicture,
                badge: newUser.badge
            }
        });
    } catch (err) {
        console.log(err)
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

// Sign-in route
router.post('/signin', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Compare the provided password with the stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Generate a JWT token
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({
            message: 'Sign-in successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                profilePicture: user.profilePicture,
                badge: user.badge
            }
        });
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});

module.exports = router;
