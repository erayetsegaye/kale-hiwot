import Link from 'next/link';
import {
  ArrowRight,
  BookOpen,
  ClipboardCheck,
  Heart,
  MessageSquare,
  Users,
} from 'lucide-react';
import { ActivityRow } from '@/components/domain/activity-item';
import { NotificationList } from '@/components/domain/notification-list';
import { Avatar, AvatarStack } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ButtonLink } from '@/components/ui/button';
import { Card, CardBody, CardHeader } from '@/components/ui/card';
import { EmptyState, ProgressBar, StatCard } from '@/components/ui/data-display';
import { PageHeader } from '@/components/ui/page-header';
import {
  listActivities,
  listChildren,
  listLessons,
  listNotifications,
  listThreads,
} from '@/lib/data/queries';
import { getTeacherContext } from '@/lib/data/teacher-context';
import { ageBandLabel } from '@/lib/labels';
import { groupForClassId } from '@/lib/class-label';
import { getT } from '@/lib/i18n/server';
import { percent } from '@/lib/utils';

export const metadata = { title: 'Teacher dashboard' };

export default async function TeacherDashboard() {
  const t = await getT();
  // Scoped to the age group the teacher chose when signing in.
  const { user, band, classIds, classes } = await getTeacherContext();

  const [activities, children, lessons, notifications, threads] = await Promise.all([
    listActivities({ classIds }),
    listChildren({ classIds }),
    listLessons({ classIds }),
    listNotifications(),
    listThreads(),
  ]);

  const today = new Date().toISOString().slice(0, 10);
  const next = activities.filter((activity) => activity.date >= today).slice(0, 4);
  const averageAttendance = children.length
    ? Math.round(
        children.reduce((sum, child) => sum + child.attendanceRate, 0) / children.length,
      )
    : 0;

  return (
    <div className="space-y-7 py-2">
      <PageHeader
        eyebrow={`${t('pages.teacher.dashboard.eyebrow')}, ${user.fullName.split(' ')[0]}`}
        title={
          band
            ? `${t('pages.teacher.dashboard.title')} · ${ageBandLabel[band]}`
            : t('pages.teacher.dashboard.title')
        }
        description={t('pages.teacher.dashboard.description')}
        actions={
          <>
            <ButtonLink href="/teacher/attendance" className="gap-2">
              <ClipboardCheck className="size-4" />
              {t('pages.teacher.dashboard.takeAttendance')}
            </ButtonLink>
            <ButtonLink href="/teacher/lessons" variant="outline" className="gap-2">
              <BookOpen className="size-4" />
              {t('nav.items.lessons')}
            </ButtonLink>
          </>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          tone="brand"
          label={t('pages.teacher.dashboard.myChildren')}
          value={children.length}
          icon={<Heart className="size-5" />}
          href="/teacher/students"
        />
        <StatCard
          label={t('pages.teacher.dashboard.myClasses')}
          value={classes.length}
          icon={<Users className="size-5" />}
          href="/teacher/classes"
        />
        <StatCard
          label={t('pages.teacher.dashboard.averageAttendance')}
          value={`${averageAttendance}%`}
          icon={<ClipboardCheck className="size-5" />}
          href="/teacher/progress"
        />
        <StatCard
          label={t('pages.teacher.dashboard.unreadMessages')}
          value={threads.reduce((total, thread) => total + thread.unread, 0)}
          icon={<MessageSquare className="size-5" />}
          href="/teacher/messages"
        />
      </section>

      <div className="grid gap-5 xl:grid-cols-[1.5fr_1fr]">
        <Card>
          <CardHeader
            title={t('pages.teacher.dashboard.nextActivities')}
            description="Reminders are sent automatically before each one starts."
            action={
              <ButtonLink href="/teacher/schedule" size="sm" variant="ghost" className="gap-1.5">
                Full schedule
                <ArrowRight className="size-3.5" />
              </ButtonLink>
            }
          />
          <CardBody className="pt-2">
            {next.length ? (
              <div className="space-y-1">
                {next.map((activity) => (
                  <ActivityRow
                    key={activity.id}
                    activity={activity}
                    action={
                      <ButtonLink href="/teacher/attendance" size="sm" variant="secondary">
                        Attendance
                      </ButtonLink>
                    }
                  />
                ))}
              </div>
            ) : (
              <EmptyState title="Nothing scheduled" description="Enjoy the quiet week." />
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title={t('nav.items.notifications')}
            description="Class reminders and updates."
          />
          <CardBody className="pt-0">
            <NotificationList notifications={notifications} limit={4} />
          </CardBody>
        </Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_1fr]">
        <Card>
          <CardHeader
            title={t('pages.teacher.dashboard.myStudents')}
            description="Attendance across the current term."
            action={
              <ButtonLink href="/teacher/students" size="sm" variant="ghost">
                View all
              </ButtonLink>
            }
          />
          <CardBody className="space-y-3 pt-2">
            {children.slice(0, 5).map((child) => (
              <div key={child.id} className="flex items-center gap-3">
                <Avatar name={child.fullName} src={child.photoUrl} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[0.8125rem] font-semibold text-ink">
                    {child.fullName}
                  </p>
                  <ProgressBar value={child.attendanceRate} size="sm" />
                </div>
                <span className="text-[0.75rem] font-bold text-muted">
                  {child.attendanceRate}%
                </span>
              </div>
            ))}
          </CardBody>
        </Card>

        <Card>
          <CardHeader
            title={t('pages.teacher.dashboard.recentLessons')}
            description="What your classes are learning."
            action={
              <ButtonLink href="/teacher/lessons" size="sm" variant="ghost">
                All lessons
              </ButtonLink>
            }
          />
          <CardBody className="space-y-3 pt-2">
            {lessons.slice(0, 3).map((lesson) => (
              <Link
                key={lesson.id}
                href="/teacher/lessons"
                className="block rounded-lg bg-canvas/70 p-3.5 transition-colors hover:bg-brand-50"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-[0.8125rem] font-bold text-ink">{lesson.title}</p>
                  <Badge tone="neutral">
                    {groupForClassId(t, classes, lesson.classId)}
                  </Badge>
                </div>
                <p className="mt-1 text-[0.75rem] text-brand-700">{lesson.biblePassage}</p>
              </Link>
            ))}
            {!lessons.length ? <EmptyState title="No lessons yet" /> : null}
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader
          title={t('pages.teacher.dashboard.conversations')}
          description="Keep families informed about their children."
          action={
            <ButtonLink href="/teacher/messages" size="sm" variant="ghost">
              Open messages
            </ButtonLink>
          }
        />
        <CardBody className="pt-2">
          <div className="flex flex-wrap items-center gap-4">
            <AvatarStack names={threads.map((thread) => thread.withName)} />
            <p className="text-[0.8125rem] text-muted">
              {threads.length} conversations ·{' '}
              <strong className="text-ink">
                {threads.reduce((total, thread) => total + thread.unread, 0)} unread
              </strong>{' '}
              · {percent(threads.filter((t) => t.unread === 0).length, threads.length)}%
              answered
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
