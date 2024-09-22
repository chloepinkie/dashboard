import connectToDatabase from '../../../lib/mongoose';
import User from '../../../models/User';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).end();
  }

  const { token } = req.query;

  await connectToDatabase();

  const user = await User.findOne({ token });

  if (!user) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }

  // Clear the token after verification
  user.token = '';
  await user.save();

  // Log the user in by setting a session or cookie here
  res.status(200).json({ message: 'Login successful!' });
}
