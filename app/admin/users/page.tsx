'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { UserPlus, Shield, Trash2 } from 'lucide-react';

// Daftar Izin yang tersedia (Bisa kamu tambah nanti)
const ALL_PERMISSIONS = [
  { id: 'create', label: 'Membuat Donasi' },
  { id: 'read', label: 'Melihat Data' },
  { id: 'update', label: 'Mengedit Donasi' },
  { id: 'delete', label: 'Menghapus Donasi' },
];

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State Form
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'STAFF',
    permissions: [] as string[] // Menyimpan ID izin yang dipilih
  });

  // 1. Ambil Data User
  const fetchUsers = async () => {
    try {
      const res = await fetch('/api/users');
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      toast.error("Gagal memuat user");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  // 2. Handle Checkbox Izin
  const handlePermissionChange = (permId: string) => {
    setFormData(prev => {
      const exists = prev.permissions.includes(permId);
      if (exists) {
        // Kalau sudah ada, hapus (Uncheck)
        return { ...prev, permissions: prev.permissions.filter(p => p !== permId) };
      } else {
        // Kalau belum ada, tambah (Check)
        return { ...prev, permissions: [...prev.permissions, permId] };
      }
    });
  };

  // 3. Submit Form Buat User
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      toast.error("Username & Password wajib diisi");
      return;
    }

    const toastId = toast.loading("Membuat user...");
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      toast.success("User berhasil dibuat!", { id: toastId });
      setFormData({ username: '', password: '', role: 'STAFF', permissions: [] }); // Reset form
      fetchUsers(); // Refresh tabel
    } catch (err: any) {
      toast.error(err.message, { id: toastId });
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-800">Manajemen User & Izin</h1>

      {/* --- FORM TAMBAH USER --- */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <UserPlus className="w-5 h-5 text-emerald-600" />
          Buat User Baru
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Username</label>
              <input 
                type="text" 
                className="w-full p-2 border rounded-lg" 
                placeholder="Contoh: amanda"
                value={formData.username}
                onChange={e => setFormData({...formData, username: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <input 
                type="text" 
                className="w-full p-2 border rounded-lg" 
                placeholder="Password awal..."
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Pilih Izin Akses (Permissions)</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {ALL_PERMISSIONS.map((perm) => (
                <label key={perm.id} className="flex items-center gap-2 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input 
                    type="checkbox" 
                    className="w-4 h-4 text-emerald-600 rounded"
                    checked={formData.permissions.includes(perm.id)}
                    onChange={() => handlePermissionChange(perm.id)}
                  />
                  <span className="text-sm text-gray-700">{perm.label}</span>
                </label>
              ))}
            </div>
          </div>

          <button className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-emerald-700">
            Simpan User
          </button>
        </form>
      </div>

      {/* --- TABEL LIST USER --- */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4">Username</th>
              <th className="p-4">Role</th>
              <th className="p-4">Izin Akses</th>
              <th className="p-4">Tanggal Dibuat</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {users.map(user => (
              <tr key={user.id}>
                <td className="p-4 font-medium">{user.username}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${user.role === 'SUPER_ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                    {user.role}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex flex-wrap gap-1">
                    {user.permissions.map((p: string) => (
                      <span key={p} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded border">
                        {p}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="p-4 text-gray-500">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}