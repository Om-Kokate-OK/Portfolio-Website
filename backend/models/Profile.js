const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: ''
    },
    bio: {
      type: String,
      default: ''
    },
    role: {
      type: String,
      default: ''
    },
    skills: {
      type: [String],
      default: []
    },
    github: {
      type: String,
      default: ''
    },
    linkedin: {
      type: String,
      default: ''
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Profile', ProfileSchema);
