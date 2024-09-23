import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  token: {
    type: String,
  },
  tokenExpiresAt: {
    type: Date,
  },
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
