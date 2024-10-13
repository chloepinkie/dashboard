const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  token: {
    type: String,
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
