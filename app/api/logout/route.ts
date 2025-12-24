import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();
  
  // Hapus semua kemungkinan nama cookie (sesuaikan dengan login kamu)
  cookieStore.delete('token'); 
  cookieStore.delete('session');

  return NextResponse.json({ message: "Berhasil logout" });
}