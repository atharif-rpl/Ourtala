import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ message: "Berhasil logout" });

  // Hapus cookie 'token' dengan cara mengeset umurnya jadi 0 detik
  response.cookies.set('token', '', {
    httpOnly: true,
    expires: new Date(0), // Tanggal kadaluarsa di masa lalu
    path: '/',
  });

  return response;
}