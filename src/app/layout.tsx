import type { Metadata, Viewport } from 'next';
import { Inter, Noto_Sans_Ethiopic, Plus_Jakarta_Sans } from 'next/font/google';
import { LocaleProvider } from '@/lib/i18n/client';
import { getLocale, getT } from '@/lib/i18n/server';
import { localeMeta } from '@/lib/i18n/config';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const display = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-display',
  display: 'swap',
});

/** Ethiopic script support — always loaded so Amharic renders in both languages. */
const ethiopic = Noto_Sans_Ethiopic({
  subsets: ['ethiopic'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-ethiopic',
  display: 'swap',
});

export async function generateMetadata(): Promise<Metadata> {
  const t = await getT();
  const name = t('brand.name');

  return {
    title: {
      default: `${name} · ${t('brand.ministry')}`,
      template: `%s · ${name}`,
    },
    description: t('brand.description'),
    applicationName: `${name} ${t('brand.ministry')}`,
    icons: { icon: '/brand/logo-transparent.png' },
  };
}

export const viewport: Viewport = {
  themeColor: '#2f5d2a',
  width: 'device-width',
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale();

  return (
    <html
      lang={locale}
      dir={localeMeta[locale].dir}
      data-locale={locale}
      className={`${inter.variable} ${display.variable} ${ethiopic.variable}`}
    >
      <body className="antialiased">
        <LocaleProvider locale={locale}>{children}</LocaleProvider>
      </body>
    </html>
  );
}
