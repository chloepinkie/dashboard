import crypto from 'crypto';
import User from '@/app/api/models/user.model';
import dbConnect from '@/lib/mongoose';

export async function generateToken(email) {
  await dbConnect();
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 3600000); // 1 hour from now

  await User.findOneAndUpdate(
    { email },
    { email, token, tokenExpiresAt: expiresAt },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  return token;
}

export async function verifyToken(token) {
  await dbConnect();
  console.log('Attempting to verify token:', token);
  
  const user = await User.findOne({ token });
  
  if (!user) {
    console.error('Token not found');
    throw new Error('Invalid token');
  }
  
  if (Date.now() > user.tokenExpiresAt) {
    console.error('Token has expired');
    await User.updateOne({ _id: user._id }, { $unset: { token: 1, tokenExpiresAt: 1 } });
    throw new Error('Token expired');
  }
  
  console.log('Token verified successfully. Email:', user.email);
  return user.email;
}