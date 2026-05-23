'use client';
import { useEffect, useState } from 'react';
import { apiRequest } from '@/lib/api';
const inp = { padding: '0.6rem 0.8rem', border: '2px solid #EEF2F5', borderRadius: 8, fontSize: '0.9rem', outline: 'none', background: '#F8FAFB', width: '100%', fontFamily: 'inherit' };
const btn = (bg, color) => ({ padding: '0.6rem 1.25rem', background: bg, color, border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' });

export default function ReviewsPage() {
  const [reviews, setReviews] = useState([]); const [loading, setLoading] = useState(true); const [showForm, setShowForm] = useState(false); const [editId, setEditId] = useState(null);
  const empty = { patientName: '', rating: 5, review: '', service: '', image: '', createdAt: new Date().toISOString().split('T')[0] };
  const [form, setForm] = useState(empty);

  useEffect(() => { load(); }, []);
  const load = async () => { try { const d = await apiRequest('/api/reviews'); setReviews(d.data || []); } catch(e) { console.error(e); } finally { setLoading(false); } };
  const handleSubmit = async (e) => { e.preventDefault(); try { if (editId) await apiRequest(`/api/reviews/${editId}`, { method: 'PUT', body: JSON.stringify(form) }); else await apiRequest('/api/reviews', { method: 'POST', body: JSON.stringify(form) }); setShowForm(false); setEditId(null); setForm(empty); load(); } catch(e) { alert(e.message); } };
  const del = async (id) => { if (!confirm('Delete?')) return; try { await apiRequest(`/api/reviews/${id}`, { method: 'DELETE' }); load(); } catch(e) { alert(e.message); } };

  if (loading) return <div style={{ textAlign: 'center', padding: '4rem', color: '#8896A6' }}>Loading...</div>;
  return (<div>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
      <p style={{ color: '#8896A6' }}>{reviews.length} reviews</p>
      <button onClick={() => { setShowForm(true); setEditId(null); setForm(empty); }} style={btn('linear-gradient(135deg,#E44D76,#C2385C)', 'white')}>+ Add Review</button>
    </div>
    {showForm && <div style={{ background: 'white', borderRadius: 16, padding: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
      <h3 style={{ fontFamily: "'Playfair Display',serif", marginBottom: '1rem' }}>{editId ? 'Edit' : 'Add'} Review</h3>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div><label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: 4 }}>Patient Name *</label><input style={inp} value={form.patientName} onChange={e => setForm({...form, patientName: e.target.value})} required /></div>
          <div><label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: 4 }}>Rating *</label><select style={inp} value={form.rating} onChange={e => setForm({...form, rating: parseInt(e.target.value)})}>{[5,4,3,2,1].map(r => <option key={r} value={r}>{r} ⭐</option>)}</select></div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div><label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: 4 }}>Review Date *</label><input type="date" style={inp} value={form.createdAt ? new Date(form.createdAt).toISOString().split('T')[0] : ''} onChange={e => setForm({...form, createdAt: new Date(e.target.value).toISOString()})} required /></div>
          <div><label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: 4 }}>Review Text *</label><textarea style={{ ...inp, minHeight: 80 }} value={form.review} onChange={e => setForm({...form, review: e.target.value})} required /></div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div><label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: 4 }}>Service</label><input style={inp} value={form.service} onChange={e => setForm({...form, service: e.target.value})} /></div>
          <div>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: 4 }}>Patient Image</label>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <input type="file" accept="image/*" onChange={async (e) => {
                if (!e.target.files[0]) return;
                try {
                  const url = await import('@/lib/api').then(m => m.uploadImage(e.target.files[0]));
                  setForm({...form, image: url});
                } catch(err) { alert(err.message); }
              }} style={{ ...inp, flex: 1, padding: '0.4rem' }} />
              {form.image && <img src={form.image} alt="Preview" style={{ width: 32, height: 32, objectFit: 'cover', borderRadius: '50%' }} />}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <button type="button" onClick={() => setShowForm(false)} style={btn('#EEF2F5', '#4A5568')}>Cancel</button>
          <button type="submit" style={btn('#E44D76', 'white')}>{editId ? 'Update' : 'Add'}</button>
        </div>
      </form>
    </div>}
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
      {reviews.map(r => (<div key={r._id} style={{ background: 'white', borderRadius: 16, padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(135deg, #E44D76, #C2385C)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{(r.patientName||'A').charAt(0)}</div>
            <div><div style={{ fontWeight: 700, fontSize: '0.95rem' }}>{r.patientName}</div>{r.service && <div style={{ fontSize: '0.72rem', color: '#8896A6' }}>{r.service}</div>}</div>
          </div>
          <div style={{ color: '#F59E0B', fontSize: '0.9rem' }}>{'⭐'.repeat(r.rating)}</div>
        </div>
        <p style={{ fontSize: '0.85rem', color: '#4A5568', lineHeight: 1.6, marginBottom: 12 }}>&ldquo;{r.review}&rdquo;</p>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => { setForm({ patientName: r.patientName, rating: r.rating, review: r.review, service: r.service||'', image: r.image||'', createdAt: r.createdAt||new Date().toISOString() }); setEditId(r._id); setShowForm(true); }} style={{ flex: 1, padding: '0.4rem', background: '#FDF0F3', border: 'none', borderRadius: 8, color: '#E44D76', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}>Edit</button>
          <button onClick={() => del(r._id)} style={{ flex: 1, padding: '0.4rem', background: '#FDEDEB', border: 'none', borderRadius: 8, color: '#E74C3C', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}>Delete</button>
        </div>
      </div>))}
    </div>
  </div>);
}
