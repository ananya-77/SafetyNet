const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Allow frontend to talk to backend
const bodyParser = require('body-parser');
const Report = require('./models/Report'); // Import the model

const app = express();
app.use(cors()); // Enable CORS for frontend communication
app.use(bodyParser.json()); // Allow JSON data

// MongoDB connection
mongoose.connect('mongodb+srv://aganesam56:<Family@10>@ecommerce.kmpuoyd.mongodb.net/?retryWrites=true&w=majority&appName=ecommerce', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.log('❌ MongoDB Connection Failed:', err));

// API route to receive and save reports
app.post('/add-report', async (req, res) => {
    try {
        const { title, description, location } = req.body;
        const newReport = new Report({ title, description, location });
        await newReport.save();
        res.status(201).json({ message: "Report added successfully!" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.listen(5000, () => console.log("🚀 Server running on port 5000"));
