'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase'; // Pastikan path ini benar
import { Upload, X } from 'lucide-react';
import Image from 'next/image';
import toast from 'react-hot-toast';

interface Props {
  value: string; // Link gambar yang sudah ada (kalau edit)
  onChange: (url: string) => void; // Fungsi buat ngirim link ke Form
}

export default function ImageUpload({ value, onChange }: Props) {
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;

      setLoading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`; // Nama file unik
      const filePath = `${fileName}`;

      // 1. Upload ke Supabase
      const { error: uploadError } = await supabase.storage
        .from('donations') // Nama bucket tadi
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // 2. Ambil Link Public
      const { data } = supabase.storage
        .from('donations')
        .getPublicUrl(filePath);

      // 3. Kirim Link ke Form
      onChange(data.publicUrl);
      toast.success("Gambar berhasil diupload!");

    } catch (error) {
      console.error(error);
      toast.error("Gagal upload gambar");
    } finally {
      setLoading(false);
    }
  };

  // Fungsi Hapus Gambar (Reset)
  const handleRemove = () => {
    onChange('');
  };

  return (
    <div className="space-y-4 w-full">
      
      {/* AREA PREVIEW GAMBAR */}
      {value ? (
        <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-300">
          <Image src={value} alt="Upload" fill className="object-cover" />
          <button
            onClick={handleRemove}
            type="button"
            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        // AREA TOMBOL UPLOAD
        <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition bg-white">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            {loading ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600 mb-2"></div>
            ) : (
              <Upload className="w-8 h-8 text-gray-400 mb-2" />
            )}
            <p className="text-sm text-gray-500">
              {loading ? "Sedang mengupload..." : "Klik untuk upload gambar"}
            </p>
          </div>
          <input 
            type="file" 
            accept="image/*" 
            className="hidden" 
            onChange={handleUpload}
            disabled={loading}
          />
        </label>
      )}
    </div>
  );
}