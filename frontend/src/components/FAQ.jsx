'use client';
import { useState, useEffect, useRef } from 'react';
import styles from './FAQ.module.css';

const fallbackFaqs = [
  { _id: '1', question: 'How often should I visit the dentist?', answer: 'We recommend a dental checkup every 6 months for optimal oral health. Regular visits help detect issues early and prevent costly treatments later.' },
  { _id: '2', question: 'Are dental implants painful?', answer: 'Modern dental implant procedures are virtually painless. We use advanced anesthesia and sedation techniques to ensure your comfort throughout the procedure.' },
  { _id: '3', question: 'How long does teeth whitening last?', answer: 'Professional teeth whitening results can last 1-3 years depending on your diet and oral hygiene habits. We provide maintenance tips to extend your results.' },
  { _id: '4', question: 'What is Invisalign and how does it work?', answer: 'Invisalign uses custom-made clear aligners to gradually straighten teeth. The aligners are virtually invisible, removable, and more comfortable than traditional braces.' },
  { _id: '5', question: 'Do you accept dental insurance?', answer: 'Yes, we accept most major dental insurance plans. We also offer flexible EMI payment options and special packages for comprehensive treatments.' },
  { _id: '6', question: 'How do I handle a dental emergency?', answer: 'Call us immediately at +91 9429051771. We offer same-day emergency appointments. In the meantime, apply a cold compress and avoid hot/cold foods.' },
  { _id: '7', question: 'What age should children first visit a dentist?', answer: "We recommend bringing children for their first dental visit by age 1 or within 6 months of their first tooth appearing. Early visits help establish good dental habits." },
  { _id: '8', question: 'How long does a root canal treatment take?', answer: 'A root canal typically takes 1-2 visits, each lasting 60-90 minutes. With our advanced technology, the procedure is comfortable and efficient.' },
];

function FAQItem({ faq, isOpen, onToggle }) {
  return (
    <div className={`${styles.item} ${isOpen ? styles.itemOpen : ''}`}>
      <button className={styles.question} onClick={onToggle} aria-expanded={isOpen}>
        <span>{faq.question}</span>
        <span className={styles.icon}>{isOpen ? '−' : '+'}</span>
      </button>
      <div className={styles.answerWrapper} style={{ maxHeight: isOpen ? '400px' : '0' }}>
        <div className={styles.answer}>
          <p>{faq.answer}</p>
        </div>
      </div>
    </div>
  );
}

export default function FAQ() {
  const [faqs, setFaqs] = useState(fallbackFaqs);
  const [openIndex, setOpenIndex] = useState(0);
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const res = await fetch(`${API_BASE}/api/faqs`);
        const data = await res.json();
        if (data.success && data.data && data.data.length > 0) {
          setFaqs(data.data);
        }
      } catch (err) {
        console.log('Using fallback FAQ data');
      }
    };
    fetchFaqs();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="faq" className={styles.section} ref={ref}>
      <div className="container">
        <div className="section-header">
          <span className="section-badge">❓ FAQ</span>
          <h2 className="section-title">Frequently Asked <span className="accent-text">Questions</span></h2>
          <p className="section-subtitle">Find answers to common questions about our dental services and treatments.</p>
        </div>

        <div className={`${styles.accordion} ${visible ? styles.visible : ''}`}>
          <div className={styles.column}>
            {faqs.slice(0, Math.ceil(faqs.length / 2)).map((faq, i) => (
              <FAQItem key={faq._id || i} faq={faq} isOpen={openIndex === i} onToggle={() => setOpenIndex(openIndex === i ? -1 : i)} />
            ))}
          </div>
          <div className={styles.column}>
            {faqs.slice(Math.ceil(faqs.length / 2)).map((faq, i) => {
              const idx = i + Math.ceil(faqs.length / 2);
              return <FAQItem key={faq._id || idx} faq={faq} isOpen={openIndex === idx} onToggle={() => setOpenIndex(openIndex === idx ? -1 : idx)} />;
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
