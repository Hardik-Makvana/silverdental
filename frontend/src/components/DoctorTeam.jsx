'use client';
import { useEffect, useRef, useState } from 'react';
import styles from './DoctorTeam.module.css';

const directDoctors = [
  { 
    _id: '1', 
    name: 'Dr Digant Thakkar', 
    qualification: 'M.D.S.', 
    specialization: 'Founder – Orthodontist', 
    experience: 'Invisalign & Braces Specialist', 
    image: '/images/doctors/digant.png',
  },
  { 
    _id: '2', 
    name: 'Dr Prerna Thakkar', 
    qualification: 'M.D.S.', 
    specialization: 'Founder – Pediatric Dentist', 
    experience: 'Kids Dental Care Specialist', 
    image: '/images/doctors/prerna.png',
  },
  { 
    _id: '3', 
    name: 'Dr Monisha Harsoda', 
    qualification: 'B.D.S.', 
    specialization: 'Cosmetic Dentist', 
    experience: 'Root Canal Specialist', 
    image: '/images/doctors/monisha.png',
  },
  { 
    _id: '4', 
    name: 'Dr Amee Patel', 
    qualification: 'M.D.S.', 
    specialization: 'Endodontist', 
    experience: 'Repeat Root Canal Specialist', 
    image: '/images/doctors/amee.png',
  },
  { 
    _id: '5', 
    name: 'Dr Pritesh Vora', 
    qualification: 'M.D.S.', 
    specialization: 'Prosthodontist', 
    experience: 'Crown, Bridge & Implant Specialist', 
    image: '/images/doctors/pritesh.png',
  },
  { 
    _id: '6', 
    name: 'Dr Milli Trivedi', 
    qualification: 'M.D.S.', 
    specialization: 'Periodontist', 
    experience: 'Gum & Implant Specialist', 
    image: '/images/doctors/milli.png',
  },
  { 
    _id: '7', 
    name: 'Dr Karan Gandhi', 
    qualification: 'M.D.S.', 
    specialization: 'Endodontist', 
    experience: 'Single Sitting Root Canal Specialist', 
    image: '/images/doctors/karan.png',
  },
  { 
    _id: '8', 
    name: 'Dr Kuldeep Govani', 
    qualification: 'M.D.S.', 
    specialization: 'Oral Surgeon', 
    experience: 'Wisdom Tooth Removal Expert', 
    image: '/images/doctors/kuldeep.png',
  },
  { 
    _id: '9', 
    name: 'Dr Kishan Detroja', 
    qualification: 'M.D.S.', 
    specialization: 'Prosthodontist', 
    experience: 'Veneers & FMR Specialist', 
    image: '/images/doctors/kishan.png',
  },
  { 
    _id: '10', 
    name: 'Dr Dharmendra Chandarana', 
    qualification: 'M.D.S.', 
    specialization: 'Oral Surgeon', 
    experience: 'Jaw Surgery Specialist', 
    image: '/images/doctors/dharmendra.png',
  },
  { 
    _id: '11', 
    name: 'Dr Ankur Patel', 
    qualification: 'M.D.S.', 
    specialization: 'Endodontist', 
    experience: 'Single Sitting Root Canal Specialist', 
    image: '/images/doctors/ankur.png',
  }
];

export default function DoctorTeam() {
  const [doctors] = useState(directDoctors);
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
    <section id="doctors" className={styles.section} ref={ref}>
      <div className="container">
        <div className="section-header">
          <span className="section-badge">👨‍⚕️ Our Specialists</span>
          <h2 className="section-title">Meet the <span className="accent-text">Expert Team</span></h2>
          <p className="section-subtitle">World-class dental specialists bringing you the most advanced and comfortable care available.</p>
        </div>

        <div className={`${styles.grid} ${visible ? styles.visible : ''}`}>
          {doctors.map((doctor, i) => (
            <div key={doctor._id || i} className={styles.card}>
              <div className={styles.imageContainer}>
                <img src={doctor.image} alt={doctor.name} className={styles.image} loading="lazy" />
              </div>
              <div className={styles.cardContent}>
                <h3 className={styles.doctorName}>{doctor.name}</h3>
                <span className={styles.qualification}>{doctor.qualification}</span>
                <p className={styles.specialization}>{doctor.specialization}</p>
                <div className={styles.experienceBadge}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="6" stroke="currentColor" strokeWidth="1.5"/><path d="M7 4V7L9 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                  {doctor.experience}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
