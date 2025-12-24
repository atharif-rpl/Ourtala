'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { UserPlus, Shield, Trash2, Pencil, X, Save } from 'lucide-react';

// --- KONFIGURASI GRUP IZIN ---
// Kita kelompokkan izin biar rapi di UI
const PERMISSION_GROUPS = [
  {
    title: "Fitur Donasi",
    key: "donation", // prefix untuk database (misal: donation:create)
    color: "bg-blue-50 border-blue-100",
    text: "text-blue-700"
  },
  {
    title: "Open Recruitment (Oprec)",
    key: "oprec",
    color: "bg-purple-50 border-purple-100",
    text: "text-purple-700"
  },
  {
    title: "News & Banner",
    key: "banner",
    color: "bg-emerald-50 border-emerald-100",
    text: "text-emerald-700"
  }
];

// Daftar aksi standar (CRUD)
const ACTIONS = [
  { id: 'create', label: 'Buat' },
  { id: 'read', label: 'Lihat' },
  { id: 'update', label: 'Edit' },
  { id: 'delete', label: 'Hapus' },
];

export default function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State untuk Mode Edit
  const [editingUserId, setEditingUserId] = useState<number | null>(null);

  // State Form
  const [formData, setFormData] = useState({
    username: '',
    password: '', // Kosongkan jika tidak ingin ubah password saat edit
    role: 'STAFF',
    permissions: [] as string[] 
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

  // 2. Handle Checkbox Izin (Logic Baru dengan Prefix)
  const handlePermissionChange = (prefix: string, action: string) => {
    const permString = `${prefix}:${action}`; // Contoh: donation:create
    
    setFormData(prev => {
      const exists = prev.permissions.includes(permString);
      if (exists) {
        return { ...prev, permissions: prev.permissions.filter(p => p !== permString) };
      } else {
        return { ...prev, permissions: [...prev.permissions, permString] };
      }
    });
  };

  // 3. Masuk Mode Edit
  const handleEditClick = (user: any) => {
    setEditingUserId(user.id);
    setFormData({
      username: user.username,
      password: '', // Reset password field (user isi cuma kalau mau ganti)
      role: user.role,
      permissions: user.permissions || []
    });
    // Scroll ke atas agar form terlihat
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 4. Batal Edit
  const handleCancelEdit = () => {
    setEditingUserId(null);
    setFormData({ username: '', password: '', role: 'STAFF', permissions: [] });
  };

  // 5. Submit Form (Bisa Create atau Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi Sederhana
    if (!formData.username) return toast.error("Username wajib diisi");
    // Kalau mode create, password wajib. Kalau edit, boleh kosong.
    if (!editingUserId && !formData.password) return toast.error("Password wajib diisi untuk user baru");

    const isEditMode = !!editingUserId;
    const toastId = toast.loading(isEditMode ? "Menyimpan perubahan..." : "Membuat user...");

    try {
      // Tentukan URL dan Method berdasarkan mode
      const url = isEditMode ? `/api/users` : `/api/users`; 
      // CATATAN: Biasanya update pake PUT /api/users/[id], tapi biar gampang kita pakai POST ke /api/users 
      // lalu handle logic update di backend, ATAU kamu harus buat route PUT.
      // Di sini saya asumsikan kita kirim method PUT dengan body ID.
      
      const method = isEditMode ? 'PUT' : 'POST';
      
      const payload = isEditMode ? { ...formData, id: editingUserId } : formData;

      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Terjadi kesalahan");

      toast.success(isEditMode ? "User diperbarui!" : "User berhasil dibuat!", { id: toastId });
      handleCancelEdit(); // Reset form & mode
      fetchUsers(); // Refresh tabel
    } catch (err: any) {
      toast.error(err.message, { id: toastId });
    }
  };

  // 6. Hapus User
  const handleDelete = async (id: number) => {
    if (!confirm("Yakin ingin menghapus user ini? Aksi tidak bisa dibatalkan.")) return;

    const toastId = toast.loading("Menghapus...");
    try {
      const res = await fetch(`/api/users?id=${id}`, { method: 'DELETE' }); // Mengirim ID lewat Query params atau Dynamic Route
      if (!res.ok) throw new Error("Gagal hapus");
      
      toast.success("User dihapus", { id: toastId });
      fetchUsers();
    } catch (err) {
      toast.error("Gagal menghapus user", { id: toastId });
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-20">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Manajemen User & Hak Akses</h1>
      </div>

      {/* --- FORM INPUT (CREATE / EDIT) --- */}
      <div className={`p-6 rounded-xl shadow-sm border transition-colors ${editingUserId ? 'bg-amber-50 border-amber-200' : 'bg-white border-gray-100'}`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            {editingUserId ? (
              <>
                <Pencil className="w-5 h-5 text-amber-600" /> 
                <span className="text-amber-800">Edit User</span>
              </>
            ) : (
              <>
                <UserPlus className="w-5 h-5 text-emerald-600" />
                <span>Buat User Baru</span>
              </>
            )}
          </h2>
          {editingUserId && (
            <button onClick={handleCancelEdit} className="text-sm text-gray-500 hover:text-red-500 flex items-center gap-1">
              <X className="w-4 h-4" /> Batal Edit
            </button>
          )}
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Input Username & Password */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Username</label>
              <input 
                type="text" 
                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" 
                placeholder="Contoh: staff_banner"
                value={formData.username}
                onChange={e => setFormData({...formData, username: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Password {editingUserId && <span className="font-normal text-gray-500">(Kosongkan jika tidak diganti)</span>}
              </label>
              <input 
                type="text" 
                className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" 
                placeholder={editingUserId ? "Ketikan password baru..." : "Password awal user..."}
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
              />
            </div>
          </div>

          {/* Input Izin (Grouping) */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">Atur Izin Akses (Checklist)</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {PERMISSION_GROUPS.map((group) => (
                <div key={group.key} className={`p-4 rounded-lg border ${group.color}`}>
                  <h3 className={`font-bold mb-3 ${group.text} border-b border-black/5 pb-2`}>{group.title}</h3>
                  <div className="space-y-2">
                    {ACTIONS.map((action) => {
                      const permissionString = `${group.key}:${action.id}`;
                      const isChecked = formData.permissions.includes(permissionString);
                      return (
                        <label key={permissionString} className="flex items-center gap-3 cursor-pointer hover:bg-white/50 p-1 rounded transition-colors">
                          <input 
                            type="checkbox" 
                            className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                            checked={isChecked}
                            onChange={() => handlePermissionChange(group.key, action.id)}
                          />
                          <span className="text-sm text-gray-700">
                            {action.label} {group.title.split(' ')[0]} {/* Contoh: Edit Donasi */}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tombol Simpan */}
          <div className="flex justify-end pt-2">
            <button className={`flex items-center gap-2 text-white px-8 py-2.5 rounded-lg font-bold shadow-sm transition-transform hover:scale-105 ${editingUserId ? 'bg-amber-600 hover:bg-amber-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}>
              <Save className="w-5 h-5" />
              {editingUserId ? 'Simpan Perubahan' : 'Buat User Sekarang'}
            </button>
          </div>
        </form>
      </div>

      {/* --- TABEL USER --- */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 bg-gray-50 border-b border-gray-100">
          <h3 className="font-bold text-gray-700">Daftar User ({users.length})</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-white border-b text-gray-500">
              <tr>
                <th className="p-4 font-medium">User Info</th>
                <th className="p-4 font-medium">Akses Fitur</th>
                <th className="p-4 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4 align-top">
                    <div className="font-bold text-gray-900 text-base">{user.username}</div>
                    <div className={`mt-1 inline-block px-2 py-0.5 rounded text-xs font-bold ${user.role === 'SUPER_ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                      {user.role}
                    </div>
                    <div className="text-xs text-gray-400 mt-2">Dibuat: {new Date(user.createdAt).toLocaleDateString()}</div>
                  </td>
                  
                  <td className="p-4 align-top">
                    {/* Render Permission Chips */}
                    <div className="flex flex-wrap gap-2 max-w-md">
                      {user.permissions && user.permissions.length > 0 ? (
                        user.permissions.map((p: string) => {
                          const [feature, action] = p.split(':'); // Pisahkan donation:create jadi [donation, create]
                          // Mapping warna chip biar cantik
                          let colorClass = "bg-gray-100 text-gray-600 border-gray-200";
                          if (feature === 'donation') colorClass = "bg-blue-50 text-blue-700 border-blue-100";
                          if (feature === 'oprec') colorClass = "bg-purple-50 text-purple-700 border-purple-100";
                          if (feature === 'banner') colorClass = "bg-emerald-50 text-emerald-700 border-emerald-100";

                          return (
                            <span key={p} className={`px-2 py-1 text-xs rounded border ${colorClass} capitalize`}>
                              {action} {feature}
                            </span>
                          )
                        })
                      ) : (
                        <span className="text-gray-400 italic">Tidak ada izin khusus</span>
                      )}
                    </div>
                  </td>

                  <td className="p-4 align-top text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleEditClick(user)}
                        className="p-2 text-amber-600 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors"
                        title="Edit User"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      
                      {/* Jangan biarkan hapus diri sendiri atau Super Admin utama (opsional logic) */}
                      <button 
                        onClick={() => handleDelete(user.id)}
                        className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                        title="Hapus User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}