'use client';
import { useState, useEffect, useRef } from 'react';
import styles from './TrustStats.module.css';

const fallbackStats = [
  { label: 'Happy Patients', value: 15000, suffix: '+', icon: '😊' },
  { label: 'Years Experience', value: 12, suffix: '+', icon: '📅' },
  { label: 'Specialist Doctors', value: 8, suffix: '+', icon: '👨‍⚕️' },
  { label: 'Success Rate', value: 98, suffix: '%', icon: '🏆' },
];

function AnimatedCounter({ end, suffix, shouldAnimate }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!shouldAnimate) return;
    let startTime = null;
    const duration = 2000;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [end, shouldAnimate]);

  return (
    <span>
      {shouldAnimate ? count.toLocaleString() : '0'}
      {suffix}
    </span>
  );
}

export default function TrustStats() {
  const [stats, setStats] = useState(fallbackStats);
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const res = await fetch(`${API_BASE}/api/clinic`);
        const data = await res.json();
        if (data.success && data.data?.stats) {
          const s = data.data.stats;
          setStats([
            { label: 'Happy Patients', value: parseInt(s.patientsServed) || 15000, suffix: '+', icon: '😊' },
            { label: 'Years Experience', value: parseInt(s.yearsExperience) || 12, suffix: '+', icon: '📅' },
            { label: 'Specialist Doctors', value: parseInt(s.specialists) || 8, suffix: '+', icon: '👨‍⚕️' },
            { label: 'Success Rate', value: parseInt(s.successRate) || 98, suffix: '%', icon: '🏆' },
          ]);
        }
      } catch (err) {
        console.log('Using fallback stats');
      }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className={styles.section} ref={ref}>
      <div className={`container ${styles.container}`}>
        {stats.map((stat, i) => (
          <div key={i} className={`${styles.card} ${visible ? styles.visible : ''}`} style={{ animationDelay: `${i * 0.1}s` }}>
            <span className={styles.icon}>{stat.icon}</span>
            <div className={styles.value}>
              <AnimatedCounter end={stat.value} suffix={stat.suffix} shouldAnimate={visible} />
            </div>
            <div className={styles.label}>{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
