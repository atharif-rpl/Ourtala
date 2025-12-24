import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { prisma } from '@/lib/prisma'; // 1. Wajib import Prisma

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);

    // 2. AMBIL DATA FRESH DARI DATABASE
    // Kita pakai ID dari token untuk cari user aslinya
    const user = await prisma.user.findUnique({
      where: { id: Number(payload.id) }, // Pastikan ID di token dikonversi jadi Number
      select: {
        username: true,
        role: true,
        permissions: true,
        // name: true, // (Opsional) kalau di database ada kolom 'name'
      }
    });

    if (!user) {
      return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });
    }

    // 3. Kirim data dari Database ke Frontend
    return NextResponse.json({
      username: user.username, // Ini yang bikin nama muncul benar!
      role: user.role,
      permissions: user.permissions || []
    });

  } catch (error) {
    console.error("Auth Error:", error);
    return NextResponse.json({ error: "Invalid Token" }, { status: 401 });
  }
}