import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    // 1. Cari User di Database
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return NextResponse.json({ error: "Username tidak ditemukan" }, { status: 401 });
    }

    // 2. Cek Password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Password salah" }, { status: 401 });
    }

    // 3. Buat Token JWT (Kartu Identitas)
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const token = await new SignJWT({ 
        id: user.id, 
        role: user.role, 
        permissions: user.permissions 
      })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('24h') // Token berlaku 24 jam
      .sign(secret);

    // 4. Simpan Token di Cookie (HttpOnly biar aman)
    const response = NextResponse.json({ message: "Login Berhasil", role: user.role });
    
    response.cookies.set('token', token, {
      httpOnly: true, // Gak bisa dibaca hacker lewat JS
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24, // 1 Hari
    });

    return response;

  } catch (error) {
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}