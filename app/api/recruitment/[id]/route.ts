import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

async function getParams(params: Promise<{ id: string }>) {
  const resolved = await params;
  return parseInt(resolved.id);
}

// DELETE: Hapus Lowongan
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = await getParams(params);
    await prisma.recruitment.delete({ where: { id } });
    return NextResponse.json({ message: 'Deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal hapus' }, { status: 500 });
  }
}

// PUT: Update Data (Misal: Tutup/Buka Lowongan)
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = await getParams(params);
    const body = await req.json();
    const updated = await prisma.recruitment.update({
      where: { id },
      data: body, // Bisa update title, description, atau isOpen
    });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: 'Gagal update' }, { status: 500 });
  }
}