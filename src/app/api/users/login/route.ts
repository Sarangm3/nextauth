import connectDB from '@/config/database';
import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/User';
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';

// POST /api/users/login
export const POST = async (req: NextRequest) => {
  try {
    await connectDB();
    const reqBody = await req.json();
    const { email, password } = reqBody;

    //validation
    console.log(reqBody);

    const user = await User.findOne({ email });

    if (!user) {
      return new Response(JSON.stringify({ message: 'User does not exists' }), {
        status: 400,
      });
    }

    const validPassword = await bcryptjs.compare(password, user.password);

    if (!validPassword) {
      return new Response(
        JSON.stringify({ message: 'Check your credentials' }),
        {
          status: 400,
        }
      );
    }

    const tokenData = {
      id: user._id,
    };

    const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
      expiresIn: '1h',
    });

    const response = new NextResponse(
      JSON.stringify({
        message: 'login successful',
        success: true,
      }),
      { status: 200 }
    );

    response.cookies.set('token', token, {
      httpOnly: true,
    });

    return response;
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
};
