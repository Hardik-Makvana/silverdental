'use client';
import { useEffect, useRef, useState } from 'react';
import styles from './ClinicTour.module.css';

export default function ClinicTour() {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="clinic-tour" className={styles.section} ref={ref}>
      <div className="container">
        <div className="section-header" style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span className="section-badge">✨ Clinic Tour</span>
          <h2 className="section-title">State-of-the-Art <span className="accent-text">Facilities</span></h2>
          <p className="section-subtitle">Experience a calming, modern, and highly advanced dental environment designed for your maximum comfort.</p>
        </div>

        <div className={`${styles.galleryGrid} ${visible ? styles.visible : ''}`}>
          <div className={`${styles.galleryItem} ${styles.largeItem}`}>
            <img 
              src="/images/clinic/advanced_treatment.jpg" 
              alt="Silver Smile Dental Clinic Setup" 
              className={styles.image}
              loading="lazy"
            />
            <div className={styles.overlay}>
              <h3>Advanced Treatment Areas</h3>
            </div>
          </div>
          
          <div className={styles.galleryCol}>
            <div className={`${styles.galleryItem} ${styles.smallItem}`}>
              <img 
                src="/images/clinic/clinic1.jpg" 
                alt="Modern Dental Chair" 
                className={styles.image}
                loading="lazy"
              />
              <div className={styles.overlay}>
                <h3>Comfortable Experience</h3>
              </div>
            </div>
            
            <div className={`${styles.galleryItem} ${styles.smallItem}`}>
              <img 
                src="/images/clinic/clinic3.jpg" 
                alt="Premium Waiting Lounge" 
                className={styles.image}
                loading="lazy"
              />
              <div className={styles.overlay}>
                <h3>Premium Waiting Lounge</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
