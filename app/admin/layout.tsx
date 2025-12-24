'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  LogOut,
  HeartHandshake,
  Users,
  Briefcase,
  Megaphone
} from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // State untuk data user
  const [userRole, setUserRole] = useState('');
  const [userName, setUserName] = useState(''); // <--- State Nama User
  const [userPerms, setUserPerms] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // 1. Cek Siapa yang Login
  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then(data => {
        // Simpan data user ke state
        setUserRole(data.role || '');
        setUserName(data.username || data.name || 'Admin'); // <--- Ambil nama
        setUserPerms(data.permissions || []);
        setLoading(false);
      })
      .catch(() => {
        // Jika gagal auth (sesi habis), redirect ke login
        router.push('/login');
      });
  }, [router]);

  // Helper cek izin
  const hasAccess = (keyword: string) => {
    if (userRole === 'SUPER_ADMIN') return true;
    return userPerms.some(perm => perm.startsWith(keyword));
  };

  // 2. Konfigurasi Menu (Sudah dirapikan path-nya)
  const menuItems = [
    {
      name: 'Dashboard',
      href: '/admin',
      icon: LayoutDashboard,
      show: true
    },
    {
      name: 'Program Donasi',
      href: '/admin/donations-admin', // Path bersih (sesuai folder baru)
      icon: HeartHandshake,
      show: hasAccess('donation')
    },
    {
      name: 'Open Recruitment',
      href: '/admin/open-recruitment-admin', // Path bersih
      icon: Briefcase,
      show: hasAccess('oprec')
    },
    {
      name: 'News & Banner',
      href: '/admin/banners-admin', // Path bersih
      icon: Megaphone,
      show: hasAccess('banner')
    },
    {
      name: 'Kelola User',
      href: '/admin/users-admin', // Path bersih
      icon: Users,
      show: userRole === 'SUPER_ADMIN'
    },
  ];

  const handleLogout = async () => {
    const toastId = toast.loading("Sedang keluar...");

    try {
      // PERBAIKAN: Hapus '/auth' karena folder logout kamu ada di 'api/logout'
      await fetch('/api/logout', { method: 'POST' });

      // Hapus cookie manual di browser (Opsional, tapi bagus untuk memastikan)
      document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
      document.cookie = "session=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";

      toast.success("Sampai jumpa lagi!", { id: toastId });

      // Redirect Paksa
      window.location.href = '/login';

    } catch (error) {
      console.error("Logout error", error);
      // Tetap paksa keluar
      window.location.href = '/login';
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <div className="animate-pulse text-emerald-600 font-bold">Memuat Dashboard...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      <Toaster position="top-right" />

      {/* --- SIDEBAR --- */}
      <aside className="w-64 bg-white border-r shadow-sm hidden md:flex flex-col fixed h-full z-10">
        <div className="p-6 flex items-center gap-2 border-b">
          <HeartHandshake className="text-emerald-600 w-8 h-8" />
          <span className="text-xl font-bold text-gray-800">Ourtala Admin</span>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => (
            item.show && (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${pathname === item.href || pathname.startsWith(item.href + '/')
                    ? 'bg-emerald-50 text-emerald-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
              >
                <item.icon className={`w-5 h-5 ${pathname.startsWith(item.href) ? 'text-emerald-600' : 'text-gray-400'}`} />
                {item.name}
              </Link>
            )
          ))}
        </nav>

        {/* --- INFO USER & LOGOUT --- */}
        <div className="p-4 border-t bg-gray-50">
          <div className="px-2 mb-3">
            <p className="text-xs font-bold text-gray-400 uppercase mb-1">Login Sebagai</p>
            {/* Tampilkan Nama & Role */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-sm">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-gray-800 truncate">{userName}</p>
                <p className="text-xs text-emerald-600 font-medium truncate capitalize">
                  {userRole.replace('_', ' ').toLowerCase()}
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 px-4 py-2 text-red-600 bg-white border border-red-100 hover:bg-red-50 rounded-lg w-full transition-colors text-sm font-medium shadow-sm"
          >
            <LogOut className="w-4 h-4" />
            Keluar Aplikasi
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 md:ml-64 p-8 overflow-y-auto min-h-screen">
        {children}
      </main>
    </div>
  );
}