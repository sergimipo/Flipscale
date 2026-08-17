import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const space = Space_Grotesk({ subsets: ['latin'], variable: '--font-space', weight: ['400', '500', '600', '700'] });

export const metadata: Metadata = {
  title: 'Flipscale — Inteligencia para revendedores',
  description:
    'Controla ingresos y gastos de Vinted, Wallapop y Etsy en tiempo real. Más inteligencia. Más crecimiento. Más beneficios.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${inter.variable} ${space.variable} font-sans`}>{children}</body>
    </html>
  );
}