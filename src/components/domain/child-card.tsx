import Link from 'next/link';
import { AlertTriangle, ArrowRight, CalendarCheck } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { Badge, StatusBadge } from '@/components/ui/badge';
import { ProgressBar } from '@/components/ui/data-display';
import { bandForAge } from '@/lib/labels';
import { ageBandText, awaitingGroupText } from '@/lib/i18n/domain';
import { getT } from '@/lib/i18n/server';
import type { Child } from '@/lib/types';
import { ageFromBirthDate } from '@/lib/utils';

export async function ChildCard({
  child,
  href,
  showSafety = false,
}: {
  child: Child;
  href?: string;
  showSafety?: boolean;
}) {
  const t = await getT();
  const age = ageFromBirthDate(child.birthDate);
  // Everyone identifies a child's group by age, never by a class name.
  const band = bandForAge(age);
  const groupLabel = band ? ageBandText(t, band) : awaitingGroupText(t);
  const content = (
    <article className="card-hover flex h-full flex-col rounded-lg bg-surface p-5 shadow-card">
      <div className="flex items-start gap-4">
        <Avatar name={child.fullName} src={child.photoUrl} size="lg" />
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-bold text-ink">{child.fullName}</h3>
          <p className="mt-0.5 text-[0.8125rem] text-muted">
            {age} years · {groupLabel}
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <StatusBadge status={child.status} />
            {child.checkedIn ? (
              <Badge tone="brand" icon={<CalendarCheck className="size-3" />}>
                {t('ui.checkedIn')}
              </Badge>
            ) : null}
          </div>
        </div>
      </div>

      {showSafety && (child.allergies || child.medicalNotes) ? (
        <p className="mt-4 flex items-start gap-2 rounded-sm bg-sun-100 px-3 py-2 text-[0.75rem] leading-relaxed text-sun-700">
          <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
          {[child.allergies, child.medicalNotes].filter(Boolean).join(' · ')}
        </p>
      ) : null}

      <div className="mt-5 space-y-3">
        <ProgressBar value={child.attendanceRate} label={t('ui.attendance')} size="sm" />
        <div className="flex items-center justify-between text-[0.75rem] text-muted">
          <span>
            {child.memoryVersesLearned} {t('ui.memoryVerses')}
          </span>
          {href ? (
            <span className="inline-flex items-center gap-1 font-semibold text-brand-700">
              {t('ui.viewProfile')}
              <ArrowRight className="size-3.5" />
            </span>
          ) : null}
        </div>
      </div>
    </article>
  );

  return href ? (
    <Link href={href} className="block h-full">
      {content}
    </Link>
  ) : (
    content
  );
}
