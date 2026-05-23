'use client';
import { useState, useEffect } from 'react';
import styles from './Navbar.module.css';

import Logo from './Logo';

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Treatments', href: '#services' },
  { label: 'Doctors', href: '#doctors' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'Appointment', href: '#appointment' },
  { label: 'Contact', href: '#contact' },
];

const treatments = [
  { name: 'Dental Implants', icon: '🦷', desc: 'Permanent tooth replacement' },
  { name: 'Invisalign & Braces', icon: '😁', desc: 'Clear aligner therapy' },
  { name: 'Smile Makeover', icon: '✨', desc: 'Complete smile transformation' },
  { name: 'Root Canal', icon: '🏥', desc: 'Pain-free endodontic care' },
  { name: 'Teeth Whitening', icon: '💎', desc: 'Professional whitening' },
  { name: 'Crowns & Bridges', icon: '👑', desc: 'Restorative dentistry' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const handleNavClick = (href) => {
    setMobileOpen(false);
    setDropdownOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className={`container ${styles.container}`}>
        <a href="#home" className={styles.logo} onClick={(e) => { e.preventDefault(); handleNavClick('#home'); }}>
          <Logo />
        </a>

        <nav className={`${styles.nav} ${mobileOpen ? styles.navOpen : ''}`}>
          {navLinks.map((link) => (
            <div
              key={link.label}
              className={styles.navItem}
              onMouseEnter={() => link.hasDropdown && setDropdownOpen(true)}
              onMouseLeave={() => link.hasDropdown && setDropdownOpen(false)}
            >
              <a
                href={link.href}
                className={styles.navLink}
                onClick={(e) => { e.preventDefault(); handleNavClick(link.href); }}
              >
                {link.label}
                {link.hasDropdown && (
                  <svg className={`${styles.chevron} ${dropdownOpen ? styles.chevronOpen : ''}`} width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </a>

              {link.hasDropdown && (
                <div className={`${styles.dropdown} ${dropdownOpen ? styles.dropdownOpen : ''}`}>
                  <div className={styles.dropdownGrid}>
                    {treatments.map((t) => (
                      <a
                        key={t.name}
                        href="#services"
                        className={styles.dropdownItem}
                        onClick={(e) => { e.preventDefault(); handleNavClick('#services'); }}
                      >
                        <span className={styles.dropdownIcon}>{t.icon}</span>
                        <div>
                          <span className={styles.dropdownName}>{t.name}</span>
                          <span className={styles.dropdownDesc}>{t.desc}</span>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className={styles.actions}>
          <a
            href="#appointment"
            className={`btn btn-accent btn-sm ${styles.ctaBtn}`}
            onClick={(e) => { e.preventDefault(); handleNavClick('#appointment'); }}
          >
            Book Now
          </a>
          <button
            className={`${styles.hamburger} ${mobileOpen ? styles.hamburgerOpen : ''}`}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {mobileOpen && <div className={styles.overlay} onClick={() => setMobileOpen(false)} />}
    </header>
  );
}
