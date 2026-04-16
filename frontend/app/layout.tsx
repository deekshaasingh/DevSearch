import type { Metadata } from 'next';
import { Playfair_Display, DM_Mono, Outfit } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import AmbientBackground from '@/components/AmbientBackground';
import CustomCursor from '@/components/CustomCursor';

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-outfit',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
});

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-dm-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'DevSearch — Discover GitHub Repositories',
  description:
    'Semantic search across thousands of GitHub repositories. Natural language queries. Intelligent TF-IDF ranking.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
  <body className={`${outfit.variable} ${playfair.variable}`}>
  <CustomCursor />   {/* ADD THIS */}
  <AmbientBackground />  {/* optional but recommended */}
  {children}
</body>
</html>
  );
}


