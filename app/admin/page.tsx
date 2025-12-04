'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Edit, Trash2, TrendingUp, Users, ShieldAlert } from 'lucide-react'; // Tambah icon Shield
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const [donations, setDonations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Identitas User
  const [myRole, setMyRole] = useState('');
  const [myPerms, setMyPerms] = useState<string[]>([]);

  useEffect(() => {
    fetchDonations();
    checkMyIdentity();
  }, []);

  const checkMyIdentity = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (data.role) {
        setMyRole(data.role);
        setMyPerms(data.permissions);
      }
    } catch (e) { console.error("Gagal cek user"); }
  };

  const fetchDonations = async () => {
    try {
      const res = await fetch('/api/donations');
      const data = await res.json();
      setDonations(data);
    } catch (error) { toast.error("Gagal ambil data"); } 
    finally { setLoading(false); }
  };

  // --- INI FUNGSI YANG HILANG DI SCREENSHOT KAMU ---
  const handleDelete = async (id: number) => {
    if (!confirm("Yakin hapus?")) return;
    
    const toastId = toast.loading("Menghapus...");
    try {
      const res = await fetch(`/api/donations/${id}`, { method: 'DELETE' });
      
      // Kalau backend menolak (403 Forbidden)
      if (res.status === 403) {
        throw new Error("Anda tidak punya izin untuk menghapus!");
      }
      
      if (res.ok) {
        toast.success("Berhasil dihapus!", { id: toastId });
        fetchDonations();
      } else {
        throw new Error("Gagal menghapus");
      }
    } catch (error: any) {
      toast.error(error.message, { id: toastId });
    }
  };
  // ------------------------------------------------

  // Helper Izin
  const can = (permission: string) => {
    return myRole === 'SUPER_ADMIN' || myPerms.includes(permission);
  };

  const totalRaised = donations.reduce((acc, curr) => acc + curr.currentAmount, 0);

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="space-y-6">
      
      {/* DEBUG BAR: Biar kamu tahu lagi login sebagai siapa */}
      <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 flex items-center gap-2 text-sm text-blue-800">
        <ShieldAlert className="w-4 h-4" />
        Login sebagai: <strong>{myRole}</strong> | Izin: {myPerms.join(', ') || 'Tidak ada'}
      </div>

      <h1 className="text-2xl font-bold text-gray-800">Overview</h1>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-full">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Terkumpul</p>
            <h3 className="text-2xl font-bold text-gray-800">Rp {totalRaised.toLocaleString('id-ID')}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500">Total Program</p>
            <h3 className="text-2xl font-bold text-gray-800">{donations.length}</h3>
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4">Judul</th>
              <th className="p-4">Target</th>
              <th className="p-4">Terkumpul</th>
              <th className="p-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {donations.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="p-4 font-medium">{item.title}</td>
                <td className="p-4 text-gray-500">Rp {item.targetAmount.toLocaleString()}</td>
                <td className="p-4 text-emerald-600 font-bold">Rp {item.currentAmount.toLocaleString()}</td>
                <td className="p-4 flex justify-end gap-2">
                  
                  {/* Tombol Edit */}
                  {can('update') && (
                    <Link href={`/admin/edit/${item.id}`} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                      <Edit className="w-4 h-4" />
                    </Link>
                  )}

                  {/* Tombol Hapus */}
                  {can('delete') && (
                    <button onClick={() => handleDelete(item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}