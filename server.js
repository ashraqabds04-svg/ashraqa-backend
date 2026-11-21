const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// 1. Connect to MongoDB
console.log("Attempting to connect to MongoDB...");
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ Connected to MongoDB successfully!'))
    .catch((err) => console.log('❌ MongoDB connection error:', err.message));

// 2. Create the Booking Model (normally in a separate file, but here for simplicity)
const Booking = mongoose.model('Booking', new mongoose.Schema({
    fullName: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    serviceInterest: { type: String, required: true },
    dateSubmitted: { type: Date, default: Date.now }
}));

// 3. Test Route
app.get('/', (req, res) => {
    res.send('Ashraqa BDS Backend is running successfully!');
});

// 4. API Route to handle form submissions
app.post('/api/book', async (req, res) => {
    try {
        const { fullName, phoneNumber, serviceInterest } = req.body;
        const newBooking = new Booking({ fullName, phoneNumber, serviceInterest });
        await newBooking.save();
        res.status(201).json({ message: "Booking saved successfully!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error. Could not save booking." });
    }
});

// 5. Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});