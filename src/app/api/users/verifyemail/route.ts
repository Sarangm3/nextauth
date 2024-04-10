import connectDB from '@/config/database';
import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/User';

// POST /api/users/verifyemail
export const POST = async (req: NextRequest) => {
  try {
    await connectDB();
    const reqBody = await req.json();
    const { token } = reqBody;
    console.log(token);

    const user = await User.findOne({
      verifyToken: token,
      verifyTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return new Response('Invalid token', {
        status: 400,
      });
    }
    console.log(user);

    user.isVerified = true;
    user.verifyToken = undefined;
    user.verifyTokenExpiry = undefined;

    console.log(user);
    await user.save();

    return new Response(
      JSON.stringify({ message: 'Email verified successfully', success: true }),
      {
        status: 200,
      }
    );
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
};
