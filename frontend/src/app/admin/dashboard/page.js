'use client';
import { useEffect, useState } from 'react';
import { apiRequest } from '@/lib/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [a, b] = await Promise.all([apiRequest('/api/appointments/analytics/summary'), apiRequest('/api/appointments?limit=8&sort=-createdAt')]);
        setStats(a.data || a); setRecent(b.data || []);
      } catch (err) { console.error(err); } finally { setLoading(false); }
    })();
  }, []);

  if (loading) return <div style={{ textAlign: 'center', padding: '4rem', color: '#8896A6' }}>Loading...</div>;
    const statusColors = { pending: '#F59E0B', confirmed: '#10B981', completed: '#8E44AD', cancelled: '#EF4444' };
  const cards = [
    { label: 'Total', value: stats?.total || 0, color: '#005A9C', bg: '#F4F7F9', icon: '📋' },
    { label: 'Pending', value: stats?.byStatus?.pending || 0, color: '#F59E0B', bg: '#FEF9EF', icon: '⏳' },
    { label: 'Confirmed', value: stats?.byStatus?.confirmed || 0, color: '#10B981', bg: '#F0FDF4', icon: '✅' },
    { label: 'Completed', value: stats?.byStatus?.completed || 0, color: '#8E44AD', bg: '#FDF4FF', icon: '🏆' },
  ];

  return (<div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
      {cards.map(c => (<div key={c.label} style={{ background: 'white', borderRadius: 12, padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: '0 4px 15px rgba(0,0,0,0.03)', borderLeft: `4px solid ${c.color}` }}>
        <div style={{ width: 48, height: 48, borderRadius: 10, background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>{c.icon}</div>
        <div><div style={{ fontSize: '1.75rem', fontWeight: 800, color: c.color }}>{c.value}</div><div style={{ fontSize: '0.8rem', color: '#6C757D', fontWeight: 600 }}>{c.label}</div></div>
      </div>))}
    </div>
    <div style={{ background: 'white', borderRadius: 12, boxShadow: '0 4px 15px rgba(0,0,0,0.03)', overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem 1.5rem', borderBottom: '1px solid #E9ECEF' }}>
        <h3 style={{ fontFamily: "var(--font-heading)", fontSize: '1.2rem', fontWeight: 700, color: '#2C3E50' }}>Recent Appointments</h3>
        <a href="/admin/appointments" style={{ fontSize: '0.85rem', fontWeight: 600, color: '#005A9C' }}>View All →</a>
      </div>
      <div style={{ overflowX: 'auto' }}><table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead><tr>{['Patient','Phone','Service','Date','Status'].map(h => <th key={h} style={{ textAlign: 'left', padding: '1rem 1.5rem', fontSize: '0.75rem', fontWeight: 700, color: '#6C757D', textTransform: 'uppercase', background: '#F4F7F9', borderBottom: '1px solid #E9ECEF' }}>{h}</th>)}</tr></thead>
        <tbody>{recent.length === 0 ? <tr><td colSpan={5} style={{ padding: '2.5rem', textAlign: 'center', color: '#ADB5BD' }}>No appointments</td></tr> :
          recent.map(a => (<tr key={a._id} style={{ transition: 'background 0.2s' }}><td style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #E9ECEF', fontSize: '0.9rem', color: '#343A40' }}><strong>{a.name}</strong></td>
            <td style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #E9ECEF', fontSize: '0.9rem', color: '#495057' }}>{a.phone}</td>
            <td style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #E9ECEF', fontSize: '0.9rem', color: '#495057' }}>{a.service}</td>
            <td style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #E9ECEF', fontSize: '0.9rem', color: '#495057' }}>{new Date(a.date).toLocaleDateString('en-IN')}</td>
            <td style={{ padding: '1rem 1.5rem', borderBottom: '1px solid #E9ECEF' }}><span style={{ padding: '4px 12px', borderRadius: 20, fontSize: '0.75rem', fontWeight: 600, background: `${statusColors[a.status]}15`, color: statusColors[a.status], textTransform: 'capitalize' }}>{a.status}</span></td>
          </tr>))}</tbody>
      </table></div>
    </div>
  </div>);
}
