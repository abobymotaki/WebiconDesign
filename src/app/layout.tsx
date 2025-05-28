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
  title: 'WebiconDesign - Expert Project Services by Our Team',
  description: 'WebiconDesign: A dedicated team offering expert project services. We bring collective expertise to ensure seamless collaboration and successful outcomes for your projects.',
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
