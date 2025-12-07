import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

async function getParams(params: Promise<{ id: string }>) {
  const resolved = await params;
  return parseInt(resolved.id);
}

// 1. GET: Ambil 1 Lowongan (Untuk Halaman Edit)
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = await getParams(params);
    const data = await prisma.recruitment.findUnique({ where: { id } });
    if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Gagal ambil data' }, { status: 500 });
  }
}

// 2. DELETE: Hapus Lowongan
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = await getParams(params);
    await prisma.recruitment.delete({ where: { id } });
    return NextResponse.json({ message: 'Deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal hapus' }, { status: 500 });
  }
}

// 3. PUT: Update Data Lowongan
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = await getParams(params);
    const body = await req.json();
    
    const updated = await prisma.recruitment.update({
      where: { id },
      data: {
        title: body.title,
        division: body.division,
        type: body.type,
        imageUrl: body.imageUrl,
        shortDesc: body.shortDesc,
        fullDescription: body.fullDescription,
        linkApply: body.linkApply,
        requirements: body.requirements,
        responsibilities: body.responsibilities,
        benefits: body.benefits,
        isOpen: body.isOpen,
      }
    });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Gagal update' }, { status: 500 });
  }
}