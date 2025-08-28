// app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import TanStackProvider from '@/components/TanStackProvider/TanStackProvider';
import { Roboto, Geist, Geist_Mono } from 'next/font/google';

const roboto = Roboto({
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
});

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const metadata: Metadata = {
  title: 'NoteHub',
  description: 'NoteHub — create, manage, and organize your personal and work notes with ease.',
  openGraph: {
    title: 'NoteHub',
    description: 'NoteHub — create, manage, and organize your personal and work notes with ease.',
    url: SITE_URL,
    images: [
      {
        url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
        width: 1200,
        height: 630,
        alt: 'NoteHub App Preview',
      },
    ],
  },
};

export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${roboto.variable} ${geistSans.variable} ${geistMono.variable}`}>
        <TanStackProvider>
          <div className="layout">
            <Header />
            {children}
            {modal}
            <Footer />
          </div>
        </TanStackProvider>
      </body>
    </html>
  );
}
