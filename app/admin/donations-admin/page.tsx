'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { PlusCircle, Pencil, Trash2, Eye } from 'lucide-react';

export default function DonationsPage() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data donasi
  useEffect(() => {
    fetch('/api/donations')
      .then(res => res.json())
      .then(data => {
        setDonations(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8">Memuat data donasi...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Program Donasi</h1>
        <Link 
          href="/admin/donations/create" 
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-emerald-700 transition-colors"
        >
          <PlusCircle className="w-5 h-5" />
          Buat Donasi Baru
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4">Judul Program</th>
              <th className="p-4">Target</th>
              <th className="p-4">Terkumpul</th>
              <th className="p-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {donations.map((item: any) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="p-4 font-medium">{item.title}</td>
                <td className="p-4">Rp {item.targetAmount?.toLocaleString()}</td>
                <td className="p-4 text-emerald-600 font-bold">
                  Rp {item.currentAmount.toLocaleString('id-ID')}
                </td>
                <td className="p-4 text-right flex justify-end gap-2">
                  <Link 
                    href={`/admin/donations/edit/${item.id}`}
                    className="p-2 bg-amber-50 text-amber-600 rounded hover:bg-amber-100"
                    title="Edit"
                  >
                    <Pencil className="w-4 h-4" />
                  </Link>
                  {/* Tambahkan tombol hapus jika perlu */}
                </td>
              </tr>
            ))}
            {donations.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-500">
                  Belum ada program donasi. Silakan buat baru.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}