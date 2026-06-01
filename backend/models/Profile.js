const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema(
  {
    full_name: {
      type: String,
      default: ''
    },
    headline: {
      type: String,
      default: ''
    },
    about_me: {
      type: String,
      default: ''
    },
    email: {
      type: String,
      default: ''
    },
    phone: {
      type: String,
      default: ''
    },
    location: {
      type: String,
      default: ''
    },
    profile_image_url: {
      type: String,
      default: ''
    },
    resume_url: {
      type: String,
      default: ''
    },
    linkedin_url: {
      type: String,
      default: ''
    },
    github_url: {
      type: String,
      default: ''
    },
    work_history: {
      type: [
        {
          role: { type: String, default: '' },
          company: { type: String, default: '' },
          duration: { type: String, default: '' }
        }
      ],
      default: []
    },
    testimonials: {
      type: [
        {
          quote: { type: String, default: '' },
          client: { type: String, default: '' },
          title: { type: String, default: '' },
          date: { type: String, default: '' }
        }
      ],
      default: []
    },
    services: {
      type: [
        {
          title: { type: String, default: '' },
          icon: { type: String, default: '' }, // e.g. Layout, Server, Database
          description: { type: String, default: '' },
          skills: { type: [String], default: [] }
        }
      ],
      default: []
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Profile', ProfileSchema);
