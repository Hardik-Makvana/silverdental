'use client';
import { useEffect, useState } from 'react';
import { apiRequest } from '@/lib/api';
const inp = { padding: '0.6rem 0.8rem', border: '2px solid #EEF2F5', borderRadius: 8, fontSize: '0.9rem', outline: 'none', background: '#F8FAFB', width: '100%', fontFamily: 'inherit' };
const btn = (bg, color) => ({ padding: '0.6rem 1.25rem', background: bg, color, border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' });

export default function FAQsPage() {
  const [faqs, setFaqs] = useState([]); const [loading, setLoading] = useState(true); const [showForm, setShowForm] = useState(false); const [editId, setEditId] = useState(null);
  const empty = { question: '', answer: '', category: '', order: 0 };
  const [form, setForm] = useState(empty);

  useEffect(() => { load(); }, []);
  const load = async () => { try { const d = await apiRequest('/api/faqs'); setFaqs(d.data || []); } catch(e) { console.error(e); } finally { setLoading(false); } };
  const handleSubmit = async (e) => { e.preventDefault(); try { if (editId) await apiRequest(`/api/faqs/${editId}`, { method: 'PUT', body: JSON.stringify(form) }); else await apiRequest('/api/faqs', { method: 'POST', body: JSON.stringify(form) }); setShowForm(false); setEditId(null); setForm(empty); load(); } catch(e) { alert(e.message); } };
  const del = async (id) => { if (!confirm('Delete?')) return; try { await apiRequest(`/api/faqs/${id}`, { method: 'DELETE' }); load(); } catch(e) { alert(e.message); } };

  if (loading) return <div style={{ textAlign: 'center', padding: '4rem', color: '#8896A6' }}>Loading...</div>;
  return (<div>
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
      <p style={{ color: '#8896A6' }}>{faqs.length} FAQs</p>
      <button onClick={() => { setShowForm(true); setEditId(null); setForm(empty); }} style={btn('linear-gradient(135deg,#1B6B93,#0F4C6B)', 'white')}>+ Add FAQ</button>
    </div>
    {showForm && <div style={{ background: 'white', borderRadius: 16, padding: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
      <h3 style={{ fontFamily: "'Playfair Display',serif", marginBottom: '1rem' }}>{editId ? 'Edit' : 'Add'} FAQ</h3>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div><label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: 4 }}>Question *</label><input style={inp} value={form.question} onChange={e => setForm({...form, question: e.target.value})} required /></div>
        <div><label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: 4 }}>Answer *</label><textarea style={{ ...inp, minHeight: 80 }} value={form.answer} onChange={e => setForm({...form, answer: e.target.value})} required /></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div><label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: 4 }}>Category</label><input style={inp} value={form.category} onChange={e => setForm({...form, category: e.target.value})} /></div>
          <div><label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: 4 }}>Order</label><input type="number" style={inp} value={form.order} onChange={e => setForm({...form, order: parseInt(e.target.value)||0})} /></div>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
          <button type="button" onClick={() => setShowForm(false)} style={btn('#EEF2F5', '#4A5568')}>Cancel</button>
          <button type="submit" style={btn('#1B6B93', 'white')}>{editId ? 'Update' : 'Add'}</button>
        </div>
      </form>
    </div>}
    <div style={{ background: 'white', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
      {faqs.map((f, i) => (<div key={f._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.5rem', borderBottom: '1px solid #EEF2F5' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: 4 }}>{f.order || i+1}. {f.question}</div>
          <div style={{ fontSize: '0.82rem', color: '#8896A6', lineHeight: 1.5 }}>{f.answer.substring(0, 120)}{f.answer.length > 120 ? '...' : ''}</div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexShrink: 0, marginLeft: 16 }}>
          <button onClick={() => { setForm({ question: f.question, answer: f.answer, category: f.category||'', order: f.order||0 }); setEditId(f._id); setShowForm(true); }} style={{ padding: '4px 12px', background: '#E8F4F8', border: 'none', borderRadius: 6, color: '#1B6B93', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}>Edit</button>
          <button onClick={() => del(f._id)} style={{ padding: '4px 12px', background: '#FDEDEB', border: 'none', borderRadius: 6, color: '#E74C3C', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600 }}>Delete</button>
        </div>
      </div>))}
    </div>
  </div>);
}
