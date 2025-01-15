// app/layout.tsx
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
}

export const metadata: Metadata = {
  metadataBase: new URL('https://omega3gpt.pl'),
  title: "Omega3 GPT",
  description: "Chatbot z badaniami klinicznymi na temat kwasów omega-3",
  applicationName: 'Omega3 GPT',
  authors: [{ name: 'MarcinMove37ai' }],
  manifest: '/manifest.json',
  icons: {
    // Standard favicon
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    // Apple Touch Icon
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    // Android Chrome
    shortcut: ['/shortcut-icon.png'],
    // Windows Metro
    other: [
      {
        rel: 'mask-icon',
        url: '/safari-pinned-tab.svg',
        color: '#1e3a8a'
      }
    ]
  },
  // Open Graph - zoptymalizowane dla social media
  openGraph: {
    type: 'website',
    url: '/',
    siteName: 'Omega3 GPT',
    locale: 'pl_PL',
    title: 'Omega3 GPT - Chatbot z badaniami klinicznymi',
    description: 'Chatbot z badaniami klinicznymi na temat kwasów omega-3',
    images: [{
      url: '/og-image.png',
      width: 1200,
      height: 630,
      alt: 'Omega3 GPT Preview',
      type: 'image/png',
    }],
  },
  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'Omega3 GPT',
    description: 'Chatbot z badaniami klinicznymi na temat kwasów omega-3',
    images: ['/og-image.png'], // Używamy tego samego obrazka co dla OG
  },
  // Dodatkowe meta tagi dla lepszego SEO
  keywords: 'omega3, chatbot, badania kliniczne, sztuczna inteligencja, zdrowie',
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: 'google-site-verification',
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl">
      <head>
        <meta property="og:image:secure_url" content="https://omega3gpt.pl/og-image.png" />
        <meta property="og:image:type" content="image/png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}