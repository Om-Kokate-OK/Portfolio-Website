const express = require('express');
const Profile = require('../models/Profile');
const auth = require('../middleware/auth');

const router = express.Router();

// Get profile
router.get('/', async (req, res) => {
    try {
        const profile = await Profile.findOne({});
        res.json(profile);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update profile (SAFE)
router.put('/', auth, async (req, res) => {
    try {
        // 🔥 Remove _id completely if it exists
        if (req.body._id === "" || req.body._id) {
            delete req.body._id;
        }

        const profile = await Profile.findOneAndUpdate(
            {},                     // match first document
            { $set: req.body },     // update only fields
            {
                new: true,
                upsert: true,       // create if not exists
                runValidators: true
            }
        );

        res.json(profile);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
