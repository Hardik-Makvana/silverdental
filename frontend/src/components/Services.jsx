'use client';
import { useEffect, useRef, useState } from 'react';
import styles from './Services.module.css';

const directServices = [
  { _id: '1', title: 'Clear Aligners', description: 'Invisible, comfortable aligners for perfectly straight teeth without braces.', image: '/images/services/aligners.png' },
  { _id: '2', title: 'Kids Dentistry', description: 'Gentle, specialized dental care for children in a friendly environment.', image: '/images/services/kids_dentistry.png' },
  { _id: '3', title: 'Dental Implants', description: 'Permanent, natural-looking tooth replacement with titanium implants.', image: '/images/services/implants.png' },
  { _id: '4', title: 'Full Mouth Rehabilitation', description: 'Complete restoration of your oral health, function, and aesthetics.', image: '/images/services/rehabilitation.png' },
  { _id: '5', title: 'Root Canal Treatment', description: 'Painless endodontic therapy to save severely damaged or infected teeth.', image: '/images/services/root_canal.png' },
  { _id: '6', title: 'Crowns & Bridges', description: 'Custom-crafted restorations to protect damaged teeth and bridge gaps.', image: '/images/services/crown_bridge.png' },
  { _id: '7', title: 'Braces Treatment', description: 'Traditional and ceramic braces for complex orthodontic corrections.', image: '/images/services/braces.png' },
  { _id: '8', title: 'Smile Makeover', description: 'Comprehensive aesthetic treatments tailored for your perfect smile.', image: '/images/services/makeover.png' },
  { _id: '9', title: 'Wisdom Tooth Removal', description: 'Safe and painless surgical extraction of impacted wisdom teeth.', image: '/images/services/wisdom_tooth.png' },
  { _id: '10', title: 'Teeth Whitening', description: 'Professional whitening treatments for a instantly brighter, radiant smile.', image: '/images/services/whitening.png' },
  { _id: '11', title: 'Dentures', description: 'High-quality, comfortable removable replacements for missing teeth.', image: '/images/services/dentures.png' },
  { _id: '12', title: 'Tooth-Coloured Fillings', description: 'Aesthetic, durable composite fillings that match your natural teeth perfectly.', image: '/images/services/fillings.png' },
];

export default function Services() {
  const [services] = useState(directServices);
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="services" className={styles.section} ref={ref}>
      <div className="container">
        <div className="section-header">
          <span className="section-badge">SERVICES</span>
          <h2 className="section-title">Your smile <span className="accent-text">deserves the best</span></h2>
          <p className="section-subtitle">Experience exceptional dental care at one of the best dental clinics in Rajkot.</p>
        </div>

        <div className={`${styles.grid} ${visible ? styles.visible : ''}`}>
          {services.map((service, i) => (
            <div key={service._id || i} className={styles.card}>
              <div className={styles.imageContainer}>
                <img src={service.image} alt={service.title} className={styles.image} loading="lazy" />
              </div>
              <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{service.title}</h3>
                <p className={styles.cardDesc}>{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
