'use client';
import { useEffect, useState } from 'react';
import styles from './Footer.module.css';

const fallback = { clinicName: 'Silver Smile Dental Specialists', tagline: 'Where Cutting Edge Technology Meets Compassionate Dental Care', phone: '+91 9429051771', email: 'hello@silversmiledental.in', address: { street: '303 RK Supreme, Above Lifestyle', area: 'Near Nana Mava Circle, 150 Ft Ring Road', city: 'Rajkot', state: 'Gujarat' } };

export default function Footer() {
  const [clinic, setClinic] = useState(fallback);
  useEffect(() => {
    const fetchClinic = async () => {
      try {
        const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const res = await fetch(`${API_BASE}/api/clinic`);
        const data = await res.json();
        if (data.success && data.data) setClinic(data.data);
      } catch (err) { console.log('Using fallback footer data'); }
    };
    fetchClinic();
  }, []);

  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={styles.grid}>
          <div className={styles.column}>
            <div className={styles.logo}>
              <span className={styles.logoIcon}>🦷</span>
              <div><span className={styles.logoName}>{clinic.clinicName || fallback.clinicName}</span><span className={styles.logoTagline}>Dental Specialists</span></div>
            </div>
            <p className={styles.aboutText}>{clinic.tagline || fallback.tagline}</p>
            <div className={styles.socials}>
              <a href="https://www.instagram.com/silversmile_dental_specialists/" className={styles.socialIcon} aria-label="Instagram" target="_blank" rel="noopener noreferrer">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href="#" className={styles.socialIcon} aria-label="Facebook">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/></svg>
              </a>
            </div>
          </div>
          <div className={styles.column}>
            <h4 className={styles.columnTitle}>Quick Links</h4>
            <ul className={styles.linkList}>
              <li><a href="#home">Home</a></li><li><a href="#services">Treatments</a></li><li><a href="#doctors">Our Doctors</a></li>
              <li><a href="#testimonials">Reviews</a></li><li><a href="#appointment">Book Appointment</a></li><li><a href="#contact">Contact</a></li>
            </ul>
          </div>
          <div className={styles.column}>
            <h4 className={styles.columnTitle}>Our Services</h4>
            <ul className={styles.linkList}>
              <li><a href="#services">Dental Implants</a></li><li><a href="#services">Teeth Whitening</a></li><li><a href="#services">Invisalign</a></li>
              <li><a href="#services">Root Canal</a></li><li><a href="#services">Smile Makeover</a></li><li><a href="#services">Dental Crown</a></li>
            </ul>
          </div>
          <div className={styles.column}>
            <h4 className={styles.columnTitle}>Contact</h4>
            <div className={styles.contactList}>
              <div className={styles.contactItem}><span>📞</span><a href={`tel:${clinic.phone}`}>{clinic.phone || fallback.phone}</a></div>
              <div className={styles.contactItem}><span>✉️</span><a href={`mailto:${clinic.email}`}>{clinic.email || fallback.email}</a></div>
              <div className={styles.contactItem}><span>📍</span><p>{clinic.address?.street || fallback.address.street}, {clinic.address?.area || fallback.address.area}, {clinic.address?.city || fallback.address.city}</p></div>
            </div>
          </div>
        </div>
        <div className={styles.bottomBar}>
          <p>© {new Date().getFullYear()} {clinic.clinicName || fallback.clinicName}. All rights reserved.</p>
          <div className={styles.bottomLinks}><a href="#">Privacy Policy</a><a href="#">Terms of Service</a></div>
        </div>
      </div>
    </footer>
  );
}
