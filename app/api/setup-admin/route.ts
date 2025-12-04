import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    // Cek apakah sudah ada user?
    const userCount = await prisma.user.count();
    if (userCount > 0) {
      return NextResponse.json({ message: "Admin sudah ada, tidak perlu setup lagi." });
    }

    // Buat Super Admin Pertama
    const hashedPassword = await bcrypt.hash("admin123", 10); // Password bawaan: admin123

    const superAdmin = await prisma.user.create({
      data: {
        username: "superadmin",
        password: hashedPassword,
        name: "Big Boss",
        role: "SUPER_ADMIN",
        permissions: ["create", "read", "update", "delete", "manage_users"], // Izin penuh
      }
    });

    return NextResponse.json({ message: "Sukses! User: superadmin, Pass: admin123" });
  } catch (error) {
    return NextResponse.json({ error: "Gagal setup" }, { status: 500 });
  }
}