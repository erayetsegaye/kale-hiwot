import Link from 'next/link';
import { ArrowRight, MapPin, Users } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ProgressBar } from '@/components/ui/data-display';
import { ageBands, bandForAge } from '@/lib/labels';
import { ageBandText } from '@/lib/i18n/domain';
import { getT } from '@/lib/i18n/server';
import type { Child, ClassGroup } from '@/lib/types';
import { ageFromBirthDate, cn, percent } from '@/lib/utils';

/**
 * The ministry's four age groups (4–15), always shown in full so a gap is
 * visible rather than hidden: a band with no class or no children still gets
 * a card.
 */
export async function AgeBandOverview({
  students,
  classes,
  hrefFor,
  className,
}: {
  students: Child[];
  classes: ClassGroup[];
  /** Optional link target per band, e.g. the filtered children register. */
  hrefFor?: (band: string) => string;
  className?: string;
}) {
  const t = await getT();

  return (
    <div className={cn('grid gap-4 sm:grid-cols-2 xl:grid-cols-4', className)}>
      {ageBands.map((band) => {
        const bandClasses = classes.filter((klass) => klass.ageBand === band.band);

        // Count by the child's actual age, so a mis-placed child still shows up
        // in the right group.
        const bandChildren = students.filter(
          (child) => bandForAge(ageFromBirthDate(child.birthDate)) === band.band,
        );

        const capacity = bandClasses.reduce((sum, klass) => sum + klass.capacity, 0);
        const fill = percent(bandChildren.length, capacity);
        const teachers = [...new Set(bandClasses.flatMap((klass) => klass.teacherNames))];
        const href = hrefFor?.(band.band);

        const card = (
          <article
            className={cn(
              'flex h-full flex-col rounded-lg bg-surface p-5 shadow-card transition-all duration-200',
              href && 'hover:-translate-y-0.5 hover:shadow-lift',
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <Badge tone="brand">{ageBandText(t, band.band)}</Badge>
              <span className="text-[0.6875rem] text-faint">
                {bandClasses.length}{' '}
                {bandClasses.length === 1 ? t('ui.classOne') : t('ui.classes')}
              </span>
            </div>

            <p className="mt-3 font-display text-3xl font-extrabold text-ink">
              {bandChildren.length}
            </p>
            <p className="text-[0.75rem] text-muted">{t('ui.childrenInGroup')}</p>

            <div className="mt-3">
              {capacity ? (
                <ProgressBar
                  size="sm"
                  value={fill}
                  tone={fill > 90 ? 'sun' : 'brand'}
                  label={`${bandChildren.length} / ${capacity} ${t('ui.places')}`}
                />
              ) : (
                <Badge tone="berry">{t('ui.noClassOpen')}</Badge>
              )}
            </div>

            <div className="mt-3 flex flex-wrap gap-1.5">
              {teachers.length ? (
                teachers.slice(0, 2).map((name) => (
                  <Badge key={name} tone="neutral" icon={<Users className="size-3" />}>
                    {name}
                  </Badge>
                ))
              ) : (
                <span className="text-[0.6875rem] text-faint">{t('ui.noTeacherYet')}</span>
              )}
            </div>

            <div className="mt-auto flex items-center justify-between gap-2 pt-4 text-[0.6875rem] text-muted">
              {/* Rooms, not class names — groups are identified by age. */}
              <span className="inline-flex min-w-0 items-center gap-1.5">
                <MapPin className="size-3.5 shrink-0" />
                <span className="truncate">
                  {bandClasses.map((klass) => klass.room).filter(Boolean).join(', ') || '—'}
                </span>
              </span>
              {href ? <ArrowRight className="size-3.5 shrink-0 text-brand-600" /> : null}
            </div>
          </article>
        );

        return href ? (
          <Link key={band.band} href={href} className="block h-full">
            {card}
          </Link>
        ) : (
          <div key={band.band}>{card}</div>
        );
      })}
    </div>
  );
}
