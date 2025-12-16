const mongoose = require('mongoose');

const codingMetricsSchema = new mongoose.Schema({
    platform_name: { type: String, required: true },
    username: { type: String, required: true },
    profile_url: { type: String, required: true },
    total_solved: { type: Number, default: 0 },
    easy_solved: Number,
    medium_solved: Number,
    hard_solved: Number,
    rank_rating: String,
    badge_icon_url: String,
    display_order: { type: Number, default: 0 },
    last_updated: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('CodingMetric', codingMetricsSchema);