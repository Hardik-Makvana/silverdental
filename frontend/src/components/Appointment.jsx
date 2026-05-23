'use client';
import { useState } from 'react';
import styles from './Appointment.module.css';

const servicesList = ['Dental Checkup', 'Teeth Whitening', 'Dental Implants', 'Root Canal Treatment', 'Invisalign / Braces', 'Dental Crown & Bridge', 'Smile Makeover', 'Teeth Cleaning', 'Wisdom Tooth Extraction', 'Other'];

export default function Appointment() {
  const [formData, setFormData] = useState({ name: '', phone: '', service: '', date: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); setError(''); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.service || !formData.date) { setError('Please fill in all required fields.'); return; }
    setLoading(true); setError('');
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${API_BASE}/api/appointments`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Something went wrong');
      setSuccess(true);
      setFormData({ name: '', phone: '', service: '', date: '', message: '' });
    } catch (err) { setError(err.message || 'Failed to submit. Please call us directly.'); }
    finally { setLoading(false); }
  };

  return (
    <section id="appointment" className={styles.section}>
      <div className={`container ${styles.container}`}>
        <div className={styles.info}>
          <span className="section-badge">📅 Book Appointment</span>
          <h2 className={styles.title}>Schedule Your Visit to <span className="accent-text">Silver Smile</span></h2>
          <p className={styles.subtitle}>Book online and take the first step towards a healthier, more beautiful smile.</p>
          <div className={styles.features}>
            <div className={styles.feature}><div className={styles.featureIcon}>⚡</div><div><strong>Quick Response</strong><span>Confirmed within 30 minutes</span></div></div>
            <div className={styles.feature}><div className={styles.featureIcon}>🛡️</div><div><strong>100% Safe</strong><span>International hygiene standards</span></div></div>
            <div className={styles.feature}><div className={styles.featureIcon}>💳</div><div><strong>Flexible Payment</strong><span>EMI & insurance accepted</span></div></div>
          </div>
          <div className={styles.contactDirect}>
            <p>Or reach us directly:</p>
            <a href="tel:+919429051771" className={styles.phone}>📞 +91 9429051771</a>
            <a href="https://wa.me/919429051771" target="_blank" rel="noopener" className={styles.whatsapp}>WhatsApp Us →</a>
          </div>
        </div>
        <div className={styles.formWrapper}>
          {success ? (
            <div className={styles.successCard}>
              <div className={styles.successIcon}>✅</div>
              <h3>Appointment Request Sent!</h3>
              <p>Our team will confirm via WhatsApp within 30 minutes.</p>
              <button className="btn btn-primary" onClick={() => setSuccess(false)}>Book Another</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className={styles.form}>
              <h3 className={styles.formTitle}>Request an Appointment</h3>
              <div className={styles.formRow}>
                <div className="form-group"><label className="form-label">Full Name *</label><input type="text" name="name" value={formData.name} onChange={handleChange} className="form-input" placeholder="Your full name" required /></div>
                <div className="form-group"><label className="form-label">Phone Number *</label><input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="form-input" placeholder="+91 XXXXX XXXXX" required /></div>
              </div>
              <div className={styles.formRow}>
                <div className="form-group"><label className="form-label">Select Service *</label><select name="service" value={formData.service} onChange={handleChange} className="form-select" required><option value="">Choose a service</option>{servicesList.map(s => <option key={s} value={s}>{s}</option>)}</select></div>
                <div className="form-group"><label className="form-label">Preferred Date *</label><input type="date" name="date" value={formData.date} onChange={handleChange} className="form-input" required min={new Date().toISOString().split('T')[0]} /></div>
              </div>
              <div className="form-group"><label className="form-label">Message (Optional)</label><textarea name="message" value={formData.message} onChange={handleChange} className="form-textarea" placeholder="Tell us about your concern..." rows={4}></textarea></div>
              {error && <div className={styles.error}>{error}</div>}
              <button type="submit" className={`btn btn-accent btn-lg ${styles.submitBtn}`} disabled={loading}>{loading ? 'Sending...' : '📅 Confirm Appointment'}</button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
