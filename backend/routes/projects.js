const express = require('express');
const Project = require('../models/Project');
const auth = require('../middleware/auth');
const axios = require('axios');
const cheerio = require('cheerio');

const router = express.Router();

// Get all projects
router.get('/', async (req, res) => {
    try {
        const { featured } = req.query;
        let query = {};
        if (featured === 'true') query.featured = true;
        const projects = await Project.find(query).sort('display_order');
        res.json(projects);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get project by id
router.get('/:id', async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        res.json(project);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create project
router.post('/', auth, async (req, res) => {
    try {
        const project = new Project(req.body);
        await project.save();
        res.status(201).json(project);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update project
router.put('/:id', auth, async (req, res) => {
    try {
        const project = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(project);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Delete project
router.delete('/:id', auth, async (req, res) => {
    try {
        await Project.findByIdAndDelete(req.params.id);
        res.json({ message: 'Project deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Process image URL to get direct link
router.get('/process-image-url', async (req, res) => {
    try {
        const { url } = req.query;
        if (!url) {
            return res.status(400).json({ error: 'URL is required' });
        }

        // Handle Google Drive
        if (url.includes('drive.google.com/file/d/')) {
            const match = url.match(/drive\.google\.com\/file\/d\/([^\/]+)/);
            if (match) {
                const fileId = match[1];
                const directUrl = `https://drive.google.com/uc?id=${fileId}`;
                return res.json({ directUrl });
            }
        }

        // Handle Google Photos
        if (url.includes('photos.app.goo.gl') || url.includes('photos.google.com/share')) {
            try {
                const response = await axios.get(url, {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                    },
                    timeout: 10000
                });
                const $ = cheerio.load(response.data);
                let directUrl = $('meta[property="og:image"]').attr('content');
                if (!directUrl) {
                    const images = [];
                    $('img').each((i, elem) => {
                        const src = $(elem).attr('src');
                        if (src && src.startsWith('https://lh3.googleusercontent.com/')) {
                            images.push(src);
                        }
                    });
                    if (images.length > 0) {
                        // Return the largest image (assuming it's the main one)
                        directUrl = images.sort((a, b) => b.length - a.length)[0];
                    }
                }
                if (directUrl) {
                    return res.json({ directUrl });
                }
            } catch (error) {
                console.error('Error fetching Google Photos:', error.message);
            }
        }

        // Handle Pinterest
        if (url.includes('pinterest.com')) {
            try {
                const response = await axios.get(url, {
                    headers: {
                        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                    },
                    timeout: 10000
                });
                const $ = cheerio.load(response.data);
                let directUrl = $('meta[property="og:image"]').attr('content');
                if (!directUrl) {
                    const images = [];
                    $('img').each((i, elem) => {
                        const src = $(elem).attr('src');
                        if (src && src.includes('pinimg.com')) {
                            images.push(src);
                        }
                    });
                    if (images.length > 0) {
                        directUrl = images[0];
                    }
                }
                if (directUrl) {
                    return res.json({ directUrl });
                }
            } catch (error) {
                console.error('Error fetching Pinterest:', error.message);
            }
        }

        // For other URLs, assume it's already direct
        res.json({ directUrl: url });
    } catch (error) {
        console.error('Error processing image URL:', error);
        res.status(500).json({ error: 'Failed to process image URL' });
    }
});

module.exports = router;