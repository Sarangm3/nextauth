import { NextRequest, NextResponse } from 'next/server';
import { getDataFromToken } from '@/utils/getDataFromToken';
import User from '@/models/User';

// POST /api/users/me
export const POST = async (req: NextRequest) => {
  try {
    const userId = await getDataFromToken(req);
    const user = await User.findById(userId).select('-password');

    //check if there is no user
    return new Response(JSON.stringify({ message: 'User found', data: user }), {
      status: 200,
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
};
