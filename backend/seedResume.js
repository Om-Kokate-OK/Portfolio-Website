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
        console.log('Connected successfully. Cleaning existing portfolio collection documents...');

        // 1. Clean existing records
        await Profile.deleteMany({});
        await Project.deleteMany({});
        await Skill.deleteMany({});
        await Certificate.deleteMany({});
        console.log('Cleaned all old dummy records.');

        // 2. Seed Real Resume Profile
        const realProfile = new Profile({
            full_name: 'Om Sachin Kokate',
            headline: 'Software Developer & Information Technology Architect',
            about_me: `I am a passionate B.Tech student specializing in Information Technology at Vishwakarma Institute of Technology (VIT Pune). I thrive in creating innovative full-stack solutions and distributed systems, with hands-on experience in Android/Flutter app development, micro-controller IoT automations, and backend architectures.\n\nMy academic achievements reflect my dedication to technical excellence, maintaining a CGPA of 8.82/10 while actively participating in national hackathons and state-level developer challenges.`,
            email: 'omkokate2535@gmail.com',
            phone: '+91 8007226255',
            location: 'Pune, Maharashtra, India',
            profile_image_url: 'https://drive.google.com/thumbnail?id=1QfEUSVqlGYq01bMniFa6C63YfZzfkAZj&sz=w1000',
            resume_url: '',
            linkedin_url: 'https://linkedin.com/in/om-kokate',
            github_url: 'https://github.com/Om-Kokate-OK'
        });
        await realProfile.save();
        console.log('✅ Seeded Real Profile:', realProfile.full_name);

        // 3. Seed Real Projects from Resume
        const realProjects = [
            {
                title: 'EventPlus',
                short_description: 'Real-Time Event Engagement & Analytics Platform featuring instant QR code scanning and engagement rewards.',
                detailed_description: `EventPlus is a real-time event engagement platform where attendees scan custom-generated QR codes to earn engagement points, unlock achievement badges, and redeem digital rewards.\n\nIt features an intuitive React Progressive Web App (PWA) client interface, a robust, concurrent Node.js backend transactional API system, a stable PostgreSQL database model, and automated Python analytical algorithms for event metric calculations.`,
                my_contribution: 'Designed the React PWA layout, established the Node.js event coordinate backend router, and modeled the PostgreSQL user badge transactional logic.',
                tech_stack: ['React.js', 'PWA', 'Node.js', 'PostgreSQL', 'Python', 'WebSockets'],
                github_url: 'https://github.com/Om-Kokate-OK/EventPlus',
                live_demo_url: '',
                image_urls: [
                    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80'
                ],
                featured: true,
                display_order: 1
            },
            {
                title: 'Court Scheduling Engine (HPCS-GA)',
                short_description: 'A mathematically optimized, scalable pipeline for real-time judicial scheduling using advanced optimization models.',
                detailed_description: `Built utilizing the HPCS-GA scheduling framework, this platform delivers a mathematically optimized and fair solution for real-time judicial scheduling workloads.\n\nIt implements highly efficient task allocation algorithms, options to integrate Reinforcement Learning protocols for autonomous scheduling adjustments without predefined functions, and leverages Explainable AI (XAI) structures to provide clear legal justifications for scheduling logs.`,
                my_contribution: 'Coded the main HPCS-GA task optimization module in Java, built the analytics dashboard in React, and created the scheduling simulator.',
                tech_stack: ['Java', 'Optimization Models', 'Explainable AI (XAI)', 'Reinforcement Learning', 'Python'],
                github_url: 'https://github.com/Om-Kokate-OK/Court-Management-System-using-HPSC-GA',
                live_demo_url: '',
                image_urls: [
                    'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80'
                ],
                featured: true,
                display_order: 2
            },
            {
                title: 'Purchase Ordering System',
                short_description: 'Full-stack role-based procurement platform managing RFQ lifecycle, vendor assignments, and PDF reporting.',
                detailed_description: `This platform enables an end-to-end procurement pipeline covering RFQ → Approval → Vendor Quote → PO generation workflows.\n\nIt supports multi-vendor assignments, automated quote comparison engines, automated purchase order creation, and client PDF report compiling. Built with role-based access control (RBAC) for Requesters, Approvers, Officers, and Vendors.`,
                my_contribution: 'Configured the backend express router, setup the MongoDB procurement document validation schemas, and coded the React RBAC dashboard panels.',
                tech_stack: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'PDFKit', 'RBAC Security'],
                github_url: 'https://github.com/Om-Kokate-OK/Purchase-Ordering-System',
                live_demo_url: '',
                image_urls: [
                    'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80'
                ],
                featured: true,
                display_order: 3
            },
            {
                title: 'AI Inventory Rebalancing System',
                short_description: 'AI-based movement optimizer designed to rebalance retail stocks across regional warehouses.',
                detailed_description: `Optimizes inventory movements across multiple regional distribution centers for large retailers like Walmart.\n\nIt utilizes predictive machine learning analytics by combining historical sales data with external variables like Google Trends API signals (for demand forecasting), local weather forecast feeds, and public events to auto-generate zone transfer plans, reducing stockouts and logistics costs.`,
                my_contribution: 'Implemented the demand forecasting model using Scikit-Learn, connected the Google Trends scrapers, and designed the zone-wise visual dashboard.',
                tech_stack: ['Python', 'Machine Learning', 'Google Trends API', 'Predictive Analytics', 'MongoDB'],
                github_url: 'https://github.com/Om-Kokate-OK/Inventory-Reblancing-',
                live_demo_url: '',
                image_urls: [
                    'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80'
                ],
                featured: false,
                display_order: 4
            },
            {
                title: 'IoT Gas Leakage Detection System',
                short_description: 'Real-time IoT environmental safety platform designed to detect hazardous gases and trigger containment.',
                detailed_description: `An end-to-end, high-throughput environmental safety monitoring system designed to detect hazardous gas leakages (such as LPG, Methane, or Carbon Monoxide).\n\nBuilt to bridge physical micro-controller gas sensors with a digital network, the system evaluates toxic thresholds instantly to sound buzzers, send real-time Android push alerts, and execute automated containment protocols like active ventilation exhaust triggers.`,
                my_contribution: 'Programmed the Arduino and NodeMCU micro-controller sensor logic, established the Real-time Firebase listeners, and built the Java Android client application.',
                tech_stack: ['Internet of Things (IoT)', 'Arduino', 'NodeMCU', 'Java', 'Android Studio', 'Firebase'],
                github_url: 'https://github.com/Om-Kokate-OK/Gas-Detection-with-IOT-with-Android-App',
                live_demo_url: '',
                image_urls: [
                    'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80'
                ],
                featured: false,
                display_order: 5
            },
            {
                title: 'GrowBuddy Smart Agriculture Tracker',
                short_description: 'IoT smart greenhouse system combining soil metric streaming and CNN crop disease classification.',
                detailed_description: `GrowBuddy is an agricultural IoT platform leveraging Arduino and NodeMCU microcontrollers to broadcast real-time plant health indices.\n\nIt features an interactive Android app (Java & Firebase) for data visualization and pump actuators, linked to a crop leaf disease classification engine powered by a Convolutional Neural Network (CNN) built in TensorFlow and Keras.`,
                my_contribution: 'Created the CNN crop classification layer, integrated Keras model outputs, and programmed the microcontroller sleep-cycle thresholds.',
                tech_stack: ['C++', 'Arduino', 'NodeMCU', 'Android', 'Firebase', 'TensorFlow', 'Keras', 'CNN'],
                github_url: 'https://github.com/Om-Kokate-OK/GrowBuddy',
                live_demo_url: '',
                image_urls: [
                    'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=800&q=80'
                ],
                featured: false,
                display_order: 6
            }
        ];
        await Project.insertMany(realProjects);
        console.log('✅ Seeded Real Projects:', realProjects.length);

        // 4. Seed Real Skills from Resume
        const realSkills = [
            { skill_name: 'C++', category: 'Programming Languages', proficiency_level: 'Expert', years_of_experience: 4, display_order: 1 },
            { skill_name: 'C Programming', category: 'Programming Languages', proficiency_level: 'Expert', years_of_experience: 4, display_order: 2 },
            { skill_name: 'Java', category: 'Programming Languages', proficiency_level: 'Expert', years_of_experience: 4, display_order: 3 },
            { skill_name: 'Python', category: 'Programming Languages', proficiency_level: 'Expert', years_of_experience: 3, display_order: 4 },
            { skill_name: 'C#', category: 'Programming Languages', proficiency_level: 'Intermediate', years_of_experience: 2, display_order: 5 },
            { skill_name: 'PHP', category: 'Programming Languages', proficiency_level: 'Intermediate', years_of_experience: 2, display_order: 6 },
            
            { skill_name: 'Flutter', category: 'Mobile Development', proficiency_level: 'Advanced', years_of_experience: 3, display_order: 7 },
            { skill_name: 'Android Studio', category: 'Mobile Development', proficiency_level: 'Advanced', years_of_experience: 3, display_order: 8 },
            { skill_name: 'React.js', category: 'Frontend', proficiency_level: 'Advanced', years_of_experience: 2, display_order: 9 },
            
            { skill_name: 'SQL', category: 'Databases & Cloud', proficiency_level: 'Advanced', years_of_experience: 3, display_order: 10 },
            { skill_name: 'Google Firebase', category: 'Databases & Cloud', proficiency_level: 'Advanced', years_of_experience: 3, display_order: 11 },
            { skill_name: 'GitHub', category: 'Tools & Infrastructure', proficiency_level: 'Expert', years_of_experience: 4, display_order: 12 },
            { skill_name: 'Internet of Things (IoT)', category: 'Tools & Infrastructure', proficiency_level: 'Expert', years_of_experience: 3, display_order: 13 }
        ];
        await Skill.insertMany(realSkills);
        console.log('✅ Seeded Real Technical Skills:', realSkills.length);

        // 5. Seed Real Certificates from Resume
        const realCertificates = [
            {
                title: 'AWS Academy Graduate - Cloud Developing',
                issuer: 'AWS Academy',
                date_issued: new Date('2026-04-15'),
                description: 'Virtual training course covering cloud developing, cloud infrastructures, containerized server architecture, and secure deployments.',
                image_url: 'https://images.credly.com/images/0e284c3f-5164-4b21-8660-0d84737941bc/image.png',
                credential_url: '',
                featured: true,
                display_order: 1
            },
            {
                title: 'IBM Full Stack Software Developers Professional',
                issuer: 'Coursera / IBM',
                date_issued: new Date('2025-10-15'),
                description: 'Multi-stage professional program covering frontend design systems, backend express APIs, databases, Docker containerization, Kubernetes cluster deployments, and CI/CD pipelines.',
                image_url: 'https://api.accredible.com/v1/frontend/credential_website_embed_image/badge/123456789',
                credential_url: '',
                featured: true,
                display_order: 2
            },
            {
                title: 'Machine Learning Course Certification',
                issuer: 'IIT Bombay / Acmegrade',
                date_issued: new Date('2024-07-15'),
                description: 'Advanced curriculum covering predictive machine learning regressions, CNN architectures, data mining, and neural network evaluations.',
                image_url: 'https://images.unsplash.com/photo-1527474305487-b87b222841cc?auto=format&fit=crop&w=800&q=80',
                credential_url: '',
                featured: false,
                display_order: 3
            }
        ];
        await Certificate.insertMany(realCertificates);
        console.log('✅ Seeded Real Certificates:', realCertificates.length);

        console.log('--- RESUME DATABASE SEEDING COMPLETED SUCCESSFULLY ---');
    } catch (err) {
        console.error('❌ Seeding process failed:', err);
    } finally {
        mongoose.connection.close();
        console.log('Database connection closed.');
    }
}

seedDatabase();
