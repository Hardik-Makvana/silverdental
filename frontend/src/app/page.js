'use client';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import TrustStats from '@/components/TrustStats';
import WhyChooseUs from '@/components/WhyChooseUs';
import Services from '@/components/Services';
import ClinicTour from '@/components/ClinicTour';
import DoctorTeam from '@/components/DoctorTeam';
import BeforeAfter from '@/components/BeforeAfter';
import Testimonials from '@/components/Testimonials';
import Timeline from '@/components/Timeline';
import FAQ from '@/components/FAQ';
import Appointment from '@/components/Appointment';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import AppointmentModal from '@/components/AppointmentModal';

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <TrustStats />
      <WhyChooseUs />
      <Services />
      <ClinicTour />
      <DoctorTeam />
      <BeforeAfter />
      <Testimonials />
      <Timeline />
      <FAQ />
      <Appointment />
      <Contact />
      <Footer />
      <AppointmentModal />
    </>
  );
}
