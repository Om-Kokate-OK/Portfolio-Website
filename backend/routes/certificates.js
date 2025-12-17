const express = require('express');
const Certificate = require('../models/Certificate');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all certificates
router.get('/', async (req, res) => {
    try {
        const { featured } = req.query;
        let query = {};
        if (featured === 'true') query.featured = true;
        const certificates = await Certificate.find(query).sort('display_order');
        res.json(certificates);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get certificate by id
router.get('/:id', async (req, res) => {
    try {
        const certificate = await Certificate.findById(req.params.id);
        res.json(certificate);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create certificate
router.post('/', auth, async (req, res) => {
    try {
        const certificate = new Certificate(req.body);
        await certificate.save();
        res.status(201).json(certificate);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update certificate
router.put('/:id', auth, async (req, res) => {
    try {
        const certificate = await Certificate.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(certificate);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete certificate
router.delete('/:id', auth, async (req, res) => {
    try {
        await Certificate.findByIdAndDelete(req.params.id);
        res.json({ message: 'Certificate deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;