const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: { type: String, required: true },
    short_description: { type: String, required: true },
    detailed_description: String,
    my_contribution: String,
    tech_stack: [String],
    github_url: String,
    live_demo_url: String,
    image_urls: [String],
    featured: { type: Boolean, default: false },
    display_order: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);