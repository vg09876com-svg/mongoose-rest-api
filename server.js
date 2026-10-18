
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from config/.env.
dotenv.config({ path: path.join(__dirname, 'config', '.env') });

// Import the User model.
const User = require('./models/User');

// Create the Express application.
const app = express();

// Allow Express to read JSON data sent in requests.
app.use(express.json());

// Connect to the local MongoDB database.
mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log('MongoDB connected successfully!');

        // Start the server after the database connects.
        app.listen(process.env.PORT || 5000, () => {
            console.log(`Server is running on port ${process.env.PORT || 5000}`);
        });
    })
    .catch((error) => {
        console.error('MongoDB connection failed:', error.message);
    });

// Test route to confirm the API is working.
app.get('/', (req, res) => {
    res.send('Welcome to the User REST API!');
});
