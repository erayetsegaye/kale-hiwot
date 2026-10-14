import { Inbox, UserPlus } from 'lucide-react';
import { RegistrationReview } from './registration-review';
import { Avatar } from '@/components/ui/avatar';
import { Badge, StatusBadge } from '@/components/ui/badge';
import { Card, CardBody, CardHeader } from '@/components/ui/card';
import { EmptyState, StatCard } from '@/components/ui/data-display';
import { PageHeader } from '@/components/ui/page-header';
import { listRegistrations } from '@/lib/data/queries';
import { bandForAge } from '@/lib/labels';
import { getT } from '@/lib/i18n/server';
import { getFormat } from '@/lib/i18n/format';
import { ageFromBirthDate } from '@/lib/utils';

export const metadata = { title: 'Registrations' };

export default async function AdminRegistrationsPage() {
  const t = await getT();
  const f = await getFormat();
  const registrations = await listRegistrations();
  const queue = registrations.filter((r) => r.status === 'pending' || r.status === 'needs_info');
  const decided = registrations.filter((r) => r.status === 'approved' || r.status === 'rejected');

  return (
    <div className="space-y-6 py-2">
      <PageHeader
        eyebrow={t('pages.admin.registrations.eyebrow')}
        title={t('pages.admin.registrations.title')}
        description={t('pages.admin.registrations.description')}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          tone="brand"
          label="Awaiting review"
          value={registrations.filter((r) => r.status === 'pending').length}
          icon={<Inbox className="size-5" />}
        />
        <StatCard
          label="Needs information"
          value={registrations.filter((r) => r.status === 'needs_info').length}
          icon={<UserPlus className="size-5" />}
        />
        <StatCard
          label="Approved this term"
          value={registrations.filter((r) => r.status === 'approved').length}
          icon={<UserPlus className="size-5" />}
        />
      </div>

      <Card>
        <CardHeader
          title="Review queue"
          description="Approving a child creates their record and links them to the requested class."
        />
        <CardBody className="space-y-3 pt-3">
          {queue.length ? (
            queue.map((registration) => (
              <div
                key={registration.id}
                className="flex flex-wrap items-start gap-4 rounded-lg bg-canvas/70 p-4"
              >
                <Avatar name={registration.childName} size="md" />
                <div className="min-w-[14rem] flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-bold text-ink">{registration.childName}</p>
                    <StatusBadge status={registration.status} />
                    <Badge tone="neutral">
                      Age band {bandForAge(ageFromBirthDate(registration.birthDate)) ?? '—'}
                    </Badge>
                  </div>
                  <p className="mt-1 text-[0.75rem] text-muted">
                    {ageFromBirthDate(registration.birthDate)} ·{' '}
                    {f.date(registration.birthDate)} ·{' '}
                    <strong className="text-ink">{registration.requestedClass}</strong>
                  </p>
                  <p className="mt-0.5 text-[0.75rem] text-muted">
                    Guardian: {registration.guardianName} · {registration.guardianPhone}
                  </p>
                  {registration.note ? (
                    <p className="mt-2 rounded-sm bg-sky-100 px-3 py-2 text-[0.75rem] text-sky-700">
                      Waiting on parent: {registration.note}
                    </p>
                  ) : null}
                  <p className="mt-1.5 text-[0.6875rem] text-faint">
                    {f.ago(registration.submittedAt)}
                  </p>
                </div>
                <RegistrationReview
                  registrationId={registration.id}
                  childName={registration.childName}
                />
              </div>
            ))
          ) : (
            <EmptyState
              icon={<Inbox className="size-6" />}
              title="The queue is empty"
              description="Every registration has been reviewed."
            />
          )}
        </CardBody>
      </Card>

      <Card>
        <CardHeader title="Recently decided" />
        <CardBody className="space-y-2.5 pt-3">
          {decided.map((registration) => (
            <div
              key={registration.id}
              className="flex flex-wrap items-center gap-3 rounded-lg bg-canvas/50 px-4 py-3"
            >
              <Avatar name={registration.childName} size="sm" />
              <p className="flex-1 text-[0.8125rem] font-semibold text-ink">
                {registration.childName}
                <span className="ml-2 font-normal text-muted">
                  {registration.requestedClass}
                </span>
              </p>
              <span className="text-[0.6875rem] text-faint">
                {f.ago(registration.submittedAt)}
              </span>
              <StatusBadge status={registration.status} />
            </div>
          ))}
        </CardBody>
      </Card>
    </div>
  );
}
