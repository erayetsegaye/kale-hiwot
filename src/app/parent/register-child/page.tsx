import { GraduationCap, ShieldCheck } from 'lucide-react';
import { ChildRegistrationForm } from './child-registration-form';
import { Badge, StatusBadge } from '@/components/ui/badge';
import { Card, CardBody, CardHeader } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import { requireRole } from '@/lib/auth';
import { getGuardianForUser, listChildren, listClasses } from '@/lib/data/queries';
import { ageBands } from '@/lib/labels';
import { getT } from '@/lib/i18n/server';
import { getFormat } from '@/lib/i18n/format';

export const metadata = { title: 'Register a child' };

export default async function RegisterChildPage() {
  const t = await getT();
  const f = await getFormat();
  const user = await requireRole('parent');
  const guardian = await getGuardianForUser(user.id);
  const [classes, children] = await Promise.all([
    listClasses(),
    listChildren({ guardianId: guardian?.id }),
  ]);

  return (
    <div className="space-y-6 py-2">
      <PageHeader
        eyebrow={t('pages.parent.registerChild.eyebrow')}
        title={t('pages.parent.registerChild.title')}
        description={t('pages.parent.registerChild.description')}
      />

      <div className="grid gap-5 xl:grid-cols-[1.6fr_1fr]">
        <ChildRegistrationForm
          classes={classes.map((klass) => ({
            id: klass.id,
            ageRange: klass.ageRange,
            minAge: klass.minAge,
            maxAge: klass.maxAge,
          }))}
          guardian={{
            fullName: guardian?.fullName ?? user.fullName,
            email: guardian?.email ?? user.email,
            phone: guardian?.phone ?? null,
          }}
        />

        <div className="space-y-5">
          <Card>
            <CardHeader
              title={t('pages.parent.registerChild.ourGroups')}
              description={t('pages.parent.registerChild.ourGroupsHint')}
              icon={<GraduationCap className="size-[1.1rem]" />}
            />
            <CardBody className="space-y-2 pt-2">
              {ageBands.map((band) => {
                const bandChildren = classes.filter(
                  (klass) => klass.ageBand === band.band,
                );
                return (
                  <div
                    key={band.band}
                    className="flex items-center justify-between gap-3 rounded-lg bg-canvas/70 px-3.5 py-3"
                  >
                    <p className="text-[0.8125rem] font-bold text-ink">{band.label}</p>
                    <Badge tone={bandChildren.length ? 'brand' : 'neutral'}>
                      {bandChildren[0]?.room ?? '—'}
                    </Badge>
                  </div>
                );
              })}
            </CardBody>
          </Card>

          <Card>
            <CardHeader
              title="How review works"
              icon={<ShieldCheck className="size-[1.1rem]" />}
            />
            <CardBody className="pt-2">
              <ol className="space-y-3">
                {[
                  { title: 'Pending', body: 'You submit the registration.' },
                  { title: 'Admin review', body: 'The ministry team checks the details.' },
                  {
                    title: 'Approved / Needs info / Rejected',
                    body: 'You are notified of the decision and the assigned class.',
                  },
                ].map((item, index) => (
                  <li key={item.title} className="flex gap-3">
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-brand-100 text-[0.6875rem] font-bold text-brand-800">
                      {index + 1}
                    </span>
                    <div>
                      <p className="text-[0.8125rem] font-bold text-ink">{item.title}</p>
                      <p className="text-[0.75rem] leading-relaxed text-muted">{item.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="My registrations" description="Current status of each child." />
            <CardBody className="space-y-2.5 pt-2">
              {children.map((child) => (
                <div
                  key={child.id}
                  className="flex flex-wrap items-center gap-3 rounded-lg bg-canvas/70 px-4 py-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[0.8125rem] font-bold text-ink">
                      {child.fullName}
                    </p>
                    <p className="text-[0.6875rem] text-muted">
                      {f.date(child.joinedAt)}
                    </p>
                  </div>
                  <StatusBadge status={child.status} />
                </div>
              ))}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
