const dns = require('dns');

// Use Google's DNS servers to work around the local DNS issue.
dns.setServers(['8.8.8.8', '8.8.4.4']);

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from config/.env.
dotenv.config({
  path: path.join(__dirname, 'config', '.env')
});

// Import the User model.
const User = require('./models/User');

// Create the Express application.
const app = express();

// Allow Express to receive JSON data.
app.use(express.json());

// Welcome route and health check.
app.get('/', (req, res) => {
  res.status(200).send('Welcome to the User REST API!');
});

// GET: Retrieve all users.
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST: Create a new user.
app.post('/api/users', async (req, res) => {
  try {
    const newUser = await User.create(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT: Update a user by ID.
app.put('/api/users/:id', async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedUser) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE: Delete a user by ID.
app.delete('/api/users/:id', async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(
      req.params.id
    );

    if (!deletedUser) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    res.status(200).json({
      message: 'User deleted successfully'
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Use the port provided by Azure, or 5000 locally.
const PORT = process.env.PORT || 5000;

// Connect to MongoDB before starting the server.
async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log('MongoDB connected successfully!');

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Server startup failed:', error.message);
    process.exit(1);
  }
}

startServer();
