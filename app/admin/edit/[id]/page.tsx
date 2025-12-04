'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation'; // Pakai useParams untuk ambil ID dari URL
import toast from 'react-hot-toast';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ImageUpload from '../../components/ImageUpload'; // Path naik 2 level

export default function EditDonationPage() {
  const router = useRouter();
  const params = useParams(); // Ambil ID dari URL (misal: /admin/edit/5 -> id = 5)
  const id = params.id;

  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '', targetAmount: 0, currentAmount: 0, location: '', imageUrl: '',
    description: '', longDescription: '', donationLink: '', whatsappLink: ''
  });

  // 1. Ambil Data Lama saat halaman dibuka
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/donations/${id}`);
        const data = await res.json();
        if (data) {
          setFormData({
            title: data.title,
            targetAmount: data.targetAmount,
            currentAmount: data.currentAmount, // Kita bisa edit uang terkumpul di sini
            location: data.location || '',
            imageUrl: data.imageUrl || '',
            description: data.description || '',
            longDescription: data.longDescription || '',
            donationLink: data.donationLink || '',
            whatsappLink: data.whatsappLink || ''
          });
        }
      } catch (error) {
        toast.error("Gagal mengambil data lama");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  // 2. Fungsi Simpan Perubahan (Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const toastId = toast.loading("Menyimpan perubahan...");

    try {
      const res = await fetch(`/api/donations/${id}`, {
        method: 'PUT', // Pakai PUT untuk update
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error();

      toast.success("Data berhasil diupdate!", { id: toastId });
      router.push('/admin');
      router.refresh();
    } catch (error) {
      toast.error("Gagal update data", { id: toastId });
    }
  };

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (loading) return <div className="p-10 text-center">Mengambil data...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <Link href="/admin" className="inline-flex items-center text-gray-500 hover:text-gray-800 mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" /> Batal & Kembali
      </Link>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <h1 className="text-xl font-bold text-gray-800 mb-6 pb-4 border-b">Edit Donasi</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Judul Kegiatan</label>
              <input required name="title" value={formData.title} onChange={handleChange} className="w-full p-2 border rounded-lg" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Target Dana</label>
              <input required name="targetAmount" type="number" value={formData.targetAmount} onChange={handleChange} className="w-full p-2 border rounded-lg" />
            </div>

            {/* TAMBAHAN: EDIT UANG TERKUMPUL */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-emerald-700">Uang Terkumpul (Manual Update)</label>
              <input name="currentAmount" type="number" value={formData.currentAmount} onChange={handleChange} className="w-full p-2 border border-emerald-300 bg-emerald-50 rounded-lg" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Lokasi</label>
              <input required name="location" value={formData.location} onChange={handleChange} className="w-full p-2 border rounded-lg" />
            </div>
            {/* GANTI INPUT LAMA DENGAN INI */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Foto Kegiatan</label>
              <ImageUpload
                value={formData.imageUrl}
                onChange={(url) => setFormData({ ...formData, imageUrl: url })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Link Donasi</label>
              <input required name="donationLink" value={formData.donationLink} onChange={handleChange} className="w-full p-2 border rounded-lg" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Deskripsi Singkat</label>
            <textarea required name="description" rows={2} value={formData.description} onChange={handleChange} className="w-full p-2 border rounded-lg" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Deskripsi Lengkap</label>
            <textarea required name="longDescription" rows={5} value={formData.longDescription} onChange={handleChange} className="w-full p-2 border rounded-lg" />
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition">
            Simpan Perubahan
          </button>
        </form>
      </div>
    </div>
  );
}