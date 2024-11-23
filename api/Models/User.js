const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    fullName: { type: String},
    username: { type: String, unique: true},
    bio: { type: String},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: { type: String, default: '' }, // URL to the profile picture
    attendedEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Event' }],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    badge: { 
        type: String,
        enum: ['Bronze', 'Silver', 'Gold', 'Platinum'],
        default: 'Bronze',
    },
});

// Method to update badge based on the number of attended events
userSchema.methods.updateBadge = function () {
    const attendedCount = this.attendedEvents.length;
    if (attendedCount >= 50) {
        this.badge = 'Platinum';
    } else if (attendedCount >= 30) {
        this.badge = 'Gold';
    } else if (attendedCount >= 10) {
        this.badge = 'Silver';
    } else {
        this.badge = 'Bronze';
    }
};

// Password hashing middleware
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

module.exports = mongoose.model('User', userSchema);
