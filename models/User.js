
const mongoose = require('mongoose');

// Define the structure and rules for a user.
const userSchema = new mongoose.Schema({
    // Store the user's name.
    name: {
        type: String,
        required: true,
        trim: true
    },

    // Store the user's email and prevent duplicates.
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },

    // Store the user's age.
    age: {
        type: Number,
        required: true,
        min: 0
    }
}, {
    // Automatically add createdAt and updatedAt fields.
    timestamps: true
});

// Create the User model from the schema.
const User = mongoose.model('User', userSchema);

// Export the model so server.js can use it.
module.exports = User;
