const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
    skill_name: { type: String, required: true },
    category: { type: String, required: true },
    proficiency_level: String,
    years_of_experience: Number,
    display_order: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Skill', skillSchema);