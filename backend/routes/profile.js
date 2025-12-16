const express = require('express');
const Profile = require('../models/Profile');
const auth = require('../middleware/auth');

const router = express.Router();

/**
 * GET PROFILE
 * Works even if dataset is empty
 */
router.get('/', async (req, res) => {
  try {
    const profile = await Profile.findOne({});
    res.json(profile || {}); // return empty object if not exists
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * CREATE / UPDATE PROFILE
 * EMPTY DATASET SAFE
 */
router.put('/', auth, async (req, res) => {
  try {
    // 🔥 CRITICAL FIX: remove _id if present
    delete req.body._id;

    const profile = await Profile.findOneAndUpdate(
      {},                 // single profile
      { $set: req.body }, // update fields
      {
        new: true,
        upsert: true,
        runValidators: true
      }
    );

    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
