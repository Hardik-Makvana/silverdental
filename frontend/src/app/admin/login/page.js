'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiRequest, setAuth } from '@/lib/api';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const data = await apiRequest('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
      setAuth(data.token, data.user);
      router.push('/admin/dashboard');
    } catch (err) { setError(err.message || 'Invalid credentials'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0F4C6B, #1B6B93)', padding: '2rem' }}>
      <div style={{ background: 'white', borderRadius: 20, padding: '3rem', width: '100%', maxWidth: 420, boxShadow: '0 20px 60px rgba(0,0,0,0.2)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🦷</div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.75rem', fontWeight: 700, color: '#1A202C', marginBottom: 4 }}>Silver Smile</h1>
          <p style={{ fontSize: '0.875rem', color: '#8896A6' }}>Admin Dashboard</p>
        </div>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#2D3748' }}>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={{ padding: '0.75rem 1rem', border: '2px solid #EEF2F5', borderRadius: 10, fontSize: '0.95rem', outline: 'none', background: '#F8FAFB' }} placeholder="admin@silversmiledental.in" required />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#2D3748' }}>Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} style={{ padding: '0.75rem 1rem', border: '2px solid #EEF2F5', borderRadius: 10, fontSize: '0.95rem', outline: 'none', background: '#F8FAFB' }} placeholder="Enter password" required />
          </div>
          {error && <div style={{ padding: '0.75rem', background: '#FDEDEB', color: '#E74C3C', borderRadius: 8, fontSize: '0.85rem', textAlign: 'center' }}>{error}</div>}
          <button type="submit" disabled={loading} style={{ padding: '0.85rem', background: 'linear-gradient(135deg, #1B6B93, #0F4C6B)', color: 'white', border: 'none', borderRadius: 12, fontSize: '1rem', fontWeight: 600, cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>{loading ? 'Signing in...' : 'Sign In'}</button>
        </form>
        <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#C4CDD5', marginTop: '1.5rem' }}>Default: admin@silversmiledental.in / SilverSmile@2024</p>
      </div>
    </div>
  );
}
