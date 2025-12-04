import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("❌ DATABASE_URL tidak ditemukan! Tambahkan di .env");
}

// Buat pool PostgreSQL
const pool = new pg.Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false, // Supabase BUTUH ini
  },
});

// Buat adapter Prisma v7
const adapter = new PrismaPg(pool);

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Jangan pakai `datasources` lagi di Prisma v7
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter, // <--- WAJIB Prisma v7
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
