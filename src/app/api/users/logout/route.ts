import { NextRequest, NextResponse } from 'next/server';

// POST /api/users/login
export const GET = async (req: NextRequest) => {
  try {
    const response = new NextResponse(
      JSON.stringify({
        message: 'logout successful',
        success: true,
      }),
      { status: 200 }
    );

    response.cookies.set('token', '', {
      httpOnly: true,
      expires: new Date(0),
    });

    return response;
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
};
