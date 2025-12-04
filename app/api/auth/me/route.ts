import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    // Kirim data user & izinnya ke frontend
    return NextResponse.json({
      username: payload.username,
      role: payload.role,
      permissions: payload.permissions || [] // Pastikan selalu array
    });
  } catch (error) {
    return NextResponse.json({ error: "Invalid Token" }, { status: 401 });
  }
}