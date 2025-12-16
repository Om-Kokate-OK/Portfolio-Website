const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    full_name: { type: String, required: true },
    headline: { type: String, required: true },
    about_me: { type: String, required: true },
    email: { type: String, required: true },
    phone: String,
    location: String,
    profile_image_url: String,
    resume_url: String,
    linkedin_url: String,
    github_url: String,
}, { timestamps: true });

module.exports = mongoose.model('Profile', profileSchema);