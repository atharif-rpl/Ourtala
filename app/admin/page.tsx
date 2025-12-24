'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Edit, Trash2, TrendingUp, Users, ShieldAlert, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DashboardPage() {
  const [donations, setDonations] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Identitas User
  const [myRole, setMyRole] = useState('');
  const [myPerms, setMyPerms] = useState<string[]>([]);
  // Tambah State Username biar lengkap
  const [myUsername, setMyUsername] = useState('');

  useEffect(() => {
    fetchAllData();
    checkMyIdentity();
  }, []);

  const fetchAllData = async () => {
    try {
      const resDonasi = await fetch('/api/donations');
      const dataDonasi = await resDonasi.json();
      setDonations(dataDonasi);

      const resJobs = await fetch('/api/recruitment');
      const dataJobs = await resJobs.json();
      setJobs(dataJobs);

    } catch (error) { toast.error("Gagal ambil data"); }
    finally { setLoading(false); }
  };

  const checkMyIdentity = async () => {
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (data.role) {
        setMyRole(data.role);
        setMyPerms(data.permissions || []);
        setMyUsername(data.username || 'Admin');
      }
    } catch (e) { console.error("Gagal cek user"); }
  };

  // --- PERBAIKAN LOGIC IZIN (PENTING!) ---
  // Fungsi ini mengecek apakah user punya izin spesifik (contoh: 'donation:update')
  const can = (specificPermission: string) => {
    if (myRole === 'SUPER_ADMIN') return true;
    return myPerms.includes(specificPermission);
  };

  const handleDeleteDonation = async (id: number) => {
    if (!confirm("Hapus donasi ini?")) return;
    const toastId = toast.loading("Menghapus...");
    try {
      const res = await fetch(`/api/donations/${id}`, { method: 'DELETE' });
      if (res.status === 403) throw new Error("Izin ditolak!");
      if (res.ok) { toast.success("Terhapus", { id: toastId }); fetchAllData(); }
    } catch (e: any) { toast.error(e.message, { id: toastId }); }
  };

  const handleDeleteJob = async (id: number) => {
    if (!confirm("Hapus lowongan ini?")) return;
    const toastId = toast.loading("Menghapus...");
    try {
      const res = await fetch(`/api/recruitment/${id}`, { method: 'DELETE' });
      if (res.ok) { toast.success("Terhapus", { id: toastId }); fetchAllData(); }
    } catch (e) { toast.error("Gagal hapus", { id: toastId }); }
  };

  const totalRaised = donations.reduce((acc, curr) => acc + curr.currentAmount || 0, 0);

  if (loading) return <div className="p-10 text-center">Loading Dashboard...</div>;

  return (
    <div className="space-y-8">

      {/* Debug Info (Opsional, boleh dihapus kalau ganggu) */}
      <div className="bg-blue-50 p-3 rounded-lg border border-blue-200 flex items-center gap-2 text-sm text-blue-800">
        <ShieldAlert className="w-4 h-4" />
        Halo, <strong>{myUsername}</strong> ({myRole})
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-full"><TrendingUp className="w-6 h-6" /></div>
          <div><p className="text-sm text-gray-500">Total Donasi</p><h3 className="text-xl font-bold">Rp {totalRaised.toLocaleString('id-ID')}</h3></div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-full"><Users className="w-6 h-6" /></div>
          <div><p className="text-sm text-gray-500">Program Donasi</p><h3 className="text-xl font-bold">{donations.length}</h3></div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="p-3 bg-purple-100 text-purple-600 rounded-full"><Briefcase className="w-6 h-6" /></div>
          <div><p className="text-sm text-gray-500">Lowongan Aktif</p><h3 className="text-xl font-bold">{jobs.filter((j: any) => j.isOpen).length}</h3></div>
        </div>
      </div>

      {/* TABEL DONASI */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b bg-gray-50"><h3 className="font-bold text-gray-700">📋 Daftar Program Donasi</h3></div>
        <table className="w-full text-left text-sm">
          <thead className="bg-white border-b">
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
                <td className="p-4 text-gray-500">Rp {item.targetAmount?.toLocaleString('id-ID')}</td>
                <td className="p-4 text-emerald-600 font-bold">
                  Rp {item.currentAmount?.toLocaleString('id-ID') || 0}
                </td>

                <td className="p-4 flex justify-end gap-2">
                  {/* --- EDIT BAGIAN INI --- */}
                  {/* Cek izin 'donation:update' (bukan cuma 'update') */}
                  {can('donation:update') && (
                    <Link href={`/admin/donations-admin/edit/${item.id}`} className="p-2 text-blue-600 bg-blue-50 rounded hover:bg-blue-100">
                      <Edit className="w-4 h-4" />
                    </Link>
                  )}
                  {/* Cek izin 'donation:delete' */}
                  {can('donation:delete') && (
                    <button onClick={() => handleDeleteDonation(item.id)} className="p-2 text-red-600 bg-red-50 rounded hover:bg-red-100">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* TABEL REKRUTMEN */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b bg-gray-50 flex justify-between items-center">
          <h3 className="font-bold text-gray-700">💼 Daftar Open Recruitment</h3>

          {/* Logic Tombol 'Kelola Detail' */}
          {(myRole === 'SUPER_ADMIN' || myPerms.includes('oprec:create') || myPerms.includes('oprec:update')) && (
            <Link href="/admin/open-recruitment-admin" className="text-xs bg-emerald-600 text-white px-3 py-1 rounded hover:bg-emerald-700">
              Kelola Detail
            </Link>
          )}
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-white border-b">
            <tr><th className="p-4">Posisi</th><th className="p-4">Status</th><th className="p-4 text-right">Aksi</th></tr>
          </thead>
          <tbody className="divide-y">
            {jobs.map((job) => (
              <tr key={job.id} className="hover:bg-gray-50">
                <td className="p-4">
                  <div className="font-medium">{job.title}</div>
                  <div className="text-xs text-gray-500">{job.division}</div>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${job.isOpen ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-600'}`}>
                    {job.isOpen ? 'OPEN' : 'CLOSED'}
                  </span>
                </td>
                <td className="p-4 flex justify-end gap-2">
                  {/* --- EDIT BAGIAN INI JUGA --- */}
                  {/* Gunakan 'oprec:update' */}
                  {can('oprec:update') && (
                    <Link
                      // URL ini sudah cocok dengan nama folder 'open-recruitment-admin'
                      href={`/admin/open-recruitment-admin/edit/${job.id}`}
                      className="p-2 text-blue-600 bg-blue-50 rounded hover:bg-blue-100"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                  )}

                  {can('oprec:delete') && (
                    <button
                      onClick={() => handleDeleteJob(job.id)}
                      className="p-2 text-red-600 bg-red-50 rounded hover:bg-red-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {jobs.length === 0 && <tr><td colSpan={3} className="p-4 text-center text-gray-400">Belum ada lowongan</td></tr>}
          </tbody>
        </table>
      </div>

    </div>
  );
}