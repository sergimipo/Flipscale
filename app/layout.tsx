import type { Metadata } from 'next';
import { Inter, Sora, Fraunces } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const sora = Sora({ subsets: ['latin'], variable: '--font-sora', weight: ['400', '600', '700', '800'] });
const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-fraunces', weight: ['400', '500', '600'] });

export const metadata: Metadata = {
  title: 'Flipscale — Inteligencia para revendedores',
  description:
    'Controla ingresos y gastos de Vinted, Wallapop y Etsy en tiempo real. Más inteligencia. Más crecimiento. Más beneficios.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${inter.variable} ${sora.variable} ${fraunces.variable} font-sans`}>{children}</body>
    </html>
  );
}