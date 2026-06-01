const mongoose = require('mongoose');
const Profile = require('./models/Profile');
const Project = require('./models/Project');
const Skill = require('./models/Skill');
const Certificate = require('./models/Certificate');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio';

async function seedDatabase() {
    try {
        console.log('Connecting to MongoDB at:', MONGODB_URI);
        await mongoose.connect(MONGODB_URI);
        console.log('Connected successfully. Cleaning collections...');

        // 1. Clean existing records
        await Profile.deleteMany({});
        await Project.deleteMany({});
        await Skill.deleteMany({});
        await Certificate.deleteMany({});
        console.log('Cleaned all existing records.');

        // 2. Seed Profile
        const mockProfile = new Profile({
            full_name: 'Om Kokate',
            headline: 'Full-Stack Software Engineer & Distributed Systems Architect',
            about_me: `I am a passionate software engineer specializing in building high-performance, scalable web applications and distributed backends. With expertise spanning TypeScript/React, Go, and cloud architectures, I love transforming complex technical challenges into simple, elegant, and blazing-fast user experiences.\n\nMy approach balances mathematical performance benchmarks with rich visual aesthetics, building products that feel premium and scale flawlessly under heavy loads.`,
            email: 'omkokate5325@gmail.com',
            phone: '+91 98765 43210',
            location: 'Mumbai, India',
            profile_image_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&h=600&q=80',
            resume_url: 'https://example.com/om-kokate-resume.pdf',
            linkedin_url: 'https://linkedin.com/in/om-kokate',
            github_url: 'https://github.com/Om-Kokate-OK'
        });
        await mockProfile.save();
        console.log('✅ Seeded Profile:', mockProfile.full_name);

        // 3. Seed Projects
        const mockProjects = [
            {
                title: 'AetherDB - Distributed Key-Value Store',
                short_description: 'A highly available, raft-consensus backed key-value database built from scratch to achieve sub-millisecond lookups.',
                detailed_description: `AetherDB is a state-of-the-art distributed key-value store engineered for ultra-low latency and absolute fault tolerance. Operating on custom Raft consensus protocols, it guarantees strong consistency (linearizability) across multi-region server clusters.\n\nFeaturing LSM-Tree storage engines, advanced write-ahead logging, and automated cluster membership reconfigurations, it serves over 150,000 requests per second at sub-millisecond p99 latencies.`,
                my_contribution: 'Designed and implemented the Raft consensus replication module, created the LSM-tree storage compaction rules, and built a custom Go TCP server driver.',
                tech_stack: ['Go', 'Raft Consensus', 'LSM-Tree', 'gRPC', 'Docker', 'Kubernetes'],
                github_url: 'https://github.com/Om-Kokate-OK/aetherdb',
                live_demo_url: 'https://example.com/aetherdb-demo',
                image_urls: [
                    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1560732488-6b0df240254a?auto=format&fit=crop&w=800&q=80'
                ],
                featured: true,
                display_order: 1
            },
            {
                title: 'EcoSphere - IoT Greenhouse Control Platform',
                short_description: 'An automated, real-time industrial greenhouse monitoring platform leveraging micro-controllers and web-socket streaming.',
                detailed_description: `EcoSphere connects environmental hardware with high-performance dashboard analytics. Using ESP32 microcontrollers communicating over MQTT protocols, it automatically monitors and maintains soil moisture, ambient temperature, CO2 density, and lighting cycles.\n\nIt features a stunning dashboard offering real-time ChartJS visualizations, predictive climate analytics, and manual valve overrides via instant WebSocket communication channels.`,
                my_contribution: 'Programmed the C++ ESP32 firmware with sleep cycles, built the Node.js MQTT broker pipeline, and designed the real-time React analytics board.',
                tech_stack: ['C++', 'React.js', 'Node.js', 'MQTT', 'WebSockets', 'MongoDB', 'ChartJS'],
                github_url: 'https://github.com/Om-Kokate-OK/ecosphere',
                live_demo_url: 'https://example.com/ecosphere-dashboard',
                image_urls: [
                    'https://images.unsplash.com/photo-1463171359079-3d99966c2176?auto=format&fit=crop&w=800&q=80',
                    'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=800&q=80'
                ],
                featured: true,
                display_order: 2
            },
            {
                title: 'Skyline - Collaborative Whiteboard Workspace',
                short_description: 'A fluid, canvas-based multiplayer canvas platform featuring high-fidelity vector rendering and zero-latency vector synchronization.',
                detailed_description: `Skyline enables decentralized teams to sketch, brainstorm, and collaborate in real time. Backed by CRDTs (Conflict-Free Replicated Data Types), it resolves drawing overlapping issues immediately, ensuring multiple users can work on the same pixel-level coordinate vectors with absolute precision.\n\nIt runs custom vector stroke compression, keeping network packets tiny and operations fully smooth at a locked 60 FPS viewport rendering.`,
                my_contribution: 'Implemented the YJS CRDT synchronization algorithm, crafted the HTML5 Canvas coordinate compression logic, and configured WebSocket room routers.',
                tech_stack: ['TypeScript', 'React.js', 'HTML5 Canvas', 'WebSockets', 'YJS CRDTs', 'Node.js'],
                github_url: 'https://github.com/Om-Kokate-OK/skyline',
                live_demo_url: 'https://example.com/skyline-whiteboard',
                image_urls: [
                    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80'
                ],
                featured: false,
                display_order: 3
            }
        ];
        await Project.insertMany(mockProjects);
        console.log('✅ Seeded Projects:', mockProjects.length);

        // 4. Seed Skills
        const mockSkills = [
            { skill_name: 'TypeScript', category: 'Programming Languages', proficiency_level: 'Expert', years_of_experience: 4, display_order: 1 },
            { skill_name: 'React.js', category: 'Frontend', proficiency_level: 'Expert', years_of_experience: 4, display_order: 2 },
            { skill_name: 'Node.js', category: 'Backend', proficiency_level: 'Advanced', years_of_experience: 3, display_order: 3 },
            { skill_name: 'Go', category: 'Programming Languages', proficiency_level: 'Advanced', years_of_experience: 2, display_order: 4 },
            { skill_name: 'MongoDB', category: 'Databases & Cloud', proficiency_level: 'Advanced', years_of_experience: 3, display_order: 5 },
            { skill_name: 'Docker', category: 'Tools & Infrastructure', proficiency_level: 'Intermediate', years_of_experience: 2, display_order: 6 }
        ];
        await Skill.insertMany(mockSkills);
        console.log('✅ Seeded Technical Skills:', mockSkills.length);

        // 5. Seed Certificates
        const mockCertificates = [
            {
                title: 'AWS Certified Solutions Architect Associate',
                issuer: 'Amazon Web Services',
                date_issued: new Date('2025-06-15'),
                description: 'Demonstrated deep expertise in architecting scalable, secure, highly available, and fault-tolerant systems using AWS services.',
                image_url: 'https://images.credly.com/images/0e284c3f-5164-4b21-8660-0d84737941bc/image.png',
                credential_url: 'https://www.credly.com/badges/aws-certified-solutions-architect-associate',
                featured: true,
                display_order: 1
            },
            {
                title: 'Google Cloud Professional Cloud Developer',
                issuer: 'Google Cloud',
                date_issued: new Date('2025-03-20'),
                description: 'Demonstrated skill in developing highly scalable and resilient web backends using Google Cloud systems and Kubernetes.',
                image_url: 'https://api.accredible.com/v1/frontend/credential_website_embed_image/badge/123456789',
                credential_url: 'https://www.cloudskillsboost.google/public_profiles/123456789',
                featured: true,
                display_order: 2
            },
            {
                title: 'Meta React Developer Professional Certificate',
                issuer: 'Meta (Facebook)',
                date_issued: new Date('2024-11-10'),
                description: 'Completed highly comprehensive Meta frontend track covering React internals, advanced hooks, design tokens, and system layouts.',
                image_url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=800&q=80',
                credential_url: 'https://www.coursera.org/professional-certificates/meta-react-developer',
                featured: false,
                display_order: 3
            }
        ];
        await Certificate.insertMany(mockCertificates);
        console.log('✅ Seeded Certificates:', mockCertificates.length);

        console.log('--- DATABASE SEEDING PROCESS COMPLETED ---');
    } catch (err) {
        console.error('❌ Seeding process failed:', err);
    } finally {
        mongoose.connection.close();
        console.log('Database connection closed.');
    }
}

seedDatabase();
