const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
    title: { type: String, required: true },
    issuer: { type: String, required: true },
    date_issued: { type: Date, required: true },
    description: String,
    image_url: String,
    credential_url: String,
    featured: { type: Boolean, default: false },
    display_order: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Certificate', certificateSchema);