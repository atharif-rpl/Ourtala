import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const path = request.nextUrl.pathname;

  // 1. Kalau user mau masuk halaman Admin
  if (path.startsWith('/admin')) {
    
    // Kalau tidak ada token, tendang ke login
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      // Verifikasi token (Apakah palsu atau asli?)
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      await jwtVerify(token, secret);
      
      // Kalau asli, silakan lewat
      return NextResponse.next();
      
    } catch (error) {
      // Kalau token palsu/expired, tendang ke login
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // 2. Kalau user sudah login tapi mau buka halaman login lagi -> Lempar ke admin
  if (path === '/login' && token) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

// Tentukan rute mana saja yang dijaga middleware
export const config = {
  matcher: ['/admin/:path*', '/login'],
};