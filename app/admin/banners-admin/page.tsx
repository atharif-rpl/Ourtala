'use client';

import { useState, useEffect } from 'react';
import { Image as ImageIcon, Trash2, Plus, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import ImageUpload from '../components/ImageUpload';
import Image from 'next/image';

export default function BannerPage() {
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // State untuk Form (Gabung jadi satu objek biar rapi)
  const [formData, setFormData] = useState({
    imageUrl: '',
    title: '',
    description: '',
    buttonText: 'Join Team',
    buttonLink: '/recruitment',
  });

  useEffect(() => { fetchBanners(); }, []);

  const fetchBanners = async () => {
    const res = await fetch('/api/banners');
    const data = await res.json();
    setBanners(data);
    setLoading(false);
  };

  const handleAdd = async () => {
    if (!formData.imageUrl || !formData.title) return toast.error("Gambar dan Judul wajib diisi!");
    
    const toastId = toast.loading("Menyimpan...");
    try {
      const res = await fetch('/api/banners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if(!res.ok) throw new Error();

      toast.success("Banner berhasil dibuat!", { id: toastId });
      // Reset Form
      setFormData({ imageUrl: '', title: '', description: '', buttonText: 'Join Team', buttonLink: '/recruitment' });
      fetchBanners();
    } catch (e) {
      toast.error("Gagal menyimpan", { id: toastId });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Hapus banner ini?")) return;
    await fetch(`/api/banners/${id}`, { method: 'DELETE' });
    toast.success("Dihapus");
    fetchBanners();
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-10">
      <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
        <ImageIcon className="text-emerald-600" /> Kelola Hero Banner
      </h1>

      <div className="grid md:grid-cols-5 gap-8">
        {/* --- FORM INPUT (Kiri, 2 Kolom) --- */}
        <div className="md:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit sticky top-4">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><Plus className="w-5 h-5" /> Buat Banner Baru</h2>
          <div className="space-y-4">
            
            {/* Upload Gambar */}
            <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Background Gambar (Wajib)</label>
                <ImageUpload value={formData.imageUrl} onChange={(url) => setFormData({...formData, imageUrl: url})} />
            </div>

            {/* Judul */}
            <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Judul Besar (Wajib)</label>
                <input type="text" className="w-full p-2 border rounded-md" placeholder="Contoh: Open Recruitment" 
                    value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            </div>

            {/* Deskripsi */}
            <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Deskripsi (Opsional)</label>
                <textarea className="w-full p-2 border rounded-md h-20" placeholder="Teks pendek di bawah judul..." 
                    value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
            </div>

            {/* Tombol */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Teks Tombol</label>
                    <input type="text" className="w-full p-2 border rounded-md" 
                        value={formData.buttonText} onChange={e => setFormData({...formData, buttonText: e.target.value})} />
                </div>
                <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Link Tombol</label>
                    <input type="text" className="w-full p-2 border rounded-md" placeholder="/about atau https://..."
                        value={formData.buttonLink} onChange={e => setFormData({...formData, buttonLink: e.target.value})} />
                </div>
            </div>

            <button onClick={handleAdd} disabled={!formData.imageUrl || !formData.title}
              className="w-full flex justify-center items-center gap-2 bg-emerald-600 text-white px-5 py-3 rounded-lg font-bold hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors">
              <Save className="w-5 h-5" /> Publish Banner
            </button>
          </div>
        </div>

        {/* --- PREVIEW LIST (Kanan, 3 Kolom) --- */}
        <div className="md:col-span-3 space-y-4">
            <h2 className="text-lg font-bold">Daftar Banner Aktif ({banners.length})</h2>
            {banners.map((banner) => (
            <div key={banner.id} className="group relative bg-white rounded-xl overflow-hidden border shadow-sm flex">
                {/* Preview Gambar Kecil */}
                <div className="relative w-1/3 h-32 shrink-0">
                    <Image src={banner.imageUrl} alt={banner.title} fill className="object-cover" />
                </div>
                {/* Preview Teks */}
                <div className="p-4 flex-1 flex flex-col justify-center">
                    <h3 className="font-bold text-gray-900 line-clamp-1">{banner.title}</h3>
                    {banner.description && <p className="text-sm text-gray-500 line-clamp-2 mt-1">{banner.description}</p>}
                    <div className="mt-2 flex items-center gap-2 text-xs font-medium text-emerald-600">
                        <span className="border border-emerald-200 bg-emerald-50 px-2 py-0.5 rounded">Tombol: {banner.buttonText}</span>
                        <span className="text-gray-400">→ {banner.buttonLink}</span>
                    </div>
                </div>
                {/* Tombol Hapus */}
                <button onClick={() => handleDelete(banner.id)}
                    className="absolute top-2 right-2 bg-white text-red-500 p-2 rounded-full shadow hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
            ))}
            {banners.length === 0 && !loading && (
                <div className="text-center p-10 border-2 border-dashed rounded-xl text-gray-400">Belum ada banner yang diupload.</div>
            )}
        </div>
      </div>
    </div>
  );
}