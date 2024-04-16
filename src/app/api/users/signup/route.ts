import connectDB from '@/config/database';
import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/User';
import bcryptjs from 'bcryptjs';
import { sendEmail } from '@/utils/mailer';

// POST /api/users/signup
export const POST = async (req: NextRequest) => {
  try {
    await connectDB();
    const reqBody = await req.json();
    const { username, email, password } = reqBody;

    //validation
    console.log(reqBody);

    const user = await User.findOne({ email });

    if (user) {
      return new Response(JSON.stringify({ message: 'User already exists' }), {
        status: 400,
      });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();

    //send verification email
    await sendEmail({ email, emailType: 'VERIFY', userId: savedUser._id });

    return new Response(
      JSON.stringify({
        message: 'User Registered Successfully',
        success: true,
        savedUser,
      }),
      { status: 200 }
    );
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
};
