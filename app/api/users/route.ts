import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// 1. GET: Ambil Daftar Semua User
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: { // Kita pilih field tertentu saja (Password JANGAN dikirim)
        id: true,
        username: true,
        role: true,
        permissions: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: "Gagal ambil data" }, { status: 500 });
  }
}

// 2. POST: Tambah User Baru
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, password, role, permissions } = body;

    // Cek apakah username sudah ada?
    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) {
      return NextResponse.json({ error: "Username sudah dipakai" }, { status: 400 });
    }

    // Acak Password biar aman
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        role,        // "STAFF" atau "SUPER_ADMIN"
        permissions, // Array contoh: ["update", "read"]
        name: username, // Default nama disamakan dulu
      }
    });

    return NextResponse.json({ message: "User berhasil dibuat" }, { status: 201 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal membuat user" }, { status: 500 });
  }
}