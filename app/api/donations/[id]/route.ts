import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

// --- HELPER DENGAN DEBUG LOG ---
async function checkPermission(permission: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    console.log("❌ DEBUG: Tidak ada token (Belum Login)");
    return false;
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    
    const role = payload.role as string;
    const perms = (payload.permissions as string[]) || []; 

    console.log(`🔍 DEBUG USER: ${payload.username || 'Unknown'} | Role: ${role}`);
    console.log(`🎯 Butuh Izin: ${permission}`);

    // 1. Super Admin Bebas
    if (role === 'SUPER_ADMIN') return true;

    // 2. Punya Izin Spesifik
    if (perms.includes(permission)) return true;
    
    console.log("⛔ Ditolak: Tidak punya izin yang sesuai");
    return false;

  } catch (error) {
    console.error("💥 Error Token:", error);
    return false;
  }
}

// Helper params Next.js 15
async function getParams(params: Promise<{ id: string }>) {
  const resolved = await params;
  return parseInt(resolved.id);
}

// GET (Ambil 1 data)
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = await getParams(params);
    const data = await prisma.donation.findUnique({ where: { id } });
    
    if (!data) return NextResponse.json({ error: "Data tidak ditemukan" }, { status: 404 });
    
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Gagal ambil data' }, { status: 500 });
  }
}

// PUT (Edit)
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  // Cek izin update
  const isAllowed = await checkPermission('update');
  if (!isAllowed) {
    return NextResponse.json({ error: "Dilarang! Izin tidak cukup." }, { status: 403 });
  }

  try {
    const id = await getParams(params);
    const body = await req.json();
    
    const updated = await prisma.donation.update({
      where: { id },
      data: {
        title: body.title,
        description: body.description,
        longDescription: body.longDescription,
        targetAmount: parseFloat(body.targetAmount),
        // Fix biar gak NaN kalau kosong
        currentAmount: body.currentAmount ? parseFloat(body.currentAmount) : 0,
        location: body.location,
        imageUrl: body.imageUrl,
        donationLink: body.donationLink,
      }
    });
    return NextResponse.json(updated);
  } catch (error) {
    console.error("Update Error:", error);
    return NextResponse.json({ error: 'Gagal update' }, { status: 500 });
  }
}

// DELETE (Hapus)
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  // Cek izin delete
  const isAllowed = await checkPermission('delete');
  if (!isAllowed) {
    return NextResponse.json({ error: "Dilarang! Izin tidak cukup." }, { status: 403 });
  }

  try {
    const id = await getParams(params);
    await prisma.donation.delete({ where: { id } });
    return NextResponse.json({ message: 'Deleted' });
  } catch (error) {
    console.error("Delete Error:", error);
    return NextResponse.json({ error: 'Gagal hapus' }, { status: 500 });
  }
}