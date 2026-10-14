import Link from 'next/link';
import type { ReactNode } from 'react';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { Logo } from '@/components/brand/logo';
import { Scene } from '@/components/marketing/scene';
import { LanguageSwitcher } from '@/components/ui/language-switcher';
import { getT } from '@/lib/i18n/server';

export default async function AuthLayout({ children }: { children: ReactNode }) {
  const t = await getT();

  return (
    <div className="min-h-dvh bg-canvas p-3 sm:p-5">
      <div className="mx-auto grid min-h-[calc(100dvh-1.5rem)] max-w-[1280px] gap-5 lg:grid-cols-[1.05fr_1fr]">
        {/* Brand panel */}
        <aside className="relative hidden overflow-hidden rounded-2xl lg:block">
          <Scene variant="sanctuary" className="absolute inset-0 size-full" />
          <div
            className="absolute inset-0"
            style={{ background: 'var(--hero-overlay)' }}
          />
          <div className="relative flex h-full flex-col justify-between p-10">
            <div className="flex items-center justify-between gap-4">
              <Link href="/" aria-label="Back to home">
                <Logo variant="contrast" size={44} />
              </Link>
              <LanguageSwitcher variant="contrast" />
            </div>

            <div>
              <p className="font-display text-[2.5rem] leading-tight font-extrabold text-white">
                {t('auth.verse')}
              </p>
              <p className="mt-3 text-sm font-medium text-white/70">
                {t('auth.verseRef')}
              </p>

              <div className="mt-10 flex items-center gap-3 rounded-xl bg-white/10 p-4 ring-1 ring-white/15 backdrop-blur">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white/15 text-white">
                  <ShieldCheck className="size-5" />
                </span>
                <p className="text-[0.8125rem] leading-relaxed text-white/85">
                  {t('auth.safetyNote')}
                </p>
              </div>
            </div>

            <p className="text-xs text-white/60">
              © {new Date().getFullYear()} {t('brand.church')}
            </p>
          </div>
        </aside>

        {/* Form panel */}
        <main className="flex flex-col justify-center rounded-2xl bg-surface px-5 py-10 shadow-card sm:px-10">
          <div className="mx-auto w-full max-w-[420px]">
            <div className="mb-8 flex items-center justify-between gap-3 lg:hidden">
              <Link href="/">
                <Logo size={38} subtitle={null} />
              </Link>
              <div className="flex items-center gap-2">
                <LanguageSwitcher variant="compact" />
                <Link
                  href="/"
                  className="inline-flex items-center gap-1.5 text-[0.8125rem] font-semibold text-muted hover:text-brand-700"
                >
                  <ArrowLeft className="size-4" />
                  {t('auth.backHome')}
                </Link>
              </div>
            </div>

            <div className="mb-6 hidden justify-end lg:flex">
              <LanguageSwitcher />
            </div>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
