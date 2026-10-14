'use client';

import { useTransition } from 'react';
import { Globe } from 'lucide-react';
import { setLocale } from '@/lib/actions/locale';
import { locales, localeMeta, type Locale } from '@/lib/i18n/config';
import { useLocale, useT } from '@/lib/i18n/client';
import { cn } from '@/lib/utils';

/**
 * English ⇄ አማርኛ switch. Writes a cookie through a server action and refreshes
 * so both server and client components re-render in the chosen language.
 */
export function LanguageSwitcher({
  variant = 'default',
  className,
}: {
  variant?: 'default' | 'contrast' | 'compact';
  className?: string;
}) {
  const current = useLocale();
  const t = useT();
  const [isPending, startTransition] = useTransition();

  function choose(locale: Locale) {
    if (locale === current || isPending) return;
    startTransition(async () => {
      await setLocale(locale);
      // A hard reload, deliberately: `router.refresh()` leaves Next's client
      // router cache intact, so previously visited pages would come back in
      // the old language. Reloading guarantees one consistent language.
      window.location.reload();
    });
  }

  const onContrast = variant === 'contrast';

  return (
    <div
      role="group"
      aria-label={t('language.choose')}
      title={t('language.choose')}
      className={cn(
        'inline-flex items-center gap-0.5 rounded-full p-0.5',
        onContrast ? 'bg-white/15 ring-1 ring-white/25 backdrop-blur' : 'bg-canvas',
        isPending && 'opacity-60',
        className,
      )}
    >
      {variant !== 'compact' ? (
        <Globe
          aria-hidden
          className={cn(
            'ml-2 size-3.5 shrink-0',
            onContrast ? 'text-white/80' : 'text-muted',
          )}
        />
      ) : null}

      {locales.map((locale) => {
        const active = locale === current;
        return (
          <button
            key={locale}
            type="button"
            onClick={() => choose(locale)}
            aria-pressed={active}
            lang={locale}
            className={cn(
              'rounded-full px-2.5 py-1.5 text-[0.75rem] font-bold transition-colors',
              active
                ? onContrast
                  ? 'bg-white text-brand-800'
                  : 'bg-brand-700 text-white'
                : onContrast
                  ? 'text-white/80 hover:text-white'
                  : 'text-muted hover:text-brand-800',
            )}
          >
            {localeMeta[locale].short}
          </button>
        );
      })}
    </div>
  );
}
