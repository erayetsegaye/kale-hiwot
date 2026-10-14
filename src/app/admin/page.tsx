import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  CalendarPlus,
  ClipboardCheck,
  GraduationCap,
  Heart,
  Megaphone,
  Sparkles,
  UserPlus,
  Users,
} from 'lucide-react';
import { ActivityRow } from '@/components/domain/activity-item';
import { AgeBandOverview } from '@/components/domain/age-band-overview';
import { AnnouncementCard } from '@/components/domain/announcement-card';
import { Badge, StatusBadge } from '@/components/ui/badge';
import { ButtonLink } from '@/components/ui/button';
import { Card, CardBody, CardHeader } from '@/components/ui/card';
import { EmptyState, ProgressBar, StatCard } from '@/components/ui/data-display';
import { PageHeader, SectionHeading } from '@/components/ui/page-header';
import { Avatar } from '@/components/ui/avatar';
import {
  getAdminOverview,
  listAnnouncements,
  listAuditLog,
} from '@/lib/data/queries';
import { classLabelIn } from '@/lib/class-label';
import { getT } from '@/lib/i18n/server';
import { getFormat } from '@/lib/i18n/format';
import { percent } from '@/lib/utils';

export const metadata = { title: 'Admin dashboard' };

export default async function AdminDashboard() {
  const t = await getT();
  const f = await getFormat();
  const [{ stats, activities, classes, registrations, events, children }, announcements, auditLog] =
    await Promise.all([getAdminOverview(), listAnnouncements(), listAuditLog()]);

  const today = new Date().toISOString().slice(0, 10);
  const upcoming = activities.filter((activity) => activity.date >= today).slice(0, 5);
  const pending = registrations.filter((r) => r.status !== 'approved').slice(0, 4);
  const nextEvents = events.filter((event) => event.status === 'published').slice(0, 3);

  return (
    <div className="space-y-7 py-2">
      <PageHeader
        eyebrow={t('pages.admin.dashboard.eyebrow')}
        title={t('pages.admin.dashboard.title')}
        description={t('pages.admin.dashboard.description')}
        actions={
          <>
            <ButtonLink href="/admin/activities" variant="outline" className="gap-2">
              <CalendarPlus className="size-4" />
              {t('pages.admin.dashboard.newActivity')}
            </ButtonLink>
            <ButtonLink href="/admin/announcements" className="gap-2">
              <Megaphone className="size-4" />
              {t('pages.admin.dashboard.sendAnnouncement')}
            </ButtonLink>
          </>
        }
      />

      {/* Primary counters */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label={t('pages.admin.dashboard.totalChildren')}
          value={stats.totalChildren}
          icon={<Heart className="size-5" />}
          trend={{ value: '+6 this month', direction: 'up' }}
          href="/admin/children"
        />
        <StatCard
          label={t('pages.admin.dashboard.totalParents')}
          value={stats.totalParents}
          icon={<Users className="size-5" />}
          hint="Verified accounts"
          href="/admin/parents"
        />
        <StatCard
          label={t('pages.admin.dashboard.totalTeachers')}
          value={stats.totalTeachers}
          icon={<GraduationCap className="size-5" />}
          hint="Across all classes"
          href="/admin/teachers"
        />
        <StatCard
          label={t('pages.admin.dashboard.totalClasses')}
          value={stats.totalClasses}
          icon={<BookOpen className="size-5" />}
          hint="Age-based groups"
          href="/admin/classes"
        />
      </section>

      {/* Operational counters */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          tone="brand"
          label={t('pages.admin.dashboard.pending')}
          value={stats.pendingRegistrations}
          icon={<UserPlus className="size-5" />}
          hint={`${stats.needsInfo} need more information`}
          href="/admin/registrations"
        />
        <StatCard
          label={t('pages.admin.dashboard.todays')}
          value={stats.todaysActivities}
          icon={<ClipboardCheck className="size-5" />}
          hint={`${stats.checkedIn} children checked in`}
          href="/admin/activities"
        />
        <StatCard
          label={t('pages.admin.dashboard.upcomingEvents')}
          value={stats.upcomingEvents}
          icon={<Sparkles className="size-5" />}
          hint="Published & open"
          href="/admin/events"
        />
        <StatCard
          label={t('pages.admin.dashboard.attendanceRate')}
          value={`${stats.attendanceRate}%`}
          icon={<ClipboardCheck className="size-5" />}
          trend={{ value: '+3% vs last month', direction: 'up' }}
          href="/admin/reports"
        />
      </section>

      {/* Every age group the ministry serves, 4–15 */}
      <section>
        <SectionHeading
          title={t('pages.admin.dashboard.ageGroups')}
          description={t('pages.admin.dashboard.ageGroupsHint')}
          action={
            <ButtonLink href="/admin/classes" size="sm" variant="ghost" className="gap-1.5">
              {t('common.manage')}
              <ArrowRight className="size-3.5" />
            </ButtonLink>
          }
        />
        <AgeBandOverview
          students={children}
          classes={classes}
          hrefFor={(band) => `/admin/children?band=${band}`}
        />
      </section>

      <div className="grid gap-5 xl:grid-cols-[1.6fr_1fr]">
        {/* Schedule */}
        <Card>
          <CardHeader
            title={t('pages.admin.dashboard.nextActivities')}
            description="Classes, studies and meetings across the whole week."
            action={
              <ButtonLink href="/admin/activities" size="sm" variant="ghost" className="gap-1.5">
                All activities
                <ArrowRight className="size-3.5" />
              </ButtonLink>
            }
          />
          <CardBody className="pt-2">
            {upcoming.length ? (
              <div className="space-y-1">
                {upcoming.map((activity) => (
                  <ActivityRow
                    key={activity.id}
                    activity={activity}
                    action={
                      <Badge tone="neutral">{activity.expectedAttendees} expected</Badge>
                    }
                  />
                ))}
              </div>
            ) : (
              <EmptyState title="No activities scheduled" />
            )}
          </CardBody>
        </Card>

        {/* Approvals */}
        <Card>
          <CardHeader
            title={t('pages.admin.dashboard.approvals')}
            description="Submitted by parents, awaiting your review."
            icon={<UserPlus className="size-[1.1rem]" />}
          />
          <CardBody className="space-y-3 pt-3">
            {pending.length ? (
              pending.map((registration) => (
                <div
                  key={registration.id}
                  className="flex items-center gap-3 rounded-lg bg-canvas/70 p-3"
                >
                  <Avatar name={registration.childName} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[0.8125rem] font-bold text-ink">
                      {registration.childName}
                    </p>
                    <p className="truncate text-[0.6875rem] text-muted">
                      {registration.requestedClass} · {registration.guardianName}
                    </p>
                  </div>
                  <StatusBadge status={registration.status} />
                </div>
              ))
            ) : (
              <EmptyState title="Nothing waiting" description="All registrations are reviewed." />
            )}
            <ButtonLink href="/admin/registrations" variant="secondary" className="w-full">
              Review all registrations
            </ButtonLink>
          </CardBody>
        </Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_1fr]">
        {/* Class capacity */}
        <Card>
          <CardHeader
            title={t('pages.admin.dashboard.capacity')}
            description="How full each age group currently is."
            action={
              <ButtonLink href="/admin/classes" size="sm" variant="ghost" className="gap-1.5">
                Manage
                <ArrowRight className="size-3.5" />
              </ButtonLink>
            }
          />
          <CardBody className="space-y-4 pt-3">
            {classes.map((klass) => (
              <div key={klass.id}>
                <div className="mb-1.5 flex items-baseline justify-between gap-3">
                  <p className="text-[0.8125rem] font-semibold text-ink">
                    {classLabelIn(t, classes, klass)}
                    <span className="ml-2 text-[0.6875rem] font-normal text-muted">
                      {klass.room}
                    </span>
                  </p>
                  <p className="text-[0.75rem] text-muted">
                    {klass.childCount}/{klass.capacity}
                  </p>
                </div>
                <ProgressBar
                  size="sm"
                  value={percent(klass.childCount, klass.capacity)}
                  tone={percent(klass.childCount, klass.capacity) > 90 ? 'sun' : 'brand'}
                />
              </div>
            ))}
          </CardBody>
        </Card>

        {/* Upcoming events */}
        <Card>
          <CardHeader
            title="Upcoming events"
            description="Camps, programmes and meetings."
            action={
              <ButtonLink href="/admin/events" size="sm" variant="ghost" className="gap-1.5">
                All events
                <ArrowRight className="size-3.5" />
              </ButtonLink>
            }
          />
          <CardBody className="space-y-3 pt-3">
            {nextEvents.map((event) => (
              <Link
                key={event.id}
                href="/admin/events"
                className="flex items-center gap-4 rounded-lg bg-canvas/70 p-3 transition-colors hover:bg-brand-50"
              >
                <div className="flex size-12 shrink-0 flex-col items-center justify-center rounded-md bg-brand-100 text-brand-800">
                  <span className="text-[0.5625rem] font-bold uppercase">
                    {new Date(event.startDate).toLocaleDateString(
                      f.locale === 'am' ? 'am-ET' : 'en-GB',
                      { month: 'short' },
                    )}
                  </span>
                  <span className="font-display text-base leading-none font-extrabold">
                    {new Date(event.startDate).getDate()}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[0.8125rem] font-bold text-ink">
                    {event.title}
                  </p>
                  <p className="truncate text-[0.6875rem] text-muted">
                    {event.location} · {event.registeredCount}/{event.capacity} registered
                  </p>
                </div>
                <ArrowRight className="size-4 shrink-0 text-muted" />
              </Link>
            ))}
          </CardBody>
        </Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.4fr_1fr]">
        {/* Announcements */}
        <section>
          <div className="mb-3 flex items-end justify-between">
            <h2 className="font-display text-lg font-bold text-ink">
              {t('pages.admin.dashboard.latestAnnouncements')}
            </h2>
            <ButtonLink href="/admin/announcements" size="sm" variant="ghost">
              Manage
            </ButtonLink>
          </div>
          <div className="space-y-3">
            {announcements.slice(0, 2).map((announcement) => (
              <AnnouncementCard
                key={announcement.id}
                announcement={announcement}
                showReach
              />
            ))}
          </div>
        </section>

        {/* Audit trail */}
        <Card>
          <CardHeader
            title={t('pages.admin.dashboard.recentLog')}
            description="Every sensitive action is recorded."
            action={
              <ButtonLink href="/admin/audit-logs" size="sm" variant="ghost">
                View all
              </ButtonLink>
            }
          />
          <CardBody className="pt-2">
            <ul className="space-y-3">
              {auditLog.slice(0, 5).map((entry) => (
                <li key={entry.id} className="flex items-start gap-3">
                  <span
                    className={
                      entry.severity === 'critical'
                        ? 'mt-1.5 size-2 shrink-0 rounded-full bg-berry-500'
                        : entry.severity === 'warning'
                          ? 'mt-1.5 size-2 shrink-0 rounded-full bg-sun-500'
                          : 'mt-1.5 size-2 shrink-0 rounded-full bg-brand-400'
                    }
                  />
                  <div className="min-w-0">
                    <p className="text-[0.8125rem] leading-snug text-ink">
                      <span className="font-semibold">{entry.actorName}</span>{' '}
                      <span className="text-muted">{entry.action.replace(/\./g, ' ')}</span>{' '}
                      <span className="font-semibold">{entry.target}</span>
                    </p>
                    <p className="text-[0.6875rem] text-faint">
                      {entry.detail} · {f.ago(entry.createdAt)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </CardBody>
        </Card>
      </div>

      <p className="pb-2 text-center text-[0.6875rem] text-faint">
        {children.length} {t('ui.children')} · {f.date(new Date())}
      </p>
    </div>
  );
}
