import './globals.css';

export const metadata = {
  title: 'Silver Smile Dental | Premium Dental Care in Rajkot',
  description: 'Silver Smile Dental Specialists - Rajkot\'s premier dental clinic offering advanced dental implants, Invisalign, smile makeover, root canal treatment, and comprehensive dental care with cutting-edge technology.',
  keywords: 'dentist rajkot, dental clinic rajkot, dental implants, invisalign, smile makeover, root canal, teeth whitening, orthodontist rajkot, best dentist rajkot, silver smile dental',
  authors: [{ name: 'Silver Smile Dental Specialists' }],
  openGraph: {
    title: 'Silver Smile Dental | Premium Dental Care in Rajkot',
    description: 'Experience world-class dental care at Silver Smile Dental Specialists. Advanced technology, expert doctors, and compassionate care for your perfect smile.',
    url: 'https://silversmiledental.in',
    siteName: 'Silver Smile Dental Specialists',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Silver Smile Dental Specialists - Premium Dental Care',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Silver Smile Dental | Premium Dental Care in Rajkot',
    description: 'Experience world-class dental care at Silver Smile Dental Specialists.',
    images: ['/images/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Dentist',
    name: 'Silver Smile Dental Specialists',
    description: 'Premium dental clinic in Rajkot offering advanced dental implants, Invisalign, smile makeover, and comprehensive dental care.',
    url: 'https://silversmiledental.in',
    telephone: '+919429051771',
    email: 'silversmiledentalrjt@gmail.com',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '303 RK Supreme, Near Nana Mava Circle, 150 Ft Ring Road',
      addressLocality: 'Rajkot',
      addressRegion: 'Gujarat',
      postalCode: '360005',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '22.2827',
      longitude: '70.7826',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '09:00',
        closes: '20:00',
      },
    ],
    priceRange: '₹₹',
    image: '/images/og-image.jpg',
  };

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
