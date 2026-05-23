'use client';
import { useState, useEffect } from 'react';
import styles from './AppointmentModal.module.css';

const servicesList = [
  'Dental Checkup', 'Teeth Whitening', 'Dental Implants', 
  'Root Canal Treatment', 'Invisalign / Braces', 
  'Dental Crown & Bridge', 'Smile Makeover', 'Teeth Cleaning', 
  'Wisdom Tooth Extraction', 'Other'
];

export default function AppointmentModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', service: '', date: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const handleOpen = () => {
      setIsOpen(true);
      document.body.style.overflow = 'hidden';
    };
    
    window.addEventListener('openAppointmentModal', handleOpen);
    return () => {
      window.removeEventListener('openAppointmentModal', handleOpen);
    };
  }, []);

  const close = () => {
    setIsOpen(false);
    document.body.style.overflow = 'auto';
    setTimeout(() => {
      setSuccess(false);
      setError('');
      setFormData({ name: '', phone: '', service: '', date: '', message: '' });
    }, 300);
  };

  const handleChange = (e) => { 
    setFormData({ ...formData, [e.target.name]: e.target.value }); 
    setError(''); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.service || !formData.date) { 
      setError('Please fill in all required fields.'); 
      return; 
    }
    setLoading(true); 
    setError('');
    
    try {
      const API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/+$/, '');
      const res = await fetch(`${API_BASE}/api/appointments`, { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(formData) 
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Something went wrong');
      setSuccess(true);
    } catch (err) { 
      setError(err.message || 'Failed to submit. Please call us directly.'); 
    } finally { 
      setLoading(false); 
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`${styles.overlay} ${isOpen ? styles.open : ''}`} onClick={close}>
      <div className={`${styles.modal} ${isOpen ? styles.open : ''}`} onClick={e => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={close} aria-label="Close modal">✕</button>
        
        <div className={styles.modalContent}>
          {success ? (
            <div className={styles.successState}>
              <div className={styles.successIcon}>✅</div>
              <h3 className={styles.successTitle}>Request Sent!</h3>
              <p className={styles.successDesc}>Our team will confirm your appointment via WhatsApp within 30 minutes.</p>
              <button className="btn btn-primary" onClick={close} style={{width: '100%', marginTop: '1rem'}}>Close</button>
            </div>
          ) : (
            <>
              <div className={styles.modalHeader}>
                <h3 className={styles.title}>Book Appointment</h3>
                <p className={styles.subtitle}>Quick and easy booking. We'll confirm shortly.</p>
              </div>
              
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formRow}>
                  <div className="form-group">
                    <label className="form-label">Full Name *</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="form-input" placeholder="Your name" required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number *</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="form-input" placeholder="+91 XXXXX XXXXX" required />
                  </div>
                </div>
                
                <div className={styles.formRow}>
                  <div className="form-group">
                    <label className="form-label">Select Service *</label>
                    <select name="service" value={formData.service} onChange={handleChange} className="form-select" required>
                      <option value="">Choose a service</option>
                      {servicesList.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Preferred Date *</label>
                    <input type="date" name="date" value={formData.date} onChange={handleChange} className="form-input" required min={new Date().toISOString().split('T')[0]} />
                  </div>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Message (Optional)</label>
                  <textarea name="message" value={formData.message} onChange={handleChange} className="form-textarea" placeholder="Any specific concern?" rows={3}></textarea>
                </div>
                
                {error && <div className={styles.error}>{error}</div>}
                
                <button type="submit" className={`btn btn-accent ${styles.submitBtn}`} disabled={loading}>
                  {loading ? 'Sending Request...' : 'Confirm Appointment'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
