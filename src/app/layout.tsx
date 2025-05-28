import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import MouseTrail from '@/components/effects/MouseTrail';
import StormBackground from '@/components/effects/StormBackground';

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700', '800'],
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'WebiconDesign - Your Project Services Platform',
  description: 'WebiconDesign: Your platform for expert project services, connecting businesses with top talent and providing tools for seamless collaboration and success.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${poppins.variable} font-sans antialiased`}>
        <StormBackground />
        <MouseTrail />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
