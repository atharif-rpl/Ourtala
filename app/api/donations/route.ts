import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// 1. GET: Untuk mengambil semua data donasi (Dipakai di Halaman Depan)
export async function GET() {
  try {
    const donations = await prisma.donation.findMany({
      orderBy: { createdAt: 'desc' }, // Urutkan dari yang terbaru
      where: { isActive: true }       // Hanya ambil yang statusnya aktif
    });
    return NextResponse.json(donations);
  } catch (error) {
    return NextResponse.json({ error: 'Gagal mengambil data' }, { status: 500 });
  }
}

// 2. POST: Untuk menambah donasi baru (Dipakai di Dashboard Admin)
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const newDonation = await prisma.donation.create({
      data: {
        title: body.title,
        description: body.description,
        
        // TAMBAHKAN DUA INI:
        longDescription: body.longDescription, 
        donationLink: body.donationLink,
        
        targetAmount: parseFloat(body.targetAmount),
        location: body.location,
        imageUrl: body.imageUrl,
        whatsappLink: body.whatsappLink,
        currentAmount: 0, // Default 0
      },
    });

    return NextResponse.json(newDonation, { status: 201 });
  } catch (error) {
    console.error("Error creating donation:", error); // Log error biar gampang debug
    return NextResponse.json({ error: 'Gagal membuat donasi' }, { status: 500 });
  }
}