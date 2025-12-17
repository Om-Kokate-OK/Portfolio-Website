const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Certificate = require('./models/Certificate');
require('dotenv').config();

async function seedAdmin() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio');

        const existingUser = await User.findOne({ username: 'admin' });
        if (existingUser) {
            console.log('Admin user already exists');
            return;
        }

        const hashedPassword = await bcrypt.hash('admin123', 10);
        const user = new User({
            username: 'admin',
            password: hashedPassword,
            email: 'admin@example.com', // Change to your email
            role: 'admin',
        });

        await user.save();
        console.log('Admin user created: username=admin, password=admin123');
    } catch (error) {
        console.error('Error seeding admin:', error);
    } finally {
        mongoose.connection.close();
    }
}

async function seedCertificates() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio');

        const existingCertificates = await Certificate.find();
        if (existingCertificates.length > 0) {
            console.log('Certificates already exist');
            return;
        }

        const certificates = [
            {
                title: 'AWS Certified Solutions Architect',
                issuer: 'Amazon Web Services',
                date_issued: new Date('2023-06-15'),
                description: 'Demonstrated expertise in designing distributed systems on AWS platform. Proficient in architecting scalable, highly available, and fault-tolerant systems using AWS services.',
                image_url: 'https://images.credly.com/images/0e284c3f-5164-4b21-8660-0d84737941bc/image.png',
                credential_url: 'https://www.credly.com/badges/aws-certified-solutions-architect-associate',
                featured: true,
                display_order: 1,
            },
            {
                title: 'Google Cloud Professional Developer',
                issuer: 'Google Cloud',
                date_issued: new Date('2023-03-20'),
                description: 'Certified in developing scalable applications and managing Google Cloud resources. Skilled in building and deploying applications on Google Cloud Platform.',
                image_url: 'https://api.accredible.com/v1/frontend/credential_website_embed_image/badge/123456789',
                credential_url: 'https://www.cloudskillsboost.google/public_profiles/123456789',
                featured: true,
                display_order: 2,
            },
            {
                title: 'React Developer Certification',
                issuer: 'Meta (Facebook)',
                date_issued: new Date('2022-11-10'),
                description: 'Completed comprehensive React development course covering advanced concepts, hooks, and best practices for building modern web applications.',
                image_url: 'https://example.com/react-cert.png',
                credential_url: 'https://www.coursera.org/professional-certificates/meta-react-developer',
                featured: false,
                display_order: 3,
            },
        ];

        await Certificate.insertMany(certificates);
        console.log('Sample certificates seeded successfully');
    } catch (error) {
        console.error('Error seeding certificates:', error);
    } finally {
        mongoose.connection.close();
    }
}

if (process.argv[2] === 'certificates') {
    seedCertificates();
} else {
    seedAdmin();
}