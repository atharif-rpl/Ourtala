import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// 1. GET: Ambil Daftar Semua User
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        username: true,
        role: true,
        permissions: true,
        createdAt: true
        // Password sengaja tidak diambil demi keamanan
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

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        role,
        permissions,
        name: username, // Default name disamakan dengan username
      }
    });

    return NextResponse.json({ message: "User berhasil dibuat" }, { status: 201 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Gagal membuat user" }, { status: 500 });
  }
}

// 3. PUT: Edit User (PERBAIKAN UTAMA DI SINI)
export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, username, password, permissions, role } = body;

    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    // Data dasar yang mau diupdate
    const updateData: any = { 
      username, 
      permissions,
      role // Tambahkan role agar role juga bisa diedit
    };
    
    // LOGIC PENTING: Cek apakah password diisi?
    // Jika user mengisi password baru, kita HASH dulu sebelum simpan ke DB.
    if (password && password.trim() !== '') {
        const hashedPassword = await bcrypt.hash(password, 10); // <--- ENKRIPSI DIAKTIFKAN
        updateData.password = hashedPassword; 
    }

    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: updateData
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json({ error: 'Gagal update user' }, { status: 500 });
  }
}

// 4. DELETE: Hapus User
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    await prisma.user.delete({
      where: { id: Number(id) },
    });

    return NextResponse.json({ message: 'User deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal hapus user' }, { status: 500 });
  }
}