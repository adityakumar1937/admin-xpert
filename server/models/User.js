const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  telephone: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  designation: {
    type: String,
    required: false,
  },
  pastExperience: {
    type: [String],
    required: false,
  },
  skillSets: {
    type: [String],
    required: false,
  },
  education: {
    type: [String],
    required: false,
  },
  photo: {
    type: String,
  },
  otp: {
    type: String,
    default: null,
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
