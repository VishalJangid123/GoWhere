const express = require("express");
const router = express.Router();
const User = require("../Models/User");
const Event = require("../Models/Event");
const authMiddleware = require("../middleware/authMiddleware");
const multer = require('multer');
const axios = require('axios');


const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Route to get the logged-in user's details
router.get("/me", authMiddleware, async (req, res) => {
  console.log("user/me", req.user.id);
  try {
    const user = await User.findById(req.user.id).populate("attendedEvents");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePicture: user.profilePicture,
      badge: user.badge,
      attendedEvents: user.attendedEvents,
      followers: user.followers,
      following: user.following,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      aboutMe: user.aboutMe,
      gender: user.gender,
      interest: user.interest,
      jobTitle: user.jobTitle,
      company: user.company,
      username: user.username,
      birthdate: user.birthdate,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Route to get user profile
router.get("/:userId", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).populate(
      "attendedEvents"
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Route to update user profile picture
router.put("/:userId/profile-picture", authMiddleware, async (req, res) => {
  const { profilePicture } = req.body;
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.profilePicture = profilePicture;
    await user.save();
    res.status(200).json({ message: "Profile picture updated", user });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Route to update attended events and badge
router.put(
  "/:userId/attend-event/:eventId",
  authMiddleware,
  async (req, res) => {
    try {
      const user = await User.findById(req.params.userId);
      const event = await Event.findById(req.params.eventId);

      if (!user || !event)
        return res.status(404).json({ message: "User or event not found" });

      if (!user.attendedEvents.includes(event._id)) {
        user.attendedEvents.push(event._id);
        user.updateBadge(); // Update badge based on attended events
        await user.save();
      }

      event.attendees.push(user._id);
      await event.save();

      res
        .status(200)
        .json({ message: "Event attended and badge updated", user });
    } catch (err) {
      res.status(500).json({ message: "Server error" });
    }
  }
);

// Update user profile
router.put("/update", authMiddleware, async (req, res) => {
  console.log("Update" ,req.body)
    try {
    const userId = req.user.id; // Extract user ID from authMiddleware
    const updates = req.body; // Allow dynamic updates from the request body

    // Validate the input fields
    const allowedUpdates = [
      "fullName",
      "username",
      "aboutMe",
      "birthdate",
      "interests",
      "gender",
      "jobTitle",
      "company",
      "school",
    ];
    console.log(req.body);
    const invalidFields = Object.keys(updates).filter(
      (key) => !allowedUpdates.includes(key)
    );
    console.log(invalidFields);
    console.log("updatedUser");

    if (invalidFields.length > 0) {
      return res.status(400).json({
        message: "Invalid fields in the update",
        invalidFields,
      });
    }

    // Update the user's profile in the database
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true } // Return the updated document
    );
    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get('/events/created', authMiddleware, async (req, res) => {
  try {
      const userId = req.user.id;

      // Find events where the user is the creator
      const eventsCreated = await Event.find({ createdBy: userId })
          .populate('attendees', 'name email profilePicture') // Populate attendee details
          .select('-creator'); // Exclude creator if not required

      res.status(200).json({
          events: eventsCreated,
      });
  } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get events joined by the user
router.get('/events/joined', authMiddleware, async (req, res) => {
  try {
      const userId = req.user.id;

      // Find events where the user is in the attendees list
      const eventsJoined = await Event.find({ attendees: userId })
          .populate('creator', 'name email profilePicture') // Populate creator details
          .select('-attendees'); // Exclude attendees if not required

      res.status(200).json({
          message: 'Events joined by the user',
          events: eventsJoined,
      });
  } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Upload profile picture
router.post('/uploadProfilePicture', authMiddleware, upload.single('profile'), async (req, res) => {
  try {
      const userId = req.user.id;
      console.log("upload image")
      console.log(req.body)
      console.log(req.file)
      if (!req.file) {
          return res.status(400).json({ message: 'No file uploaded' });
      }
      console.log("upload image 1")

      // Send the image to ImgBB
      const formData = new FormData();
      formData.append('image', req.file.buffer.toString('base64')); // Convert buffer to base64

      const response = await axios.post('https://api.imgbb.com/1/upload', formData, {
        params: { key: process.env.IMG_URIBB_API_KEY },
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

      // Get the image URL from ImgBB's response
      const imageUrl = response.data.data.url;

      // Update the user's profile picture in the database
      const updatedUser = await User.findByIdAndUpdate(
          userId,
          { profilePicture: imageUrl },
          { new: true }
      );

      res.status(200).json({
          message: 'Profile picture uploaded successfully',
          profilePicture: imageUrl,
          user: updatedUser,
      });
  } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: 'Error uploading profile picture', error: error.message });
  }
});


module.exports = router;
