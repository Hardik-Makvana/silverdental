'use client';
import { useState, useRef, useEffect } from 'react';
import styles from './BeforeAfter.module.css';

export default function BeforeAfter() {
  const [sliderPos, setSliderPos] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); observer.disconnect(); } }, { threshold: 0.1 });
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const handleMove = (clientX) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setSliderPos((x / rect.width) * 100);
  };

  const onMouseDown = () => setIsDragging(true);
  const onMouseUp = () => setIsDragging(false);
  const onMouseMove = (e) => { if (isDragging) handleMove(e.clientX); };
  const onTouchMove = (e) => handleMove(e.touches[0].clientX);

  useEffect(() => {
    if (isDragging) { document.addEventListener('mouseup', onMouseUp); document.addEventListener('mousemove', onMouseMove); }
    return () => { document.removeEventListener('mouseup', onMouseUp); document.removeEventListener('mousemove', onMouseMove); };
  }, [isDragging]);

  return (
    <section className={styles.section} ref={containerRef}>
      <div className="container">
        <div className="section-header">
          <span className="section-badge">✨ Transformations</span>
          <h2 className="section-title">See the <span className="accent-text">Difference</span></h2>
          <p className="section-subtitle">Real results from real patients. Drag the slider to compare before and after.</p>
        </div>
        <div className={`${styles.slider} ${visible ? styles.visible : ''}`} onMouseDown={onMouseDown} onTouchMove={onTouchMove} onTouchStart={onMouseDown} onTouchEnd={onMouseUp}>
          <div className={styles.beforeSide} style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}>
            <img 
              src="/images/perfect_smile.png" 
              alt="Before Whitening" 
              className={styles.image} 
              style={{ filter: 'sepia(0.35) hue-rotate(-10deg) saturate(1.6) brightness(0.85) contrast(0.95)' }} 
            />
            <span className={styles.label}>Before</span>
          </div>
          <div className={styles.afterSide} style={{ clipPath: `inset(0 0 0 ${sliderPos}%)` }}>
            <img 
              src="/images/perfect_smile.png" 
              alt="After Whitening" 
              className={styles.image} 
              style={{ filter: 'brightness(1.05) contrast(1.05) saturate(1.1)' }} 
            />
            <span className={`${styles.label} ${styles.labelRight}`}>After</span>
          </div>
          <div className={styles.handle} style={{ left: `${sliderPos}%` }}>
            <div className={styles.handleLine}></div>
            <div className={styles.handleCircle}>⟷</div>
            <div className={styles.handleLine}></div>
          </div>
        </div>
      </div>
    </section>
  );
}
