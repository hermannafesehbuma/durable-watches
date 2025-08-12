import { Geist, Geist_Mono, DM_Sans, Lora } from 'next/font/google';
import './globals.css';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { CartProvider } from '@/contexts/cart-context';
import { FavoritesProvider } from '@/contexts/favorites-context';
import { AuthProvider } from '@/contexts/auth-context';
import RevalidationProvider from '@/components/revalidation-provider';
import { Toaster } from 'react-hot-toast';
import type { Metadata } from 'next';

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: '100',
  variable: '--font-dm-sans',
});

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const lora = Lora({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-lora',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default:
      'Rolex - Premium Luxury Watches | Authentic Rolex & Fine Timepieces',
    template: '%s | Rollex - Luxury Watch Collection',
  },
  description:
    'Discover authentic Rolex watches and premium luxury timepieces at Rollex. Shop certified pre-owned and new watches with guaranteed authenticity, expert craftsmanship, and timeless elegance. Free shipping and warranty included.',
  keywords: [
    'Rolex watches',
    'luxury watches',
    'premium timepieces',
    'authentic Rolex',
    'certified pre-owned watches',
    'luxury watch collection',
    'Swiss watches',
    'watch dealer',
    'Rollex',
    'fine jewelry',
    'watch investment',
    'luxury accessories',
  ],
  authors: [{ name: 'Rollex' }],
  creator: 'Rollex',
  publisher: 'Rolex',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://durablewatchessale.com'), // Replace with your actual domain
  alternates: {
    canonical: '/',
  },
  // Favicon configuration
  icons: {
    icon: [
      { url: '/logo.png', sizes: '32x32', type: 'image/png' },
      { url: '/logo.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [{ url: '/logo.png', sizes: '180x180', type: 'image/png' }],
    shortcut: '/logo.png',
  },
  openGraph: {
    title: 'Rolex - Premium Luxury Watches | Authentic Rolex & Fine Timepieces',
    description:
      'Discover authentic Rolex watches and premium luxury timepieces at Rollex. Shop certified pre-owned and new watches with guaranteed authenticity and expert craftsmanship.',
    url: 'https://durablewatchessale.com', // Replace with your actual domain
    siteName: 'Durable Watches For Sale',
    images: [
      {
        url: '/hero3.jpg',
        width: 1200,
        height: 630,
        alt: 'Rolex - Premium Luxury Rolex Watches Collection',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rolex - Premium Luxury Watches | Authentic Rolex & Fine Timepieces',
    description:
      'Discover authentic Rolex watches and premium luxury timepieces at Rollex. Shop certified pre-owned and new watches with guaranteed authenticity.',
    images: ['/hero3.jpg'],
    creator: '@rolexdurablewatches', // Replace with your actual Twitter handle
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // google: 'your-google-verification-code', // Replace with your actual Google verification code
    // yandex: 'your-yandex-verification-code',
    // yahoo: 'your-yahoo-verification-code',
  },
  category: 'luxury goods',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Additional SEO meta tags */}
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="apple-mobile-web-app-title" content="Rollex" />

        {/* Structured Data for Local Business */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Store',
              name: 'Rolex',
              description:
                'Premium luxury watch dealer specializing in authentic Rolex and fine timepieces',
              url: 'https://durablewatchessale.com',
              logo: 'https://durablewatchessale.com/logo.png',
              image: 'https://durablewatchessale.com/hero3.jpg',
              priceRange: '$$$',
              currenciesAccepted: 'USD',
              paymentAccepted: 'CryptoCurrency, Zelle, Bank Transfer',
              hasOfferCatalog: {
                '@type': 'OfferCatalog',
                name: 'Luxury Watch Collection',
                itemListElement: [
                  {
                    '@type': 'Offer',
                    itemOffered: {
                      '@type': 'Product',
                      name: 'Rolex Watches',
                      category: 'Luxury Watches',
                    },
                  },
                ],
              },
            }),
          }}
        />

        {/* Product Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Product',
              name: 'Luxury Rolex Watch Collection',
              description:
                'Authentic Rolex watches with certified authenticity and expert craftsmanship',
              brand: {
                '@type': 'Brand',
                name: 'Rolex',
              },
              category: 'Luxury Watches',
              image: 'https://durablewatchessale.com/hero3.jpg',
              offers: {
                '@type': 'AggregateOffer',
                priceCurrency: 'USD',
                lowPrice: '5000',
                highPrice: '50000',
                offerCount: '100',
              },
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${dmSans.variable} ${lora.variable}`}
      >
        <AuthProvider>
          <CartProvider>
            <FavoritesProvider>
              <RevalidationProvider>
                <Header />
                {children}
                <Footer />
                <Toaster
                  position="top-right"
                  toastOptions={{
                    duration: 4000,
                    style: {
                      background: '#363636',
                      color: '#fff',
                    },
                  }}
                />
              </RevalidationProvider>
            </FavoritesProvider>
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
