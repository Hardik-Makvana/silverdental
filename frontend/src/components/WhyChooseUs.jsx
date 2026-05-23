'use client';
import { useState, useEffect, useRef } from 'react';
import styles from './WhyChooseUs.module.css';

const features = [
  { icon: '👩‍⚕️', title: 'Experienced Specialists', desc: 'Board-certified experts delivering world-class dental care.' },
  { icon: '🔬', title: 'Advanced Technology', desc: 'Precision treatments using state-of-the-art 3D imaging.' },
  { icon: '💉', title: 'Painless Treatments', desc: 'Modern anesthesia for a comfortable, stress-free experience.' },
  { icon: '🧸', title: 'Child-Friendly Care', desc: 'A welcoming and gentle environment designed just for kids.' },
  { icon: '⚙️', title: 'Modern Equipment', desc: 'Top-tier international sterilization and clinical standards.' },
  { icon: '💖', title: 'Personalized Care', desc: 'Custom treatment plans tailored to your unique smile.' },
];

export default function WhyChooseUs() {
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
    <section id="about" className={styles.section} ref={ref}>
      <div className="container">
        <div className="section-header">
          <span className="section-badge">✨ Excellence in Dentistry</span>
          <h2 className="section-title">Why Patients <span className="accent-text">Trust Silver Smile</span></h2>
          <p className="section-subtitle">We combine clinical expertise, modern technology, and genuine compassion to deliver an unparalleled premium dental experience.</p>
        </div>

        <div className={styles.grid}>
          {features.map((feature, i) => (
            <div
              key={i}
              className={`${styles.card} ${visible ? styles.visible : ''}`}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className={styles.iconBox}>
                <span className={styles.icon}>{feature.icon}</span>
              </div>
              <h3 className={styles.title}>{feature.title}</h3>
              <p className={styles.desc}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
