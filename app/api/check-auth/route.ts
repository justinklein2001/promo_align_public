import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET() {

  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;
  
  if (token && verifyToken(token)) {
    return NextResponse.json({ authenticated: true });
  } else {
    return NextResponse.json({ authenticated: false });
  }
}
