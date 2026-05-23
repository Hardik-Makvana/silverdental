'use client';
import { useEffect, useRef, useState } from 'react';
import styles from './Timeline.module.css';

const steps = [
  { icon: '🔍', title: 'Consultation', desc: 'Comprehensive examination, digital X-rays, and personalized treatment planning with our specialists.' },
  { icon: '📋', title: 'Treatment Plan', desc: 'Detailed plan with transparent pricing, timeline, and options tailored to your needs.' },
  { icon: '🦷', title: 'Procedure', desc: 'State-of-the-art treatment in our modern facility with focus on comfort and precision.' },
  { icon: '✨', title: 'Follow-up', desc: 'Regular check-ups and maintenance to ensure lasting results and your continued satisfaction.' },
];

export default function Timeline() {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); observer.disconnect(); } }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className={styles.section} ref={ref}>
      <div className="container">
        <div className="section-header">
          <span className="section-badge" style={{ background: 'rgba(255,255,255,0.1)', color: 'var(--accent-light)' }}>🏥 Your Journey</span>
          <h2 className="section-title" style={{ color: 'white' }}>Your Treatment <span className="accent-text">Journey</span></h2>
          <p className="section-subtitle" style={{ color: 'rgba(255,255,255,0.6)' }}>From consultation to your perfect smile — a seamless 4-step process.</p>
        </div>
        <div className={`${styles.timeline} ${visible ? styles.visible : ''}`}>
          {steps.map((step, i) => (
            <div key={i} className={styles.step} style={{ animationDelay: `${i * 0.2}s` }}>
              <div className={styles.iconBox}>{step.icon}</div>
              <div className={styles.stepNum}>Step {i + 1}</div>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDesc}>{step.desc}</p>
              {i < steps.length - 1 && <div className={styles.connector}></div>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
