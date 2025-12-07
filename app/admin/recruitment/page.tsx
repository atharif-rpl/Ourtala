'use client';

import { useState, useEffect } from 'react';
import { Briefcase, Plus, Trash2, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';
import ImageUpload from '../components/ImageUpload'; // Pastikan path benar
import DynamicList from '../components/DynamicList'; // Pastikan path benar

export default function RecruitmentPage() {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // State Form Lengkap
  const [formData, setFormData] = useState({
    title: '',
    division: '',
    type: 'Internship',
    imageUrl: '',
    shortDesc: '',
    fullDescription: '',
    linkApply: '',
    requirements: [''],      // Minimal 1 baris
    responsibilities: [''],
    benefits: [''],
  });

  useEffect(() => { fetchJobs(); }, []);

  const fetchJobs = async () => {
    const res = await fetch('/api/recruitment');
    const data = await res.json();
    setJobs(data);
    setFetching(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading("Mempublish posisi...");

    try {
      // Bersihkan array kosong sebelum kirim
      const cleanData = {
        ...formData,
        requirements: formData.requirements.filter(i => i.trim() !== ''),
        responsibilities: formData.responsibilities.filter(i => i.trim() !== ''),
        benefits: formData.benefits.filter(i => i.trim() !== ''),
      };

      const res = await fetch('/api/recruitment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cleanData),
      });

      if(!res.ok) throw new Error();

      toast.success("Lowongan dibuka!", { id: toastId });
      fetchJobs();
      // Reset Form
      setFormData({
        title: '', division: '', type: 'Internship', imageUrl: '',
        shortDesc: '', fullDescription: '', linkApply: '',
        requirements: [''], responsibilities: [''], benefits: ['']
      });
    } catch (error) {
      toast.error("Gagal menambah data", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if(!confirm("Hapus lowongan ini?")) return;
    await fetch(`/api/recruitment/${id}`, { method: 'DELETE' });
    toast.success("Dihapus");
    fetchJobs();
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-20">
      <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
        <Briefcase className="text-emerald-600" /> Open Recruitment Manager
      </h1>

      {/* FORM INPUT KOMPLEKS */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold mb-6">Buka Posisi Baru</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Baris 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Judul Posisi</label>
              <input required className="w-full p-2 border rounded" placeholder="Social Media Officer"
                value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Divisi</label>
              <input required className="w-full p-2 border rounded" placeholder="Social Media Manager"
                value={formData.division} onChange={e => setFormData({...formData, division: e.target.value})} />
            </div>
          </div>

          {/* Baris 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Tipe</label>
              <select className="w-full p-2 border rounded bg-white"
                value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                <option>Internship</option>
                <option>Volunteer</option>
                <option>Full-time</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Link GForm Apply</label>
              <input required className="w-full p-2 border rounded" placeholder="https://forms.gle/..."
                value={formData.linkApply} onChange={e => setFormData({...formData, linkApply: e.target.value})} />
            </div>
          </div>

          {/* Gambar */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Cover Image</label>
            <ImageUpload 
              value={formData.imageUrl} 
              onChange={(url) => setFormData({ ...formData, imageUrl: url })} 
            />
          </div>

          {/* Deskripsi */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Deskripsi Singkat</label>
            <textarea required rows={2} className="w-full p-2 border rounded" 
              value={formData.shortDesc} onChange={e => setFormData({...formData, shortDesc: e.target.value})} />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Deskripsi Lengkap</label>
            <textarea required rows={4} className="w-full p-2 border rounded" 
              value={formData.fullDescription} onChange={e => setFormData({...formData, fullDescription: e.target.value})} />
          </div>

          {/* LIST DINAMIS (Requirements, dll) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t">
            <DynamicList 
              label="Requirements (Syarat)" 
              placeholder="Contoh: Fluent in English"
              items={formData.requirements}
              onChange={(newItems) => setFormData({...formData, requirements: newItems})}
            />
            <DynamicList 
              label="Responsibilities (Tugas)" 
              placeholder="Contoh: Manage Instagram..."
              items={formData.responsibilities}
              onChange={(newItems) => setFormData({...formData, responsibilities: newItems})}
            />
            <DynamicList 
              label="Benefits (Keuntungan)" 
              placeholder="Contoh: Certificate..."
              items={formData.benefits}
              onChange={(newItems) => setFormData({...formData, benefits: newItems})}
            />
          </div>

          <button disabled={loading} type="submit" className="w-full bg-emerald-600 text-white p-3 rounded font-bold hover:bg-emerald-700 mt-6">
            {loading ? 'Menyimpan...' : 'Publish Posisi'}
          </button>
        </form>
      </div>

      {/* LIST YANG SUDAH DIBUAT */}
      <div className="space-y-4">
        <h3 className="font-bold text-gray-700">Posisi Aktif</h3>
        {jobs.map(job => (
          <div key={job.id} className="bg-white p-5 rounded-xl border shadow-sm flex justify-between items-center">
            <div>
              <h4 className="font-bold text-lg">{job.title}</h4>
              <p className="text-sm text-gray-500">{job.division} • {job.type}</p>
            </div>
            <div className="flex items-center gap-4">
              <a href={job.linkApply} target="_blank" className="text-blue-600 text-sm flex items-center gap-1 hover:underline">
                <ExternalLink className="w-4 h-4" /> Cek Link
              </a>
              <button onClick={() => handleDelete(job.id)} className="text-red-500 hover:bg-red-50 p-2 rounded">
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}