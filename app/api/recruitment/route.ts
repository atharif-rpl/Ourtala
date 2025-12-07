import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const data = await prisma.recruitment.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Gagal ambil data' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    const newData = await prisma.recruitment.create({
      data: {
        title: body.title,
        division: body.division,
        type: body.type,
        imageUrl: body.imageUrl,
        shortDesc: body.shortDesc,
        fullDescription: body.fullDescription,
        linkApply: body.linkApply,
        
        // Simpan sebagai Array
        requirements: body.requirements, 
        responsibilities: body.responsibilities,
        benefits: body.benefits,
        
        isOpen: true,
      },
    });
    return NextResponse.json(newData, { status: 201 });
  } catch (error) {
    console.error("Error creating job:", error);
    return NextResponse.json({ error: 'Gagal tambah data' }, { status: 500 });
  }
}