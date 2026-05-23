'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { isAuthenticated, clearAuth, getUser } from '@/lib/api';
import Link from 'next/link';
import Logo from '@/components/Logo';

const navItems = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: '📊' },
  { label: 'Appointments', href: '/admin/appointments', icon: '📅' },
  { label: 'Reviews', href: '/admin/reviews', icon: '⭐' },
  { label: 'FAQs', href: '/admin/faqs', icon: '❓' },
  { label: 'Settings', href: '/admin/settings', icon: '⚙️' },
];

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); if (pathname !== '/admin/login' && !isAuthenticated()) router.push('/admin/login'); }, [pathname, router]);
  if (!mounted) return null;
  if (pathname === '/admin/login') return <>{children}</>;
  const user = getUser();

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F4F7F9' }}>
      <aside style={{ width: 280, background: 'var(--primary)', color: 'white', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 100, transform: sidebarOpen ? 'translateX(0)' : undefined, boxShadow: '4px 0 20px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.15)' }}>
          <Logo darkBackground={true} />
        </div>
        <nav style={{ flex: 1, padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: 6 }}>
          {navItems.map(item => (
            <Link key={item.href} href={item.href} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0.8rem 1.2rem', borderRadius: 8, color: pathname === item.href ? 'white' : 'rgba(255,255,255,0.75)', background: pathname === item.href ? 'rgba(255,255,255,0.15)' : 'transparent', textDecoration: 'none', fontSize: '0.95rem', fontWeight: pathname === item.href ? 600 : 500, transition: 'all 0.2s ease' }} onClick={() => setSidebarOpen(false)}>
              <span style={{ fontSize: '1.1rem', opacity: pathname === item.href ? 1 : 0.8 }}>{item.icon}</span>{item.label}
            </Link>
          ))}
        </nav>
        <div style={{ padding: '1.5rem 1rem', borderTop: '1px solid rgba(255,255,255,0.15)' }}>
          <button onClick={() => { clearAuth(); router.push('/admin/login'); }} style={{ width: '100%', padding: '0.8rem 1.2rem', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: 8, color: 'white', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500, textAlign: 'left', transition: 'all 0.2s ease' }}>🚪 Logout</button>
        </div>
      </aside>
      {sidebarOpen && <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 99, backdropFilter: 'blur(4px)' }} onClick={() => setSidebarOpen(false)} />}
      <div style={{ flex: 1, marginLeft: 260, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 2.5rem', background: 'white', borderBottom: '1px solid #E9ECEF', position: 'sticky', top: 0, zIndex: 50, boxShadow: '0 2px 10px rgba(0,0,0,0.02)' }}>
          <h2 style={{ fontFamily: "var(--font-heading)", fontSize: '1.5rem', fontWeight: 700, color: '#2C3E50', margin: 0 }}>{navItems.find(n => n.href === pathname)?.label || 'Admin'}</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#495057' }}>{user?.name || 'Admin'}</span>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #005A9C, #4A90E2)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1rem', boxShadow: '0 4px 10px rgba(0,90,156,0.2)' }}>{(user?.name || 'A').charAt(0)}</div>
          </div>
        </header>
        <main style={{ flex: 1, padding: '2.5rem', maxWidth: 1400, margin: '0 auto', width: '100%' }}>{children}</main>
      </div>
    </div>
  );
}
