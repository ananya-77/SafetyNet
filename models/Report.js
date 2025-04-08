const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema({
    result: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Report", reportSchema);
