import { createTransport } from 'nodemailer';
import { generateToken } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const body = await req.text();
    const { email } = JSON.parse(body);

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const token = await generateToken(email);

    const verificationLink = `${process.env.NEXT_PUBLIC_URL}/api/auth/verify?token=${token}`;

    const transporter = createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Sign in to Left on Friday Data Dashboard',
      text: `Click this link to sign in: ${verificationLink}`,
      html: `<p>Click <a href="${verificationLink}">here</a> to sign in to Left on Friday Data Dashboard.</p>`,
    });

    return NextResponse.json({ message: 'Check your email for the login link' });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: error.message || 'An error occurred during login' }, { status: 500 });
  }
}