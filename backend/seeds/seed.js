/**
 * Database Seed Script
 * Populates MongoDB with default data:
 * - Admin user
 * - Clinic information (Silver Smile, Rajkot)
 * - 8 dental services
 * - 3 doctors
 * - 6 patient reviews
 * - 8 FAQs
 *
 * Run: node seeds/seed.js
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Load environment config
const { MONGODB_URI, ADMIN_EMAIL, ADMIN_PASSWORD } = require('../config/env');

// Import models
const User = require('../models/User');
const ClinicInfo = require('../models/ClinicInfo');
const Service = require('../models/Service');
const Doctor = require('../models/Doctor');
const Review = require('../models/Review');
const FAQ = require('../models/FAQ');

// ==========================================
// Seed Data
// ==========================================

const adminUser = {
  name: 'Admin',
  email: ADMIN_EMAIL,
  password: ADMIN_PASSWORD,
  role: 'superadmin',
};

const clinicInfo = {
  clinicName: 'Silver Smile Dental',
  tagline: 'Your Smile, Our Priority',
  phone: '+919429051771',
  whatsapp: '+919429051771',
  email: 'info@silversmiledental.in',
  address: {
    street: '303, RK Supreme',
    area: 'Kalawad Road',
    city: 'Rajkot',
    state: 'Gujarat',
    pincode: '360005',
  },
  workingHours: [
    { day: 'Monday', hours: '9:00 AM - 1:00 PM, 4:00 PM - 8:00 PM', isOpen: true },
    { day: 'Tuesday', hours: '9:00 AM - 1:00 PM, 4:00 PM - 8:00 PM', isOpen: true },
    { day: 'Wednesday', hours: '9:00 AM - 1:00 PM, 4:00 PM - 8:00 PM', isOpen: true },
    { day: 'Thursday', hours: '9:00 AM - 1:00 PM, 4:00 PM - 8:00 PM', isOpen: true },
    { day: 'Friday', hours: '9:00 AM - 1:00 PM, 4:00 PM - 8:00 PM', isOpen: true },
    { day: 'Saturday', hours: '9:00 AM - 1:00 PM, 4:00 PM - 8:00 PM', isOpen: true },
    { day: 'Sunday', hours: 'Closed', isOpen: false },
  ],
  socialLinks: {
    facebook: 'https://facebook.com/silversmiledental',
    instagram: 'https://instagram.com/silversmiledental',
    twitter: '',
    linkedin: '',
    youtube: '',
  },
  stats: {
    patientsServed: 5000,
    yearsExperience: 10,
    specialists: 5,
    successRate: 98,
  },
  aboutText: 'Silver Smile Dental Clinic is a state-of-the-art dental facility located in the heart of Rajkot, Gujarat. We are committed to providing the highest quality dental care in a comfortable and welcoming environment. Our team of experienced dentists and specialists use the latest technology to ensure the best outcomes for our patients. From routine check-ups to complex procedures, we offer comprehensive dental solutions for the entire family.',
};

const services = [
  {
    title: 'General Dentistry',
    description: 'Comprehensive dental check-ups, cleanings, and preventive care to maintain your oral health. Our general dentistry services include regular examinations, professional cleaning, fluoride treatments, and dental sealants.',
    shortDescription: 'Complete dental check-ups and preventive care',
    category: 'general',
    icon: 'FaTooth',
    order: 1,
  },
  {
    title: 'Teeth Whitening',
    description: 'Professional teeth whitening treatments to brighten your smile. We use advanced whitening techniques that are safe, effective, and provide long-lasting results. Get a brighter, more confident smile in just one visit.',
    shortDescription: 'Professional whitening for a brighter smile',
    category: 'cosmetic',
    icon: 'FaStar',
    order: 2,
  },
  {
    title: 'Dental Implants',
    description: 'Permanent tooth replacement solutions using titanium implants. Dental implants look, feel, and function like natural teeth. Our skilled surgeons ensure precise placement for optimal results and long-term success.',
    shortDescription: 'Permanent tooth replacement solutions',
    category: 'surgery',
    icon: 'FaCog',
    order: 3,
  },
  {
    title: 'Orthodontics / Braces',
    description: 'Straighten your teeth with modern orthodontic treatments including traditional braces, ceramic braces, and clear aligners. We create personalized treatment plans for patients of all ages.',
    shortDescription: 'Teeth straightening and alignment correction',
    category: 'orthodontics',
    icon: 'FaTeethOpen',
    order: 4,
  },
  {
    title: 'Root Canal Treatment',
    description: 'Save your natural teeth with our painless root canal therapy. Using advanced techniques and modern anesthesia, we ensure a comfortable experience while treating infected tooth pulp and preventing further damage.',
    shortDescription: 'Painless root canal therapy',
    category: 'general',
    icon: 'FaSyringe',
    order: 5,
  },
  {
    title: 'Cosmetic Dentistry',
    description: 'Transform your smile with veneers, bonding, smile makeovers, and more. Our cosmetic dentistry services are designed to enhance the appearance of your teeth and give you the smile you have always dreamed of.',
    shortDescription: 'Smile makeovers and aesthetic treatments',
    category: 'cosmetic',
    icon: 'FaSmile',
    order: 6,
  },
  {
    title: 'Pediatric Dentistry',
    description: 'Specialized dental care for children in a friendly and comfortable environment. Our pediatric dentists are trained to handle the unique dental needs of children, from first tooth care to adolescent dentistry.',
    shortDescription: 'Child-friendly dental care',
    category: 'pediatric',
    icon: 'FaChild',
    order: 7,
  },
  {
    title: 'Oral Surgery',
    description: 'Comprehensive oral surgery services including wisdom tooth extraction, jaw surgery, and dental trauma treatment. Our oral surgeons are highly experienced in performing both simple and complex surgical procedures.',
    shortDescription: 'Wisdom tooth extraction and jaw surgery',
    category: 'surgery',
    icon: 'FaCut',
    order: 8,
  },
];

const doctors = [
  {
    name: 'Dr. Rajesh Patel',
    qualification: 'BDS, MDS (Orthodontics)',
    specialization: 'Orthodontics & Smile Design',
    experience: 12,
    description: 'Dr. Rajesh Patel is a highly experienced orthodontist with over 12 years of expertise in teeth alignment and smile design. He is known for his gentle approach and exceptional results with braces and aligners.',
    socialLinks: {
      facebook: 'https://facebook.com',
      instagram: 'https://instagram.com',
      linkedin: 'https://linkedin.com',
      twitter: '',
    },
    isActive: true,
    order: 1,
  },
  {
    name: 'Dr. Priya Sharma',
    qualification: 'BDS, MDS (Endodontics)',
    specialization: 'Root Canal & Restorative Dentistry',
    experience: 8,
    description: 'Dr. Priya Sharma specializes in endodontics and restorative dentistry. With 8 years of experience, she is an expert in painless root canal treatments and dental restorations using the latest technology.',
    socialLinks: {
      facebook: 'https://facebook.com',
      instagram: 'https://instagram.com',
      linkedin: '',
      twitter: '',
    },
    isActive: true,
    order: 2,
  },
  {
    name: 'Dr. Amit Desai',
    qualification: 'BDS, MDS (Oral Surgery)',
    specialization: 'Oral & Maxillofacial Surgery',
    experience: 15,
    description: 'Dr. Amit Desai is a renowned oral and maxillofacial surgeon with 15 years of experience. He specializes in dental implants, wisdom tooth extractions, and complex jaw surgeries with a track record of successful outcomes.',
    socialLinks: {
      facebook: 'https://facebook.com',
      instagram: 'https://instagram.com',
      linkedin: 'https://linkedin.com',
      twitter: 'https://twitter.com',
    },
    isActive: true,
    order: 3,
  },
];

const reviews = [
  {
    patientName: 'Meera Joshi',
    rating: 5,
    review: 'Excellent experience! Dr. Patel did an amazing job with my braces. The entire team is very professional and caring. Highly recommended for anyone looking for quality dental care in Rajkot.',
    service: 'Orthodontics',
    isActive: true,
  },
  {
    patientName: 'Ravi Kumar',
    rating: 5,
    review: 'Had a painless root canal treatment here. Dr. Priya was very gentle and explained every step. The clinic is clean, modern, and well-equipped. Five stars all the way!',
    service: 'Root Canal Treatment',
    isActive: true,
  },
  {
    patientName: 'Anjali Shah',
    rating: 4,
    review: 'Very happy with my teeth whitening results. My smile looks so much brighter now. The staff is friendly and the appointment was on time. Will definitely come back.',
    service: 'Teeth Whitening',
    isActive: true,
  },
  {
    patientName: 'Karan Mehta',
    rating: 5,
    review: 'Got dental implants done by Dr. Desai. The procedure was smooth and the results are fantastic. My new teeth look completely natural. Thank you, Silver Smile!',
    service: 'Dental Implants',
    isActive: true,
  },
  {
    patientName: 'Nisha Patel',
    rating: 5,
    review: 'Best dental clinic in Rajkot! We bring our whole family here. The pediatric care for our kids is exceptional. Dr. Patel and the team are always so patient and kind.',
    service: 'Pediatric Dentistry',
    isActive: true,
  },
  {
    patientName: 'Vikram Singh',
    rating: 4,
    review: 'Had my wisdom teeth removed here. Was very nervous but Dr. Desai made me feel comfortable throughout. Recovery was quick and the follow-up care was great.',
    service: 'Oral Surgery',
    isActive: true,
  },
];

const faqs = [
  {
    question: 'What are your clinic hours?',
    answer: 'We are open Monday to Saturday from 9:00 AM to 1:00 PM and 4:00 PM to 8:00 PM. We are closed on Sundays. For emergencies, please call our helpline.',
    category: 'general',
    order: 1,
  },
  {
    question: 'Do I need an appointment or can I walk in?',
    answer: 'While we do accept walk-in patients, we recommend booking an appointment in advance to ensure minimal wait time. You can book online through our website or call us at +919429051771.',
    category: 'general',
    order: 2,
  },
  {
    question: 'Is teeth whitening safe?',
    answer: 'Yes, professional teeth whitening performed at our clinic is completely safe. We use clinically proven products and techniques that protect your enamel while effectively whitening your teeth.',
    category: 'cosmetic',
    order: 3,
  },
  {
    question: 'How long do dental implants last?',
    answer: 'With proper care and maintenance, dental implants can last a lifetime. They are designed to be a permanent solution for missing teeth. Regular dental check-ups and good oral hygiene are essential for implant longevity.',
    category: 'surgery',
    order: 4,
  },
  {
    question: 'Are root canals painful?',
    answer: 'Modern root canal treatments are virtually painless. We use advanced anesthesia techniques to ensure your complete comfort during the procedure. Most patients report feeling no pain during treatment.',
    category: 'general',
    order: 5,
  },
  {
    question: 'What insurance plans do you accept?',
    answer: 'We accept most major dental insurance plans. Please contact our front desk or call us to verify your specific insurance coverage before your appointment.',
    category: 'general',
    order: 6,
  },
  {
    question: 'At what age should I bring my child for their first dental visit?',
    answer: 'We recommend bringing your child for their first dental visit by age 1 or within 6 months of their first tooth appearing. Early dental visits help establish good oral health habits and allow us to catch any issues early.',
    category: 'pediatric',
    order: 7,
  },
  {
    question: 'How often should I visit the dentist?',
    answer: 'We recommend visiting the dentist every 6 months for regular check-ups and professional cleanings. However, if you have specific dental concerns or conditions, more frequent visits may be necessary.',
    category: 'general',
    order: 8,
  },
];

// ==========================================
// Seed Function
// ==========================================

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('\n🗑️  Clearing existing data...');
    await Promise.all([
      User.deleteMany({}),
      ClinicInfo.deleteMany({}),
      Service.deleteMany({}),
      Doctor.deleteMany({}),
      Review.deleteMany({}),
      FAQ.deleteMany({}),
    ]);
    console.log('✅ Existing data cleared');

    // Seed Admin User
    console.log('\n👤 Creating admin user...');
    const createdUser = await User.create(adminUser);
    console.log(`✅ Admin user created: ${createdUser.email}`);

    // Seed Clinic Info
    console.log('\n🏥 Creating clinic information...');
    const createdClinic = await ClinicInfo.create(clinicInfo);
    console.log(`✅ Clinic info created: ${createdClinic.clinicName}`);

    // Seed Services
    console.log('\n🦷 Creating services...');
    const createdServices = await Service.insertMany(services);
    console.log(`✅ ${createdServices.length} services created`);

    // Seed Doctors
    console.log('\n👨‍⚕️ Creating doctors...');
    const createdDoctors = await Doctor.insertMany(doctors);
    console.log(`✅ ${createdDoctors.length} doctors created`);

    // Seed Reviews
    console.log('\n⭐ Creating reviews...');
    const createdReviews = await Review.insertMany(reviews);
    console.log(`✅ ${createdReviews.length} reviews created`);

    // Seed FAQs
    console.log('\n❓ Creating FAQs...');
    const createdFAQs = await FAQ.insertMany(faqs);
    console.log(`✅ ${createdFAQs.length} FAQs created`);

    // Summary
    console.log('\n==========================================');
    console.log('🎉 Database seeded successfully!');
    console.log('==========================================');
    console.log(`  Admin Email:    ${ADMIN_EMAIL}`);
    console.log(`  Admin Password: ${ADMIN_PASSWORD}`);
    console.log(`  Services:       ${createdServices.length}`);
    console.log(`  Doctors:        ${createdDoctors.length}`);
    console.log(`  Reviews:        ${createdReviews.length}`);
    console.log(`  FAQs:           ${createdFAQs.length}`);
    console.log('==========================================\n');

    // Disconnect
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Seeding failed:', error.message);
    console.error(error);
    await mongoose.disconnect();
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();
