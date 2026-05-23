'use client';
import { useEffect, useState } from 'react';
import { apiRequest } from '@/lib/api';
const statusColors = { pending: '#F39C12', confirmed: '#2ECC71', completed: '#8E44AD', cancelled: '#E74C3C' };
const inp = { padding: '0.6rem 0.8rem', border: '2px solid #EEF2F5', borderRadius: 8, fontSize: '0.9rem', outline: 'none', background: '#F8FAFB', fontFamily: 'inherit' };

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => { load(); }, []);
  const load = async () => { try { const d = await apiRequest('/api/appointments?limit=100&sort=-createdAt'); setAppointments(d.data || []); } catch(e) { console.error(e); } finally { setLoading(false); } };
  const updateStatus = async (id, status) => { try { await apiRequest(`/api/appointments/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) }); setAppointments(p => p.map(a => a._id === id ? { ...a, status } : a)); } catch(e) { alert(e.message); } };
  const deleteAppt = async (id) => { if (!confirm('Delete?')) return; try { await apiRequest(`/api/appointments/${id}`, { method: 'DELETE' }); setAppointments(p => p.filter(a => a._id !== id)); } catch(e) { alert(e.message); } };

  const filtered = appointments.filter(a => { if (filter !== 'all' && a.status !== filter) return false; if (search && !a.name.toLowerCase().includes(search.toLowerCase()) && !a.phone.includes(search)) return false; return true; });
  if (loading) return <div style={{ textAlign: 'center', padding: '4rem', color: '#8896A6' }}>Loading...</div>;

  return (<div>
    <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
      <input type="text" placeholder="Search name or phone..." value={search} onChange={e => setSearch(e.target.value)} style={{ ...inp, flex: 1, minWidth: 250 }} />
      <div style={{ display: 'flex', gap: 6 }}>
        {['all','pending','confirmed','completed','cancelled'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding: '0.5rem 1rem', border: '1px solid #DDE3E8', borderRadius: 20, background: filter === f ? '#1B6B93' : 'white', color: filter === f ? 'white' : '#4A5568', fontSize: '0.8rem', cursor: 'pointer', textTransform: 'capitalize', fontWeight: 500 }}>{f}</button>
        ))}
      </div>
    </div>
    <div style={{ background: 'white', borderRadius: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.04)', overflow: 'hidden' }}>
      <div style={{ overflowX: 'auto' }}><table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead><tr>{['Patient','Phone','Service','Date','Status','Actions'].map(h => <th key={h} style={{ textAlign: 'left', padding: '0.75rem 1rem', fontSize: '0.72rem', fontWeight: 700, color: '#8896A6', textTransform: 'uppercase', background: '#F8FAFB', borderBottom: '1px solid #EEF2F5' }}>{h}</th>)}</tr></thead>
        <tbody>{filtered.length === 0 ? <tr><td colSpan={6} style={{ padding: '2rem', textAlign: 'center', color: '#8896A6' }}>No appointments</td></tr> :
          filtered.map(a => (<tr key={a._id}>
            <td style={{ padding: '0.85rem 1rem', borderBottom: '1px solid #EEF2F5', fontSize: '0.88rem' }}><strong>{a.name}</strong>{a.message && <div style={{ fontSize: '0.72rem', color: '#8896A6' }}>{a.message.substring(0,40)}</div>}</td>
            <td style={{ padding: '0.85rem 1rem', borderBottom: '1px solid #EEF2F5', fontSize: '0.88rem' }}>{a.phone}</td>
            <td style={{ padding: '0.85rem 1rem', borderBottom: '1px solid #EEF2F5', fontSize: '0.88rem' }}>{a.service}</td>
            <td style={{ padding: '0.85rem 1rem', borderBottom: '1px solid #EEF2F5', fontSize: '0.88rem' }}>{new Date(a.date).toLocaleDateString('en-IN')}</td>
            <td style={{ padding: '0.85rem 1rem', borderBottom: '1px solid #EEF2F5' }}><span style={{ padding: '3px 10px', borderRadius: 20, fontSize: '0.72rem', fontWeight: 600, background: `${statusColors[a.status]}20`, color: statusColors[a.status], textTransform: 'capitalize' }}>{a.status}</span></td>
            <td style={{ padding: '0.85rem 1rem', borderBottom: '1px solid #EEF2F5' }}>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {a.status === 'pending' && <button onClick={() => updateStatus(a._id, 'confirmed')} style={{ padding: '0.4rem 0.8rem', border: 'none', background: '#E8F8EE', color: '#2ECC71', cursor: 'pointer', borderRadius: 6, fontSize: '0.75rem', fontWeight: 600 }}>Accept</button>}
                {['pending', 'confirmed'].includes(a.status) && <button onClick={() => updateStatus(a._id, 'completed')} style={{ padding: '0.4rem 0.8rem', border: 'none', background: '#F4E8F8', color: '#8E44AD', cursor: 'pointer', borderRadius: 6, fontSize: '0.75rem', fontWeight: 600 }}>Complete</button>}
                <button onClick={() => deleteAppt(a._id)} style={{ padding: '0.4rem 0.8rem', border: 'none', background: '#FDEDEB', color: '#E74C3C', cursor: 'pointer', borderRadius: 6, fontSize: '0.75rem', fontWeight: 600 }}>Reject</button>
              </div>
            </td>
          </tr>))}</tbody>
      </table></div>
    </div>
  </div>);
}
