import {
  AlertTriangle,
  GraduationCap,
  Mail,
  Phone,
  ShieldCheck,
  UserPlus,
} from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardBody, CardHeader } from '@/components/ui/card';
import { EmptyState, StatCard } from '@/components/ui/data-display';
import { PageHeader, SectionHeading } from '@/components/ui/page-header';
import { listClasses, listTeachers } from '@/lib/data/queries';
import { ageBandLabel, ageBands } from '@/lib/labels';
import { classLabelIn } from '@/lib/class-label';
import { getT } from '@/lib/i18n/server';
import { getFormat } from '@/lib/i18n/format';
import type { AgeBand, Teacher } from '@/lib/types';

export const metadata = { title: 'Teachers' };

export default async function AdminTeachersPage() {
  const t = await getT();
  const f = await getFormat();
  const [teachers, classes] = await Promise.all([listTeachers(), listClasses()]);

  // Teacher accounts work immediately — only child registrations need review.
  // What an administrator still does here is assign each teacher a class.
  const active = teachers.filter((teacher) => teacher.status !== 'inactive');
  const unassigned = active.filter((teacher) => teacher.classIds.length === 0);

  const teachersFor = (band: AgeBand) =>
    active.filter((teacher) => teacher.ageBands.includes(band));

  const coveredBands = ageBands
    .filter((band) => teachersFor(band.band).length > 0)
    .map((band) => band.band);
  const uncoveredBands = ageBands
    .filter((band) => teachersFor(band.band).length === 0)
    .map((band) => band.band);

  function TeacherCard({ teacher }: { teacher: Teacher }) {
    const assigned = classes.filter((klass) => teacher.classIds.includes(klass.id));
    const students = assigned.reduce((total, klass) => total + klass.childCount, 0);

    return (
      <Card className="card-hover p-5">
        <div className="flex items-start gap-4">
          <Avatar name={teacher.fullName} size="lg" />
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-base font-bold text-ink">{teacher.fullName}</h3>
            <p className="mt-0.5 text-[0.75rem] text-muted">
              {f.date(teacher.startedAt)}
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {teacher.backgroundCheckedAt ? (
                <Badge tone="brand" icon={<ShieldCheck className="size-3" />}>
                  Safeguarding cleared
                </Badge>
              ) : (
                <Badge tone="sun" icon={<AlertTriangle className="size-3" />}>
                  Check pending
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Age groups chosen at registration */}
        <div className="mt-4 rounded-lg bg-brand-50 p-3.5">
          <p className="flex items-center gap-1.5 text-[0.625rem] font-bold tracking-[0.12em] text-brand-800 uppercase">
            <GraduationCap className="size-3.5" />
            Teaching age groups
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {teacher.ageBands.length ? (
              teacher.ageBands.map((band) => (
                <Badge key={band} tone="brand">
                  {ageBandLabel[band]}
                </Badge>
              ))
            ) : (
              <span className="text-[0.75rem] text-muted">Not specified</span>
            )}
          </div>
        </div>

        <dl className="mt-4 space-y-2 text-[0.75rem] text-muted">
          <div className="flex items-center gap-2">
            <Mail className="size-3.5 shrink-0" />
            <span className="truncate">{teacher.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="size-3.5 shrink-0" />
            {teacher.phone ?? '—'}
          </div>
        </dl>

        <div className="mt-4 rounded-lg bg-canvas/70 p-3.5">
          <p className="text-[0.625rem] font-bold tracking-[0.12em] text-faint uppercase">
            Assigned groups
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {assigned.length ? (
              assigned.map((klass) => (
                <Badge key={klass.id} tone="sky">
                  {classLabelIn(t, classes, klass)}
                </Badge>
              ))
            ) : (
              <span className="text-[0.75rem] text-faint">No groups assigned</span>
            )}
          </div>
          <p className="mt-2.5 text-[0.75rem] text-muted">
            <strong className="text-ink">{students}</strong> children in their care
          </p>
        </div>

        {teacher.specialties.length ? (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {teacher.specialties.map((specialty) => (
              <Badge key={specialty} tone="neutral">
                {specialty}
              </Badge>
            ))}
          </div>
        ) : null}
      </Card>
    );
  }

  return (
    <div className="space-y-6 py-2">
      <PageHeader
        eyebrow={t('pages.admin.teachers.eyebrow')}
        title={t('pages.admin.teachers.title')}
        description={t('pages.admin.teachers.description')}
        actions={
          <Button className="gap-2">
            <UserPlus className="size-4" />
            Invite teacher
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Active teachers" value={active.length} />
        <StatCard
          tone="brand"
          label="Waiting for a class"
          value={unassigned.length}
          hint={unassigned.length ? 'Assign them a group' : 'Everyone is assigned'}
        />
        <StatCard
          label="Age groups covered"
          value={`${coveredBands.length} / ${ageBands.length}`}
          hint="of the 4–15 age groups"
        />
        <StatCard
          label="Groups without cover"
          value={uncoveredBands.length}
          hint={
            uncoveredBands.length
              ? uncoveredBands.map((band) => ageBandLabel[band]).join(', ')
              : 'Every group has a teacher'
          }
        />
      </div>

      {/* Teachers per age group — all four, always */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {ageBands.map((band) => {
          const count = teachersFor(band.band).length;
          return (
            <StatCard
              key={band.band}
              label={`Teachers for ${band.label}`}
              value={count}
              hint={count ? undefined : 'No teacher assigned'}
            />
          );
        })}
      </div>

      {/* Coverage per age band — who can teach which group */}
      <Card>
        <CardHeader
          title="Age group coverage"
          description="Teachers choose their age groups when they register; approve them here and assign a class."
          icon={<GraduationCap className="size-[1.1rem]" />}
        />
        <CardBody className="grid gap-3 pt-2 sm:grid-cols-2 xl:grid-cols-4">
          {ageBands.map((band) => {
            const covering = teachersFor(band.band);
            return (
              <div key={band.band} className="rounded-lg bg-canvas/70 p-4">
                <p className="text-[0.8125rem] font-bold text-ink">{band.label}</p>
                <p className="mt-0.5 text-[0.6875rem] text-muted">
                  {covering.length} {covering.length === 1 ? 'teacher' : 'teachers'}
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {covering.length ? (
                    covering.map((teacher) => (
                      <Badge key={teacher.id} tone="neutral">
                        {teacher.fullName.split(' ')[0]}
                      </Badge>
                    ))
                  ) : (
                    <Badge tone="berry">No cover</Badge>
                  )}
                </div>
              </div>
            );
          })}
        </CardBody>
      </Card>

      {/* Newly registered teachers who still need a class */}
      {unassigned.length ? (
        <Card>
          <CardHeader
            title="Teachers waiting for a class"
            description="Their accounts are active. Assign each one a group so they can see their children."
            action={<Badge tone="sun">{unassigned.length}</Badge>}
          />
          <CardBody className="space-y-3 pt-3">
            {unassigned.map((teacher) => (
              <div
                key={teacher.id}
                className="flex flex-wrap items-start gap-4 rounded-lg bg-canvas/70 p-4"
              >
                <Avatar name={teacher.fullName} size="md" />
                <div className="min-w-[14rem] flex-1">
                  <p className="text-sm font-bold text-ink">{teacher.fullName}</p>
                  <p className="mt-0.5 text-[0.75rem] text-muted">
                    {teacher.email} · {teacher.phone ?? '—'}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {teacher.ageBands.map((band) => (
                      <Badge key={band} tone="brand">
                        {ageBandLabel[band]}
                      </Badge>
                    ))}
                  </div>
                  <p className="mt-1.5 text-[0.6875rem] text-faint">
                    {f.ago(teacher.startedAt)}
                  </p>
                </div>
                <Button size="sm" variant="secondary">
                  Assign a group
                </Button>
              </div>
            ))}
          </CardBody>
        </Card>
      ) : null}

      <section>
        <SectionHeading
          title="Teaching team"
          description="Approved teachers and the age groups they cover."
        />
        {active.length ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {active.map((teacher) => (
              <TeacherCard key={teacher.id} teacher={teacher} />
            ))}
          </div>
        ) : (
          <Card>
            <EmptyState title="No teachers yet" />
          </Card>
        )}
      </section>
    </div>
  );
}
