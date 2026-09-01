import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import BottomNav from './components/BottomNav';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const space = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space',
  weight: ['400', '500', '600', '700'],
});

// Viewport oficial de Next: garantiza viewport-fit=cover y theme-color
export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#0B1220',
};

export const metadata: Metadata = {
  title: 'Flipscale — Inteligencia para revendedores',
  description:
    'Controla ingresos y gastos de Vinted, Wallapop y Etsy en tiempo real. Más inteligencia. Más crecimiento. Más beneficios.',
  manifest: '/manifest.json',
  icons: { icon: '/icon.svg', apple: '/icon-192.png' },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black',
    title: 'Flipscale',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${inter.variable} ${space.variable} font-sans`}>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                try {
                  var t = localStorage.getItem('fs-theme');
                  document.documentElement.style.backgroundColor = t === 'light' ? '#F8FAFC' : '#0B1220';
                } catch (e) {
                  document.documentElement.style.backgroundColor = '#0B1220';
                }
              })();
            `,
          }}
        />
        {children}
        <BottomNav />
      </body>
    </html>
  );
}