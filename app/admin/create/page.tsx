'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import ImageUpload from '../components/ImageUpload'; // Pastikan path-nya benar

export default function CreateDonationPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '', targetAmount: '', location: '', imageUrl: '',
        description: '', longDescription: '', donationLink: '', whatsappLink: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const toastId = toast.loading("Menyimpan data...");

        try {
            const res = await fetch('/api/donations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!res.ok) throw new Error();

            toast.success("Berhasil menambahkan donasi!", { id: toastId });
            router.push('/admin'); // Balik ke dashboard
            router.refresh();
        } catch (error) {
            toast.error("Gagal menyimpan data", { id: toastId });
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: any) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="max-w-4xl mx-auto">
            <Link href="/admin" className="inline-flex items-center text-gray-500 hover:text-gray-800 mb-6">
                <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Dashboard
            </Link>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                <h1 className="text-xl font-bold text-gray-800 mb-6 pb-4 border-b">Tambah Donasi Baru</h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Judul Kegiatan</label>
                            <input required name="title" onChange={handleChange} className="w-full p-2 border rounded-lg" placeholder="Contoh: Bencana Alam" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Target Dana (Rp)</label>
                            <input required name="targetAmount" type="number" onChange={handleChange} className="w-full p-2 border rounded-lg" placeholder="10000000" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Lokasi</label>
                            <input required name="location" onChange={handleChange} className="w-full p-2 border rounded-lg" placeholder="Jakarta" />
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
                            <label className="text-sm font-medium text-gray-700">Link Donasi (Gform/Saweria)</label>
                            <input required name="donationLink" onChange={handleChange} className="w-full p-2 border rounded-lg" placeholder="https://forms.gle/..." />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Deskripsi Singkat</label>
                        <textarea required name="description" rows={2} onChange={handleChange} className="w-full p-2 border rounded-lg" />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Deskripsi Lengkap (Untuk Modal)</label>
                        <textarea required name="longDescription" rows={5} onChange={handleChange} className="w-full p-2 border rounded-lg" />
                    </div>

                    <button disabled={loading} type="submit" className="w-full bg-emerald-600 text-white py-3 rounded-lg font-bold hover:bg-emerald-700 transition">
                        {loading ? 'Menyimpan...' : 'Simpan Donasi'}
                    </button>
                </form>
            </div>
        </div>
    );
}