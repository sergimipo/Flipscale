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

export const metadata: Metadata = {
  title: 'Flipscale — Inteligencia para revendedores',
  description:
    'Controla ingresos y gastos de Vinted, Wallapop y Etsy en tiempo real. Más inteligencia. Más crecimiento. Más beneficios.',
  manifest: '/manifest.json',
  icons: { icon: '/icon.svg', apple: '/icon-192.png' },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Flipscale',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="theme-color" content="#0B1220" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
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
      </head>
      <body className={`${inter.variable} ${space.variable} font-sans`}>
        {children}
        <BottomNav />
      </body>
    </html>
  );
}