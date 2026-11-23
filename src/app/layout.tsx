import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Agenda 2027 · Grand Hotel De Djokja',
  description: 'Budaya, kuliner, dan pertemuan komunitas di Grand Hotel De Djokja, Yogyakarta.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
  themeColor: '#12100E',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="min-h-screen flex flex-col bg-[#12100E] text-ivory antialiased selection:bg-brass selection:text-ink">
        {children}
      </body>
    </html>
  );
}
