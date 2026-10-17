import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://digitalmenu.devvoltz.com";

export const viewport: Viewport = {
  themeColor: "#00E564",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "DigitalMenu — Next-Gen QR Dining & Interactive Restaurant Menus",
    template: "%s | DigitalMenu",
  },
  description:
    "Transform your dining experience with instant contactless QR menus, live table ordering, and mobile app installation for restaurants, cafes, and bars.",
  applicationName: "DigitalMenu",
  authors: [{ name: "DevVoltz Technology", url: "https://devvoltz.com" }],
  creator: "DevVoltz Technology",
  publisher: "DigitalMenu by DevVoltz",
  keywords: [
    "Digital Menu",
    "QR Code Menu",
    "Contactless Dining",
    "Smart Table Ordering",
    "Restaurant Digital Menu Maker",
    "BGS Chicken Restaurant",
    "Addis Ababa Restaurants",
    "Ethiopia Digital Menu",
    "Telebirr Restaurant QR",
    "Interactive Restaurant Menu",
    "Mobile Restaurant App",
    "PWA Food Menu",
  ],
  alternates: {
    canonical: siteUrl,
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "DigitalMenu",
  },
  formatDetection: {
    telephone: true,
    date: false,
    address: true,
    email: true,
  },
  icons: {
    icon: [
      { url: "/logo.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/logo.png",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    title: "DigitalMenu — Smart QR Dining & Mobile Food Menus",
    description:
      "Instant contactless dining with live table ordering, dish previews, and 1-tap mobile app installation.",
    siteName: "DigitalMenu",
    images: [
      {
        url: "/hero_qr_dining.jpg",
        width: 1200,
        height: 630,
        alt: "DigitalMenu Smart Contactless Dining Experience",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DigitalMenu — Smart QR Dining & Mobile Food Menus",
    description:
      "Instant contactless dining with live table ordering, dish previews, and 1-tap mobile app installation.",
    images: ["/hero_qr_dining.jpg"],
    creator: "@devvoltz",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const structuredDataPlatform = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "@id": `${siteUrl}/#software`,
      name: "DigitalMenu",
      applicationCategory: "BusinessApplication",
      operatingSystem: "All, iOS, Android, Web",
      description:
        "Modern QR-based interactive digital menu system with live table ordering and PWA mobile app installability.",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "ETB",
        availability: "https://schema.org/InStock",
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.9",
        ratingCount: "128",
      },
    },
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "DigitalMenu by DevVoltz",
      url: siteUrl,
      logo: `${siteUrl}/logo.png`,
      sameAs: ["https://devvoltz.com"],
      contactPoint: {
        "@type": "ContactPoint",
        telephone: "+251962935163",
        contactType: "customer service",
        availableLanguage: ["English", "Amharic"],
      },
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "DigitalMenu",
      publisher: {
        "@id": `${siteUrl}/#organization`,
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.webmanifest" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="DigitalMenu" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredDataPlatform) }}
        />
      </head>
      <body className="font-sans antialiased bg-[#faf8fc] text-slate-800">
        {children}
        <Toaster position="top-right" />

        {/* PWA Service Worker Registration */}
        <Script id="register-sw" strategy="afterInteractive">
          {`
            if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js').then(
                  function(registration) {
                    console.log('DigitalMenu Service Worker registered with scope: ', registration.scope);
                  },
                  function(err) {
                    console.log('ServiceWorker registration failed: ', err);
                  }
                );
              });
            }
          `}
        </Script>
      </body>
    </html>
  );
}
