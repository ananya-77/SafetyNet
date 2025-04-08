const mongoose = require('mongoose');

// MongoDB connection string (REPLACE <db_password> WITH YOUR ACTUAL PASSWORD)
const mongoURI = "mongodb+srv://aganesam56:<db_password>@ecommerce.kmpuoyd.mongodb.net/?retryWrites=true&w=majority&appName=ecommerce";

const connectDB = async () => {
    try {
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("✅ MongoDB Connected Successfully");
    } catch (error) {
        console.error("❌ MongoDB Connection Failed:", error);
        process.exit(1);
    }
};

module.exports = connectDB;
