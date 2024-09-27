import { createTransport } from 'nodemailer';
import { generateToken } from '@/lib/auth';
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/app/api/models/user.model';

export async function POST(req) {
  try {
    const body = await req.text();
    const { email } = JSON.parse(body);

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Connect to MongoDB
    await dbConnect();

    // Check if user exists and is approved
    let user = await User.findOne({ email });

    if (user && user.isApproved) {
      // User is approved, generate a new token for this session
      const sessionToken = await generateToken(email);
      return NextResponse.json({ 
        message: 'Login successful', 
        token: sessionToken,
        isApproved: true 
      });
    }

    // If user doesn't exist or isn't approved, proceed with registration/approval process
    const token = await generateToken(email);

    user = await User.findOneAndUpdate(
      { email },
      { token, isApproved: false },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    // Send email to admin
    const adminEmail = process.env.ADMIN_EMAIL;
    const approvalLink = `${process.env.NEXT_PUBLIC_URL}/api/auth/approve?token=${token}`;

    const transporter = createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: adminEmail,
      subject: 'New User Registration Approval',
      text: `A user (${email}) has requested access. Click this link to approve: ${approvalLink}`,
      html: `<p>A user (${email}) has requested access. Click <a href="${approvalLink}">here</a> to approve.</p>`,
    });

    return NextResponse.json({ 
      message: 'Registration request sent. Please wait for admin approval.',
      isApproved: false
    });
  } catch (error) {
    console.error('Login/Registration error:', error);
    return NextResponse.json({ error: error.message || 'An error occurred during login/registration' }, { status: 500 });
  }
}