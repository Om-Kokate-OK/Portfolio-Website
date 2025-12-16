const express = require('express');
const CodingMetric = require('../models/CodingMetric');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all coding metrics
router.get('/', async (req, res) => {
    try {
        const metrics = await CodingMetric.find().sort('display_order');
        res.json(metrics);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create coding metric
router.post('/', auth, async (req, res) => {
    try {
        const metric = new CodingMetric(req.body);
        await metric.save();
        res.status(201).json(metric);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update coding metric
router.put('/:id', auth, async (req, res) => {
    try {
        const metric = await CodingMetric.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(metric);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete coding metric
router.delete('/:id', auth, async (req, res) => {
    try {
        await CodingMetric.findByIdAndDelete(req.params.id);
        res.json({ message: 'Coding metric deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;