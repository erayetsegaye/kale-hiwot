'use client';

import { useTransition } from 'react';
import { GraduationCap, RefreshCw } from 'lucide-react';
import { clearTeachingBand, setTeachingBand } from '@/lib/actions/teaching';
import { ageBandLabel } from '@/lib/labels';
import { useT } from '@/lib/i18n/client';
import type { AgeBand } from '@/lib/types';
import { cn } from '@/lib/utils';

/**
 * Strip at the top of the teacher area: the age group being taught, and the
 * other groups to switch to. Age group only — no class names.
 */
export function TeachingGroupSwitcher({
  band,
  available,
}: {
  band: AgeBand;
  available: AgeBand[];
}) {
  const [isPending, startTransition] = useTransition();
  const t = useT();

  return (
    <div className="no-print mb-5 flex flex-wrap items-center gap-3 rounded-lg bg-surface px-4 py-3 shadow-card">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-brand-700 text-white">
        <GraduationCap className="size-[1.1rem]" />
      </span>

      <div className="min-w-0">
        <p className="text-[0.625rem] font-bold tracking-[0.12em] text-faint uppercase">
          {t('teaching.nowTeaching')}
        </p>
        <p className="truncate text-[0.9375rem] font-bold text-ink">
          {ageBandLabel[band]}
        </p>
      </div>

      <div className="ml-auto flex flex-wrap items-center gap-1.5">
        {available.map((option) => (
          <button
            key={option}
            type="button"
            disabled={isPending || option === band}
            onClick={() => startTransition(async () => void (await setTeachingBand(option)))}
            className={cn(
              'rounded-full px-3 py-1.5 text-[0.75rem] font-semibold transition-colors',
              option === band
                ? 'bg-brand-700 text-white'
                : 'bg-canvas text-muted hover:bg-brand-50 hover:text-brand-800',
              isPending && 'opacity-60',
            )}
          >
            {ageBandLabel[option]}
          </button>
        ))}

        <button
          type="button"
          disabled={isPending}
          onClick={() => startTransition(async () => void (await clearTeachingBand()))}
          title={t('teaching.change')}
          className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[0.75rem] font-semibold text-muted transition-colors hover:bg-brand-50 hover:text-brand-800"
        >
          <RefreshCw className={cn('size-3.5', isPending && 'animate-spin')} />
          {t('teaching.change')}
        </button>
      </div>
    </div>
  );
}
