'use client';

import { useTransition } from 'react';
import { ArrowRight, GraduationCap } from 'lucide-react';
import { Logo } from '@/components/brand/logo';
import { Badge } from '@/components/ui/badge';
import { setTeachingBand } from '@/lib/actions/teaching';
import { ageBandLabel } from '@/lib/labels';
import { useT } from '@/lib/i18n/client';
import type { AgeBand } from '@/lib/types';
import { cn } from '@/lib/utils';

export interface PickerOption {
  band: AgeBand;
  childCount: number;
  /** Whether this teacher is approved / assigned for the group. */
  assigned: boolean;
}

/**
 * Shown to a teacher right after sign-in: which age group are you teaching?
 * All four ministry groups (4–15) are offered — age group only, no class names.
 */
export function TeachingGroupPicker({
  teacherName,
  options,
}: {
  teacherName: string;
  options: PickerOption[];
}) {
  const [isPending, startTransition] = useTransition();
  const t = useT();

  function choose(band: AgeBand) {
    startTransition(async () => {
      await setTeachingBand(band);
    });
  }

  return (
    <div className="mx-auto w-full max-w-3xl py-6 sm:py-10">
      <div className="mb-8 flex flex-col items-center gap-4 text-center">
        <Logo size={52} />
        <div>
          <p className="text-[0.6875rem] font-bold tracking-[0.14em] text-brand-600 uppercase">
            {teacherName}
          </p>
          <h1 className="mt-1.5 font-display text-3xl font-extrabold text-ink">
            {t('teaching.pickTitle')}
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            {t('teaching.pickSubtitle')}
          </p>
        </div>
      </div>

      <ul className="grid gap-4 sm:grid-cols-2">
        {options.map((option) => (
          <li key={option.band}>
            <button
              type="button"
              onClick={() => choose(option.band)}
              disabled={isPending}
              className={cn(
                'group flex h-full w-full flex-col rounded-xl bg-surface p-6 text-left shadow-card transition-all duration-200',
                'hover:-translate-y-0.5 hover:shadow-lift disabled:opacity-60',
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <span
                  className={cn(
                    'flex size-12 items-center justify-center rounded-full',
                    option.assigned
                      ? 'bg-brand-700 text-white'
                      : 'bg-canvas text-muted',
                  )}
                >
                  <GraduationCap className="size-5" />
                </span>
                {option.assigned ? (
                  <Badge tone="neutral">
                    {option.childCount} {t('teaching.children')}
                  </Badge>
                ) : (
                  <Badge tone="sun">{t('teaching.notAssigned')}</Badge>
                )}
              </div>

              <h2 className="mt-4 font-display text-2xl font-extrabold text-ink">
                {ageBandLabel[option.band]}
              </h2>

              <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-semibold text-brand-700">
                {isPending ? t('common.loading') : t('teaching.startTeaching')}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
