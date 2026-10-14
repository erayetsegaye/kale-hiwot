import Link from 'next/link';
import { Heart, Plus, ShieldAlert } from 'lucide-react';
import { ChildCard } from '@/components/domain/child-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/data-display';
import { PageHeader } from '@/components/ui/page-header';
import { Tabs } from '@/components/ui/tabs';
import { listChildren, listClasses } from '@/lib/data/queries';
import { ageBandLabel, ageBands, bandForAge } from '@/lib/labels';
import { classLabelIn } from '@/lib/class-label';
import { getT } from '@/lib/i18n/server';
import { ageFromBirthDate, cn } from '@/lib/utils';
import type { AgeBand, RegistrationStatus } from '@/lib/types';

export const metadata = { title: 'Children' };

export default async function AdminChildrenPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; class?: string; band?: string }>;
}) {
  const t = await getT();
  const params = await searchParams;
  const [allChildren, classes] = await Promise.all([listChildren(), listClasses()]);

  const status = params.status as RegistrationStatus | undefined;
  const classId = params.class;
  const band = params.band as AgeBand | undefined;

  const children = allChildren.filter((child) => {
    if (status && child.status !== status) return false;
    if (classId && child.classId !== classId) return false;
    if (band && bandForAge(ageFromBirthDate(child.birthDate)) !== band) return false;
    return true;
  });

  const base = '/admin/children';
  const extra = [
    classId ? `class=${classId}` : null,
    band ? `band=${band}` : null,
  ].filter(Boolean);
  const withFilters = (href: string) =>
    extra.length
      ? `${href}${href.includes('?') ? '&' : '?'}${extra.join('&')}`
      : href;

  const safetyFlags = allChildren.filter(
    (child) => child.allergies || child.medicalNotes,
  );

  return (
    <div className="space-y-6 py-2">
      <PageHeader
        eyebrow={t('pages.admin.children.eyebrow')}
        title={t('pages.admin.children.title')}
        description={t('pages.admin.children.description')}
        actions={
          <Button className="gap-2">
            <Plus className="size-4" />
            Add child
          </Button>
        }
      />

      <div className="flex flex-wrap items-center gap-3">
        <Tabs
          active={
            status ? withFilters(`${base}?status=${status}`) : withFilters(base)
          }
          items={[
            { label: t('common.all'), href: withFilters(base), count: allChildren.length },
            {
              label: 'Approved',
              href: withFilters(`${base}?status=approved`),
              count: allChildren.filter((c) => c.status === 'approved').length,
            },
            {
              label: 'Pending',
              href: withFilters(`${base}?status=pending`),
              count: allChildren.filter((c) => c.status === 'pending').length,
            },
            {
              label: 'Needs info',
              href: withFilters(`${base}?status=needs_info`),
              count: allChildren.filter((c) => c.status === 'needs_info').length,
            },
          ]}
        />
        {classId ? (
          <Badge tone="sky">
            Filtered:{' '}
            {(() => {
              const klass = classes.find((item) => item.id === classId);
              return klass ? classLabelIn(t, classes, klass) : classId;
            })()}
          </Badge>
        ) : null}
        {band ? <Badge tone="brand">Age group: {ageBandLabel[band]}</Badge> : null}
      </div>

      {/* Jump between the four age groups */}
      <div className="scrollbar-none flex items-center gap-1.5 overflow-x-auto">
        <Link
          href={status ? `${base}?status=${status}` : base}
          className={cn(
            'rounded-full px-3.5 py-2 text-[0.75rem] font-semibold whitespace-nowrap transition-colors',
            band ? 'bg-surface text-muted shadow-card hover:text-brand-800' : 'bg-brand-700 text-white',
          )}
        >
          All ages (4–15)
        </Link>
        {ageBands.map((entry) => {
          const count = allChildren.filter(
            (child) => bandForAge(ageFromBirthDate(child.birthDate)) === entry.band,
          ).length;
          const href = `${base}?band=${entry.band}${status ? `&status=${status}` : ''}`;
          return (
            <Link
              key={entry.band}
              href={href}
              className={cn(
                'inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-[0.75rem] font-semibold whitespace-nowrap transition-colors',
                band === entry.band
                  ? 'bg-brand-700 text-white'
                  : 'bg-surface text-muted shadow-card hover:text-brand-800',
              )}
            >
              {entry.label}
              <span
                className={cn(
                  'rounded-full px-1.5 py-0.5 text-[0.625rem] font-bold',
                  band === entry.band ? 'bg-white/20 text-white' : 'bg-canvas text-muted',
                )}
              >
                {count}
              </span>
            </Link>
          );
        })}
      </div>

      <Card className="flex flex-wrap items-center gap-4 p-4">
        <span className="flex size-10 items-center justify-center rounded-full bg-sun-100 text-sun-700">
          <ShieldAlert className="size-5" />
        </span>
        <p className="text-[0.8125rem] text-muted">
          <strong className="text-ink">{safetyFlags.length} children</strong> have
          allergies or medical notes recorded. These are shown to their teachers at
          check-in.
        </p>
      </Card>

      {children.length ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {children.map((child) => (
            <ChildCard
              key={child.id}
              child={child}
              href={`/admin/children/${child.id}`}
              showSafety
            />
          ))}
        </div>
      ) : (
        <Card>
          <EmptyState
            icon={<Heart className="size-6" />}
            title="No children match this filter"
            description="Try a different status or class."
          />
        </Card>
      )}
    </div>
  );
}
