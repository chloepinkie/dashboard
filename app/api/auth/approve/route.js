import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/app/api/models/user.model';
import { createTransport } from 'nodemailer';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 });
    }

    await dbConnect();

    const user = await User.findOne({ token });

    if (!user) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 400 });
    }

    if (user.isApproved) {
      return NextResponse.json({ message: 'User is already approved' });
    }

    user.isApproved = true;
    await user.save();

    // Send approval email to user
    const transporter = createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const loginLink = `${process.env.NEXT_PUBLIC_URL}/login`;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Your account has been approved',
      text: `Your account has been approved. You can now log in at: ${loginLink}`,
      html: `<p>Your account has been approved. You can now <a href="${loginLink}">log in</a>.</p>`,
    });

    return NextResponse.json({ message: 'User approved successfully' });
  } catch (error) {
    console.error('Approval error:', error);
    return NextResponse.json({ error: error.message || 'An error occurred during approval' }, { status: 500 });
  }
}