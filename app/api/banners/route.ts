import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: Ambil semua banner (Gak berubah)
export async function GET() {
  try {
    const banners = await prisma.banner.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(banners);
  } catch (error) {
    return NextResponse.json({ error: 'Gagal ambil data' }, { status: 500 });
  }
}

// POST: Upload Banner Baru (DIUPDATE)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // Validasi sederhana
    if (!body.imageUrl || !body.title) {
        return NextResponse.json({ error: 'Gambar dan Judul wajib diisi' }, { status: 400 });
    }

    const newBanner = await prisma.banner.create({
      data: {
        imageUrl: body.imageUrl,
        title: body.title,
        description: body.description || '',
        buttonText: body.buttonText || 'Selengkapnya',
        buttonLink: body.buttonLink || '#',
        isActive: true,
      },
    });
    return NextResponse.json(newBanner, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal simpan banner' }, { status: 500 });
  }
}