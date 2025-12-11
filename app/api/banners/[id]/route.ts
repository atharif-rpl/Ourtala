import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

async function getParams(params: Promise<{ id: string }>) {
  const resolved = await params;
  return parseInt(resolved.id);
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const id = await getParams(params);
    await prisma.banner.delete({ where: { id } });
    return NextResponse.json({ message: 'Deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal hapus' }, { status: 500 });
  }
}