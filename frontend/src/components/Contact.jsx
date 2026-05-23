'use client';
import { useEffect, useState, useRef } from 'react';
import styles from './Contact.module.css';

const fallbackClinic = {
  phone: '+91 9429051771', whatsapp: '+919429051771', email: 'hello@silversmiledental.in',
  address: { street: '303 RK Supreme, Above Lifestyle', area: 'Near Nana Mava Circle, 150 Ft Ring Road', city: 'Rajkot', state: 'Gujarat' },
  workingHours: [{ day: 'Mon - Sat', hours: '10:00 AM - 8:00 PM', isOpen: true }, { day: 'Sunday', hours: 'Closed', isOpen: false }],
};

export default function Contact() {
  const [clinic, setClinic] = useState(fallbackClinic);
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const fetchClinic = async () => {
      try {
        const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const res = await fetch(`${API_BASE}/api/clinic`);
        const data = await res.json();
        if (data.success && data.data) setClinic(data.data);
      } catch (err) { console.log('Using fallback clinic data'); }
    };
    fetchClinic();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); observer.disconnect(); } }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="contact" className={styles.section} ref={ref}>
      <div className="container">
        <div className="section-header">
          <span className="section-badge">📍 Contact Us</span>
          <h2 className="section-title">Get in <span className="accent-text">Touch</span></h2>
          <p className="section-subtitle">Visit us at our clinic or reach out through any of the channels below.</p>
        </div>
        <div className={`${styles.grid} ${visible ? styles.visible : ''}`}>
          <div className={styles.cards}>
            <div className={styles.card}>
              <div className={styles.cardIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              </div>
              <h4>Phone</h4>
              <a href={`tel:${clinic.phone}`}>{clinic.phone}</a>
            </div>
            <div className={styles.card}>
              <div className={styles.cardIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              </div>
              <h4>Email</h4>
              <a href={`mailto:${clinic.email}`}>{clinic.email}</a>
            </div>
            <div className={styles.card}>
              <div className={styles.cardIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
              </div>
              <h4>Address</h4>
              <p>{clinic.address?.street}<br/>{clinic.address?.area}<br/>{clinic.address?.city}, {clinic.address?.state}</p>
            </div>
            <div className={styles.card}>
              <div className={styles.cardIcon}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
              </div>
              <h4>Working Hours</h4>
              {(clinic.workingHours || fallbackClinic.workingHours).map((wh, i) => (
                <p key={i}><strong>{wh.day}:</strong> {wh.hours}</p>
              ))}
            </div>
          </div>
          <div className={styles.mapWrapper}>
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3691.5!2d70.7833!3d22.2833!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjLCsDE3JzAwLjAiTiA3MMKwNDcnMDAuMCJF!5e0!3m2!1sen!2sin!4v1234567890" width="100%" height="100%" style={{ border: 0, borderRadius: 'var(--radius-xl)' }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Silver Smile Dental Location"></iframe>
          </div>
        </div>
      </div>
    </section>
  );
}
