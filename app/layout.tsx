import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FlipScale | Escala tu negocio de reventa',
  description: 'Automatiza descripciones con IA, elimina metadatos de fotos y organiza tu inventario para vender más en Vinted, Wallapop y eBay.',
  openGraph: {
    title: 'FlipScale',
    description: 'La herramienta definitiva para revendedores profesionales.',
    images: ['/og-image.png'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FlipScale',
    description: 'Automatiza tu reventa con IA.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>{children}</body>
    </html>
  );
}