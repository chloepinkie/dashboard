import connectToDatabase from '../../../lib/mongoose';
import User from '../../../models/User';
import nodemailer from 'nodemailer';
import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { email } = req.body;

  await connectToDatabase();

  const token = crypto.randomBytes(32).toString('hex');

  // Upsert the user into the database
  const user = await User.findOneAndUpdate(
    { email },
    { token },
    { upsert: true, new: true }
  );

  // Send the login email with the token as a query param
  const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const loginUrl = `${process.env.NEXT_PUBLIC_URL}/api/auth/verify?token=${token}`;

  await transporter.sendMail({
    from: process.env.EMAIL,
    to: email,
    subject: 'Your Magic Login Link',
    text: `Click this link to login: ${loginUrl}`,
  });

  res.status(200).json({ message: 'Check your email for the login link' });
}
