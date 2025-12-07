'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import ImageUpload from '../../components/ImageUpload';
import DynamicList from '../../components/DynamicList';

export default function EditRecruitmentPage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    title: '', division: '', type: 'Internship', imageUrl: '',
    shortDesc: '', fullDescription: '', linkApply: '', isOpen: true,
    requirements: [] as string[], 
    responsibilities: [] as string[], 
    benefits: [] as string[],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/recruitment/${params.id}`);
        const data = await res.json();
        if (data.id) setFormData(data);
      } catch (error) {
        toast.error("Gagal ambil data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const toastId = toast.loading("Menyimpan...");
    try {
      const res = await fetch(`/api/recruitment/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error();
      toast.success("Berhasil diupdate!", { id: toastId });
      router.push('/admin');
    } catch (error) {
      toast.error("Gagal update", { id: toastId });
    }
  };

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto pb-10">
      <Link href="/admin" className="inline-flex items-center text-gray-500 mb-6 hover:text-emerald-600">
        <ArrowLeft className="w-4 h-4 mr-2" /> Kembali ke Dashboard
      </Link>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <h1 className="text-2xl font-bold mb-6">Edit Lowongan</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <label className="text-sm font-medium">Judul</label>
                <input className="w-full p-2 border rounded" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium">Divisi</label>
                <input className="w-full p-2 border rounded" value={formData.division} onChange={e => setFormData({...formData, division: e.target.value})} />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium">Link Gambar</label>
                <ImageUpload value={formData.imageUrl} onChange={url => setFormData({...formData, imageUrl: url})} />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium">Link Apply</label>
                <input className="w-full p-2 border rounded" value={formData.linkApply} onChange={e => setFormData({...formData, linkApply: e.target.value})} />
            </div>
          </div>

          <div className="space-y-2">
             <label className="text-sm font-medium">Status</label>
             <select className="w-full p-2 border rounded" value={formData.isOpen ? "true" : "false"} 
                onChange={e => setFormData({...formData, isOpen: e.target.value === "true"})}>
                <option value="true">OPEN (Dibuka)</option>
                <option value="false">CLOSED (Ditutup)</option>
             </select>
          </div>

          <div className="grid md:grid-cols-3 gap-6 pt-4 border-t">
            <DynamicList label="Requirements" items={formData.requirements} onChange={v => setFormData({...formData, requirements: v})} />
            <DynamicList label="Responsibilities" items={formData.responsibilities} onChange={v => setFormData({...formData, responsibilities: v})} />
            <DynamicList label="Benefits" items={formData.benefits} onChange={v => setFormData({...formData, benefits: v})} />
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white p-3 rounded font-bold hover:bg-blue-700">Simpan Perubahan</button>
        </form>
      </div>
    </div>
  );
}