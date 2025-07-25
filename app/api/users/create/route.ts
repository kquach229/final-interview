import { checkUser } from '@/lib/checkUser';
import { NextResponse } from 'next/server';

export const POST = async (req: Request) => {
  try {
    // Check if the user is authenticated
    const user = await checkUser();
    return NextResponse.json(user);
  } catch (error) {
    console.error('Error creating user:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    });
  }
};
