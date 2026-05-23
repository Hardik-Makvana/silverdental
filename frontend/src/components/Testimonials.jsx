'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import styles from './Testimonials.module.css';

const fallbackReviews = [
  { 
    _id: '1', 
    patientName: 'MITTAL Jadia', 
    date: 'January 16, 2025',
    rating: 5, 
    review: 'I got my Invisalign treatment done here by Dr. Digant and my niece got her teeth checked by Dr. Prerna. We had a wonderful experience here. Very neat and tidy clinic. The doctors are highly knowledgeable.',
    avatarColor: '#1B6B93'
  },
  { 
    _id: '2', 
    patientName: 'Nisha T', 
    date: 'August 2, 2024',
    rating: 5, 
    review: 'I recently had the pleasure of visiting Silver Smile Dental Clinic for a teeth cleaning and for root canal treatment of my son. I am very happy with the experience. From the moment I walked in, the staff made me feel incredibly welcome and at ease.',
    avatarColor: '#8E44AD'
  },
  { 
    _id: '3', 
    patientName: 'Kavya Vanjani', 
    date: 'October 16, 2024',
    rating: 5, 
    review: 'Amazing experience at Silver Smile. The doctors are highly skilled, the environment is soothing, and the entire team ensures you feel completely comfortable throughout the treatment.',
    avatarColor: '#F39C12'
  },
  { 
    _id: '4', 
    patientName: 'Satisfied Parent', 
    date: 'September 12, 2024',
    rating: 5, 
    review: "I visited Silver Smile for my and my son's dental treatment. My son is a special child but Dr. Prerna handled the treatment very comfortably without anesthesia. We are very satisfied with the care and treatment.",
    avatarColor: '#2ECC71'
  },
  { 
    _id: '5', 
    patientName: 'Adarsh Kanani', 
    date: 'February 9, 2025',
    rating: 5, 
    review: 'I visited Silver Smile Dental Clinic for a teeth whitening session before my wedding, and the results were amazing! My teeth are now several shades brighter, and I love my new smile.',
    avatarColor: '#E74C3C'
  },
  { 
    _id: '6', 
    patientName: 'Dilip D', 
    date: 'September 2, 2023',
    rating: 4, 
    review: 'Very good service with managing young kids throughout process. I would definitely recommend visiting this dentist for your kids dental needs.',
    avatarColor: '#34495E'
  },
  { 
    _id: '7', 
    patientName: 'Ishika Gajjar', 
    date: 'November 16, 2024',
    rating: 5, 
    review: 'I had a fantastic experience at Silver Smile Dental Clinic with Dr. Digant for my teeth alignment and implant treatment. His expertise, patience, and kindness made me feel at ease throughout the process. The results are amazing — Highly recommend Dr. Digant and his team!',
    avatarColor: '#16A085'
  }
];

function StarRating({ rating }) {
  return (
    <div className={styles.stars}>
      {[1,2,3,4,5].map(star => (
        <svg key={star} width="16" height="16" viewBox="0 0 16 16" fill={star <= rating ? '#Fbbc04' : '#E5E7EB'}>
          <path d="M7.423 1.309c.27-.853 1.482-.853 1.753 0l1.246 3.931a.925.925 0 00.88.64h4.132c.896 0 1.269 1.15.545 1.677l-3.344 2.43a.925.925 0 00-.336 1.035l1.247 3.931c.27.854-.705 1.562-1.429 1.035l-3.344-2.43a.925.925 0 00-1.086 0l-3.344 2.43c-.724.527-1.699-.181-1.429-1.035l1.247-3.931a.925.925 0 00-.336-1.035l-3.344-2.43c-.724-.527-.35-1.677.545-1.677h4.132a.925.925 0 00.88-.64l1.246-3.931z"/>
        </svg>
      ))}
    </div>
  );
}

function ReviewCard({ review }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = review.review.length > 130;
  
  // Format date if it's from DB
  const reviewDate = review.createdAt ? new Date(review.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : (review.date || 'Recent');

  return (
    <div className={styles.reviewCard}>
      <div className={styles.innerCard}>
        <div className={styles.cardHeader}>
          {review.image ? (
            <img src={review.image} alt={review.patientName} className={styles.avatar} style={{ objectFit: 'cover' }} />
          ) : (
            <div className={styles.avatar} style={{ backgroundColor: review.avatarColor || '#1B6B93' }}>
              {review.patientName.charAt(0)}
            </div>
          )}
          <div className={styles.headerInfo}>
            <h4 className={styles.patientName}>{review.patientName}</h4>
            <span className={styles.reviewDate}>{reviewDate}</span>
          </div>
          <div className={styles.googleIconSm}>
            <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
          </div>
        </div>
        <div className={styles.ratingRow}>
          <StarRating rating={review.rating} />
        </div>
        <div className={styles.reviewContent}>
          <p className={styles.reviewText}>
            {expanded ? review.review : (isLong ? `${review.review.substring(0, 130)}...` : review.review)}
          </p>
          {isLong && (
            <button className={styles.readMoreBtn} onClick={() => setExpanded(!expanded)}>
              {expanded ? 'Read Less' : 'Read More'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  const [reviews, setReviews] = useState(fallbackReviews);
  const [current, setCurrent] = useState(0);
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const res = await fetch(`${API_BASE}/api/reviews`);
        const data = await res.json();
        if (data.success && data.data && data.data.length > 0) {
          setReviews(data.data);
        }
      } catch (err) {
        console.log('Using fallback reviews data');
      }
    };
    fetchReviews();
  }, []);

  const [itemsPerView, setItemsPerView] = useState(3);
  
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) setItemsPerView(1);
      else if (window.innerWidth < 1024) setItemsPerView(2);
      else setItemsPerView(3);
    };
    handleResize(); 
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, reviews.length - itemsPerView);

  const next = useCallback(() => setCurrent(prev => prev >= maxIndex ? 0 : prev + 1), [maxIndex]);
  const prev = useCallback(() => setCurrent(prev => prev <= 0 ? maxIndex : prev - 1), [maxIndex]);

  useEffect(() => {
    intervalRef.current = setInterval(next, 7000);
    return () => clearInterval(intervalRef.current);
  }, [next]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="testimonials" className={styles.section} ref={ref}>
      <div className="container">
        
        <div className={styles.headerLayout}>
          <div className={styles.headerText}>
            <span className="section-badge">TESTIMONIALS / GOOGLE REVIEWS</span>
            <h2 className="section-title">Trusted by <span className="accent-text">Hundreds</span></h2>
            <p className="section-subtitle">Trusted by hundreds of happy smiles across Rajkot.</p>
          </div>
          
          <div className={styles.googleOverallBadge}>
            <div className={styles.googleIconLarge}>
              <svg viewBox="0 0 24 24" width="32" height="32" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            </div>
            <div className={styles.googleOverallInfo}>
              <div className={styles.googleOverallRating}>
                <strong>5.0</strong>
                <StarRating rating={5} />
              </div>
              <span className={styles.googleOverallText}>Based on 258 Google Reviews</span>
            </div>
          </div>
        </div>

        <div className={`${styles.carouselWrapper} ${visible ? styles.visible : ''}`}>
          <div className={styles.carousel}>
            <div className={styles.track} style={{ transform: `translateX(-${current * (100 / itemsPerView)}%)` }}>
              {reviews.map(review => (
                <div 
                  key={review._id} 
                  className={styles.slideItem} 
                  style={{ flex: `0 0 ${100 / itemsPerView}%` }}
                >
                  <ReviewCard review={review} />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.navControls}>
          <button className={styles.navBtn} onClick={prev} aria-label="Previous reviews">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <div className={styles.dots}>
            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
              <button key={i} className={`${styles.dot} ${i === current ? styles.dotActive : ''}`} onClick={() => setCurrent(i)} aria-label={`Go to review ${i + 1}`} />
            ))}
          </div>
          <button className={styles.navBtn} onClick={next} aria-label="Next reviews">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>

      </div>
    </section>
  );
}
