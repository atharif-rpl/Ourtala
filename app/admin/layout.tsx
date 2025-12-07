'use client';

import { useEffect, useState } from 'react'; // Tambah state
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, PlusCircle, LogOut, HeartHandshake, Users } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import { Briefcase } from 'lucide-react'; // Tambah icon ini

// ... di dalam menuItems:
const menuItems = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Tambah Donasi', href: '/admin/create', icon: PlusCircle },
  { name: 'Open Recruitment', href: '/admin/recruitment', icon: Briefcase }, // <--- BARU
  { name: 'Kelola User', href: '/admin/users', icon: Users },
];
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [userRole, setUserRole] = useState(''); // Simpan Role User
  const [userPerms, setUserPerms] = useState<string[]>([]); // Simpan Izin

  // 1. Cek Siapa yang Login saat halaman dibuka
  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.role) {
          setUserRole(data.role);
          setUserPerms(data.permissions);
        }
      });
  }, []);

  // 2. Atur Menu Berdasarkan Izin
  const menuItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard, show: true }, // Selalu muncul
    {
      name: 'Tambah Donasi',
      href: '/admin/create',
      icon: PlusCircle,
      show: userPerms.includes('create') || userRole === 'SUPER_ADMIN' // Cek izin 'create'
    },
    {
      name: 'Kelola User',
      href: '/admin/users',
      icon: Users,
      show: userRole === 'SUPER_ADMIN' // Cuma buat Big Boss
    },
    {
      name: 'Open Recruitment',
      href: '/admin/recruitment',
      icon: Briefcase,
      show: userPerms.includes('create') || userRole === 'SUPER_ADMIN'
    },
  ];

  const handleLogout = async () => {
    try {
      await fetch('/api/logout', { method: 'POST' });
      toast.success("Sampai jumpa lagi!");
      router.push('/login');
    } catch (error) {
      toast.error("Gagal logout");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      <Toaster position="top-right" />

      <aside className="w-64 bg-white border-r shadow-sm hidden md:flex flex-col">
        <div className="p-6 flex items-center gap-2 border-b">
          <HeartHandshake className="text-emerald-600 w-8 h-8" />
          <span className="text-xl font-bold text-gray-800">Ourtala Admin</span>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            // HANYA TAMPILKAN JIKA show === true
            item.show && (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${pathname === item.href
                    ? 'bg-emerald-50 text-emerald-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-50'
                  }`}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            )
          ))}
        </nav>

        <div className="p-4 border-t">
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg w-full transition-colors">
            <LogOut className="w-5 h-5" />
            Keluar
          </button>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}