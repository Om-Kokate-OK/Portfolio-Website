const express = require('express');
const ContactMessage = require('../models/ContactMessage');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all contact messages
router.get('/', auth, async (req, res) => {
    try {
        const messages = await ContactMessage.find().sort('-createdAt');
        res.json(messages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create contact message
router.post('/', async (req, res) => {
    try {
        const message = new ContactMessage(req.body);
        await message.save();
        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update contact message (mark as read)
router.put('/:id', auth, async (req, res) => {
    try {
        const message = await ContactMessage.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(message);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete contact message
router.delete('/:id', auth, async (req, res) => {
    try {
        await ContactMessage.findByIdAndDelete(req.params.id);
        res.json({ message: 'Message deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;