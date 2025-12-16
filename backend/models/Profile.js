const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    full_name: String,
    headline: String,
    about_me: String,
    email: String,
    phone: String,
    location: String,
    profile_image_url: String,
    resume_url: String,
    linkedin_url: String,
    github_url: String,
}, { timestamps: true });

module.exports = mongoose.model('Profile', profileSchema);