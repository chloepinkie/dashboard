import crypto from 'crypto';
import { ObjectId } from 'mongodb';
import clientPromise from '@/lib/mongodb';

export async function generateToken(email) {
  const client = await clientPromise;
  const db = client.db();
  const usersCollection = db.collection('users');

  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 3600000); // 1 hour from now

  await usersCollection.findOneAndUpdate(
    { email },
    { $set: { email, token, tokenExpiresAt: expiresAt } },
    { upsert: true, returnDocument: 'after' }
  );

  return token;
}

export async function verifyToken(token) {
  const client = await clientPromise;
  const db = client.db();
  const usersCollection = db.collection('users');

  console.log('Attempting to verify token:', token);
  
  const user = await usersCollection.findOne({ token });
  
  if (!user) {
    console.error('Token not found');
    throw new Error('Invalid token');
  }
  
  if (Date.now() > user.tokenExpiresAt) {
    console.error('Token has expired');
    await usersCollection.updateOne(
      { _id: new ObjectId(user._id) },
      { $unset: { token: 1, tokenExpiresAt: 1 } }
    );
    throw new Error('Token expired');
  }
  
  console.log('Token verified successfully. Email:', user.email);
  return user.email;
}