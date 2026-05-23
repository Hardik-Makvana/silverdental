'use client';
import { useState, useEffect, useRef } from 'react';
import styles from './Hero.module.css';

export default function Hero() {
  const [clinicInfo, setClinicInfo] = useState(null);
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    setVisible(true);
    const fetchClinic = async () => {
      try {
        const API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/+$/, '');
        const res = await fetch(`${API_BASE}/api/clinic`);
        const data = await res.json();
        if (data.success && data.data) setClinicInfo(data.data);
      } catch (err) {
        console.log('Using fallback hero data');
      }
    };
    fetchClinic();
  }, []);

  const openModal = () => {
    window.dispatchEvent(new CustomEvent('openAppointmentModal'));
  };

  const whatsappNumber = clinicInfo?.whatsapp || '919429051771';

  return (
    <section id="home" className={styles.section} ref={ref}>
      <div className={styles.bgPattern} />
      <div className={`container ${styles.container}`}>
        <div className={`${styles.left} ${visible ? styles.visible : ''}`}>
          <span className={styles.badge}>
            <span className={styles.badgeDot} />
            { 'Premium Dental Care in Rajkot'}
          </span>

          <h1 className={styles.heading}>
            <span className={styles.headingLine}>Cutting Edge</span>
            <span className={styles.headingAccent}>Technology</span>
            <span className={styles.headingLine}>Compassionate</span>
            <span className={styles.headingAccent}>Dental Care</span>
          </h1>

          <p className={styles.subtitle}>
            Experience world-class dental treatments with advanced technology and personalized care.
            Your perfect smile journey starts here at {clinicInfo?.name || 'Silver Smile Dental Specialists'}.
          </p>

          <div className={styles.ctas}>
            <button className="btn btn-accent btn-lg" onClick={openModal}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <rect x="3" y="2" width="12" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
                <path d="M6 0.5V3.5M12 0.5V3.5M3 6.5H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              Book Appointment
            </button>
            <a
              href={`https://wa.me/${whatsappNumber}?text=Hi, I'd like to book an appointment at Silver Smile Dental.`}
              className={`btn btn-outline btn-lg ${styles.whatsappBtn}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp Us
            </a>
          </div>

          
        </div>

        <div className={`${styles.right} ${visible ? styles.visible : ''}`}>
          <div className={styles.imageContainer}>
            <div className={styles.imageBackground} />
            <img
              src="/images/hero-doctors.jpg"
              alt="Silver Smile Dental Specialists"
              className={styles.heroImage}
            />

            <div className={`${styles.floatCard} ${styles.floatCard1}`}>
              <div className={styles.floatIcon}>🏆</div>
              <div>
                <span className={styles.floatValue}>98%</span>
                <span className={styles.floatLabel}>Success Rate</span>
              </div>
            </div>

            <div className={`${styles.floatCard} ${styles.floatCard2}`}>
              <div className={styles.floatIcon}>⭐</div>
              <div>
                <span className={styles.floatValue}>4.9/5</span>
                <span className={styles.floatLabel}>Google Rating</span>
              </div>
            </div>

            <div className={`${styles.floatCard} ${styles.floatCard3}`}>
              <div className={styles.floatIcon}>😊</div>
              <div>
                <span className={styles.floatValue}>10k+</span>
                <span className={styles.floatLabel}>Happy Patients</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
