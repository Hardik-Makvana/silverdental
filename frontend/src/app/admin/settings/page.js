'use client';
import { useEffect, useState } from 'react';
import { apiRequest } from '@/lib/api';
const inp = { padding: '0.6rem 0.8rem', border: '2px solid #EEF2F5', borderRadius: 8, fontSize: '0.9rem', outline: 'none', background: '#F8FAFB', width: '100%', fontFamily: 'inherit' };
const btn = (bg, color) => ({ padding: '0.6rem 1.25rem', background: bg, color, border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' });

export default function SettingsPage() {
  const [clinic, setClinic] = useState(null); const [loading, setLoading] = useState(true); const [saving, setSaving] = useState(false); const [msg, setMsg] = useState('');

  useEffect(() => { (async () => { try { const d = await apiRequest('/api/clinic'); setClinic(d.data || d); } catch(e) { console.error(e); } finally { setLoading(false); } })(); }, []);

  const handleSave = async () => {
    setSaving(true); setMsg('');
    try { await apiRequest('/api/clinic', { method: 'PUT', body: JSON.stringify(clinic) }); setMsg('Settings saved!'); setTimeout(() => setMsg(''), 3000); } catch(e) { setMsg('Error: ' + e.message); }
    finally { setSaving(false); }
  };

  if (loading || !clinic) return <div style={{ textAlign: 'center', padding: '4rem', color: '#8896A6' }}>Loading...</div>;
  const upd = (field, val) => setClinic(prev => ({ ...prev, [field]: val }));
  const updAddr = (field, val) => setClinic(prev => ({ ...prev, address: { ...prev.address, [field]: val } }));
  const updStats = (field, val) => setClinic(prev => ({ ...prev, stats: { ...prev.stats, [field]: val } }));

  return (<div style={{ maxWidth: 800 }}>
    {msg && <div style={{ padding: '0.75rem', background: msg.startsWith('Error') ? '#FDEDEB' : '#E8F8EE', color: msg.startsWith('Error') ? '#E74C3C' : '#2ECC71', borderRadius: 10, marginBottom: '1.5rem', fontSize: '0.85rem', fontWeight: 600 }}>{msg}</div>}

    <div style={{ background: 'white', borderRadius: 16, padding: '2rem', marginBottom: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
      <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.1rem', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid #EEF2F5' }}>🏥 Basic Info</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div><label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: 4 }}>Clinic Name</label><input style={inp} value={clinic.clinicName||''} onChange={e => upd('clinicName', e.target.value)} /></div>
          <div><label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: 4 }}>Phone</label><input style={inp} value={clinic.phone||''} onChange={e => upd('phone', e.target.value)} /></div>
        </div>
        <div><label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: 4 }}>Tagline</label><input style={inp} value={clinic.tagline||''} onChange={e => upd('tagline', e.target.value)} /></div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div><label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: 4 }}>Email</label><input style={inp} value={clinic.email||''} onChange={e => upd('email', e.target.value)} /></div>
          <div><label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: 4 }}>WhatsApp</label><input style={inp} value={clinic.whatsapp||''} onChange={e => upd('whatsapp', e.target.value)} /></div>
        </div>
      </div>
    </div>

    <div style={{ background: 'white', borderRadius: 16, padding: '2rem', marginBottom: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
      <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.1rem', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid #EEF2F5' }}>📍 Address</h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div><label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: 4 }}>Street</label><input style={inp} value={clinic.address?.street||''} onChange={e => updAddr('street', e.target.value)} /></div>
        <div><label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: 4 }}>Area</label><input style={inp} value={clinic.address?.area||''} onChange={e => updAddr('area', e.target.value)} /></div>
        <div><label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: 4 }}>City</label><input style={inp} value={clinic.address?.city||''} onChange={e => updAddr('city', e.target.value)} /></div>
        <div><label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: 4 }}>State</label><input style={inp} value={clinic.address?.state||''} onChange={e => updAddr('state', e.target.value)} /></div>
      </div>
    </div>

    <div style={{ background: 'white', borderRadius: 16, padding: '2rem', marginBottom: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
      <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.1rem', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid #EEF2F5' }}>📊 Stats (displayed on website)</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
        <div><label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: 4 }}>Patients Served</label><input type="number" style={inp} value={clinic.stats?.patientsServed||0} onChange={e => updStats('patientsServed', parseInt(e.target.value)||0)} /></div>
        <div><label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: 4 }}>Years Experience</label><input type="number" style={inp} value={clinic.stats?.yearsExperience||0} onChange={e => updStats('yearsExperience', parseInt(e.target.value)||0)} /></div>
        <div><label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: 4 }}>Specialists</label><input type="number" style={inp} value={clinic.stats?.specialists||0} onChange={e => updStats('specialists', parseInt(e.target.value)||0)} /></div>
        <div><label style={{ fontSize: '0.8rem', fontWeight: 600, display: 'block', marginBottom: 4 }}>Success Rate %</label><input type="number" style={inp} value={clinic.stats?.successRate||0} onChange={e => updStats('successRate', parseInt(e.target.value)||0)} /></div>
      </div>
    </div>

    <div style={{ background: 'white', borderRadius: 16, padding: '2rem', marginBottom: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
      <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1.1rem', marginBottom: '1.25rem', paddingBottom: '0.75rem', borderBottom: '1px solid #EEF2F5' }}>📝 About Text</h3>
      <textarea style={{ ...inp, minHeight: 120 }} value={clinic.aboutText||''} onChange={e => upd('aboutText', e.target.value)} />
    </div>

    <button onClick={handleSave} disabled={saving} style={{ ...btn('linear-gradient(135deg,#1B6B93,#0F4C6B)', 'white'), padding: '0.85rem 2.5rem', fontSize: '1rem', opacity: saving ? 0.7 : 1 }}>{saving ? 'Saving...' : '💾 Save Settings'}</button>
  </div>);
}
