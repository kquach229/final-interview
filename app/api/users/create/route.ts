import { checkUser } from '@/lib/checkUser';

export const POST = async (req: Request) => {
  try {
    // Check if the user is authenticated
    await checkUser();
  } catch (error) {
    console.error('Error creating user:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    });
  }
};
