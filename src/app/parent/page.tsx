import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  CalendarClock,
  ClipboardCheck,
  Clock,
  Heart,
  MapPin,
  Sparkles,
  UserPlus,
} from 'lucide-react';
import { ActivityRow } from '@/components/domain/activity-item';
import { AnnouncementCard } from '@/components/domain/announcement-card';
import { ChildCard } from '@/components/domain/child-card';
import { NotificationList } from '@/components/domain/notification-list';
import { AttendanceBadge, Badge } from '@/components/ui/badge';
import { ButtonLink } from '@/components/ui/button';
import { Card, CardBody, CardHeader } from '@/components/ui/card';
import { EmptyState, StatCard } from '@/components/ui/data-display';
import { PageHeader } from '@/components/ui/page-header';
import { requireRole } from '@/lib/auth';
import {
  bandsForChildren,
  filterAnnouncementsByBands,
  getGuardianForUser,
  listActivities,
  listAnnouncements,
  listAttendance,
  listChildren,
  listClasses,
  listEvents,
  listLessons,
  listNotifications,
} from '@/lib/data/queries';
import { ageBandLabel } from '@/lib/labels';
import { getT } from '@/lib/i18n/server';
import { getFormat } from '@/lib/i18n/format';

export const metadata = { title: 'Parent dashboard' };

export default async function ParentDashboard() {
  const t = await getT();
  const f = await getFormat();
  const user = await requireRole('parent');
  const guardian = await getGuardianForUser(user.id);

  const [children, activities, notifications, allAnnouncements, events, lessons, attendance, classes] =
    await Promise.all([
      listChildren({ guardianId: guardian?.id }),
      listActivities(),
      listNotifications(),
      listAnnouncements(),
      listEvents(),
      listLessons(),
      listAttendance(),
      listClasses(),
    ]);

  // Announcements aimed at a specific age group only reach matching families.
  const announcements = filterAnnouncementsByBands(
    allAnnouncements,
    bandsForChildren(children),
  );

  const childIds = children.map((child) => child.id);
  const classIds = children.map((child) => child.classId).filter(Boolean) as string[];
  const myActivities = activities.filter(
    (activity) => !activity.classId || classIds.includes(activity.classId),
  );
  const nextActivity = myActivities[0];
  const myLessons = lessons.filter((lesson) => classIds.includes(lesson.classId));

  // Parents see age groups rather than internal class names.
  const groupFor = (classId: string) => {
    const band = classes.find((klass) => klass.id === classId)?.ageBand;
    return band ? ageBandLabel[band] : 'Age group';
  };
  const myAttendance = attendance.filter((record) => childIds.includes(record.childId));
  const nextEvent = events.find((event) => event.status === 'published');

  return (
    <div className="space-y-7 py-2">
      <PageHeader
        eyebrow={`${t('pages.parent.dashboard.eyebrow')}, ${user.fullName.split(' ')[0]}`}
        title={t('pages.parent.dashboard.title')}
        description={t('pages.parent.dashboard.description')}
        actions={
          <ButtonLink href="/parent/register-child" className="gap-2">
            <UserPlus className="size-4" />
            {t('pages.parent.dashboard.registerChild')}
          </ButtonLink>
        }
      />

      {/* Next activity highlight */}
      {nextActivity ? (
        <section className="overflow-hidden rounded-xl bg-brand-700 text-white shadow-lift">
          <div className="flex flex-wrap items-center gap-6 p-6 sm:p-7">
            <span className="flex size-14 items-center justify-center rounded-full bg-white/15">
              <CalendarClock className="size-6" />
            </span>
            <div className="min-w-[14rem] flex-1">
              <p className="text-[0.6875rem] font-bold tracking-[0.14em] text-brand-100 uppercase">
                {t('pages.parent.dashboard.nextActivity')}
              </p>
              <h2 className="mt-1 font-display text-2xl font-extrabold">
                {nextActivity.title}
              </h2>
              <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-[0.8125rem] text-brand-100">
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="size-3.5" />
                  {f.weekday(nextActivity.date)} ·{' '}
                  {f.range(nextActivity.startTime, nextActivity.endTime)}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="size-3.5" />
                  {nextActivity.location}
                </span>
              </div>
            </div>
            <ButtonLink href="/parent/schedule" variant="contrast" className="gap-2">
              {t('pages.parent.dashboard.viewSchedule')}
              <ArrowRight className="size-4" />
            </ButtonLink>
          </div>
        </section>
      ) : null}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label={t('pages.parent.dashboard.myChildren')}
          value={children.length}
          icon={<Heart className="size-5" />}
          href="/parent/children"
        />
        <StatCard
          label={t('pages.parent.dashboard.attendanceTerm')}
          value={`${
            children.length
              ? Math.round(
                  children.reduce((sum, child) => sum + child.attendanceRate, 0) /
                    children.length,
                )
              : 0
          }%`}
          icon={<ClipboardCheck className="size-5" />}
          href="/parent/attendance"
        />
        <StatCard
          label={t('pages.parent.dashboard.lessonsShared')}
          value={myLessons.length}
          icon={<BookOpen className="size-5" />}
          href="/parent/lessons"
        />
        <StatCard
          tone="brand"
          label={t('pages.parent.dashboard.upcomingEvents')}
          value={events.filter((event) => event.status === 'published').length}
          icon={<Sparkles className="size-5" />}
          href="/parent/events"
        />
      </section>

      <section>
        <div className="mb-3 flex items-end justify-between">
          <h2 className="font-display text-lg font-bold text-ink">
            {t('pages.parent.dashboard.myChildren')}
          </h2>
          <ButtonLink href="/parent/children" size="sm" variant="ghost">
            Manage
          </ButtonLink>
        </div>
        {children.length ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {children.map((child) => (
              <ChildCard key={child.id} child={child} href="/parent/children" />
            ))}
          </div>
        ) : (
          <Card>
            <EmptyState
              icon={<Heart className="size-6" />}
              title="No children registered yet"
              description="Register your child to join a class — the ministry team will review it."
              action={
                <ButtonLink href="/parent/register-child">Register a child</ButtonLink>
              }
            />
          </Card>
        )}
      </section>

      <div className="grid gap-5 xl:grid-cols-[1.4fr_1fr]">
        <Card>
          <CardHeader
            title={t('pages.parent.dashboard.upcomingClasses')}
            description="Based on the classes your children belong to."
            action={
              <ButtonLink href="/parent/schedule" size="sm" variant="ghost" className="gap-1.5">
                Full schedule
                <ArrowRight className="size-3.5" />
              </ButtonLink>
            }
          />
          <CardBody className="space-y-1 pt-2">
            {myActivities.slice(0, 4).map((activity) => (
              <ActivityRow key={activity.id} activity={activity} />
            ))}
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title={t('nav.items.notifications')}
            action={
              <ButtonLink href="/parent/notifications" size="sm" variant="ghost">
                All
              </ButtonLink>
            }
          />
          <CardBody className="pt-0">
            <NotificationList notifications={notifications} limit={4} />
          </CardBody>
        </Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_1fr]">
        <Card>
          <CardHeader
            title={t('pages.parent.dashboard.recentLessons')}
            description="What your children are learning."
            action={
              <ButtonLink href="/parent/lessons" size="sm" variant="ghost">
                All lessons
              </ButtonLink>
            }
          />
          <CardBody className="space-y-3 pt-2">
            {myLessons.slice(0, 3).map((lesson) => (
              <Link
                key={lesson.id}
                href="/parent/lessons"
                className="block rounded-lg bg-canvas/70 p-4 transition-colors hover:bg-brand-50"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-[0.8125rem] font-bold text-ink">{lesson.title}</p>
                  <Badge tone="neutral">{groupFor(lesson.classId)}</Badge>
                  {lesson.hasHomework ? <Badge tone="sky">Homework</Badge> : null}
                </div>
                <p className="mt-1 text-[0.75rem] text-brand-700">{lesson.biblePassage}</p>
                <p className="mt-1.5 line-clamp-2 text-[0.75rem] text-muted">
                  {lesson.memoryVerse}
                </p>
              </Link>
            ))}
            {!myLessons.length ? <EmptyState title="No lessons shared yet" /> : null}
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title={t('pages.parent.dashboard.recentAttendance')}
            action={
              <ButtonLink href="/parent/attendance" size="sm" variant="ghost">
                History
              </ButtonLink>
            }
          />
          <CardBody className="space-y-2.5 pt-2">
            {myAttendance.slice(0, 5).map((record) => (
              <div
                key={record.id}
                className="flex flex-wrap items-center gap-3 rounded-lg bg-canvas/70 px-4 py-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[0.8125rem] font-semibold text-ink">
                    {record.childName}
                  </p>
                  <p className="truncate text-[0.6875rem] text-muted">
                    {record.activityTitle} · {f.date(record.date)}
                  </p>
                </div>
                <AttendanceBadge status={record.status} />
              </div>
            ))}
            {!myAttendance.length ? <EmptyState title="No attendance records yet" /> : null}
          </CardBody>
        </Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.4fr_1fr]">
        <section>
          <h2 className="mb-3 font-display text-lg font-bold text-ink">
            {t('pages.parent.dashboard.announcements')}
          </h2>
          <div className="space-y-3">
            {announcements.slice(0, 2).map((announcement) => (
              <AnnouncementCard key={announcement.id} announcement={announcement} />
            ))}
          </div>
        </section>

        {nextEvent ? (
          <Card>
            <CardHeader
              title={t('pages.parent.dashboard.dontMiss')}
              description="Registration is open."
            />
            <CardBody className="pt-2">
              <p className="font-display text-xl font-extrabold text-ink">
                {nextEvent.title}
              </p>
              <p className="mt-1.5 text-[0.8125rem] leading-relaxed text-muted">
                {nextEvent.description}
              </p>
              <p className="mt-3 text-[0.75rem] text-muted">
                {f.date(nextEvent.startDate)} · {nextEvent.location}
              </p>
              <ButtonLink href="/parent/events" className="mt-4 w-full">
                Register my child
              </ButtonLink>
            </CardBody>
          </Card>
        ) : null}
      </div>
    </div>
  );
}
