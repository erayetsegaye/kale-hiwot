import { CalendarCheck } from 'lucide-react';
import { AttendanceTaker } from '@/components/domain/attendance-taker';
import { AttendanceBadge } from '@/components/ui/badge';
import { Card, CardBody, CardHeader } from '@/components/ui/card';
import {
  EmptyState,
  StatCard,
  Table,
  TableWrap,
  Td,
  Th,
  Tr,
} from '@/components/ui/data-display';
import { PageHeader } from '@/components/ui/page-header';
import { listActivities, listAttendance, listChildren } from '@/lib/data/queries';
import { getTeacherContext } from '@/lib/data/teacher-context';
import { ageBandLabel } from '@/lib/labels';
import { getT } from '@/lib/i18n/server';
import { getFormat } from '@/lib/i18n/format';

export const metadata = { title: 'Attendance' };

export default async function TeacherAttendancePage() {
  const t = await getT();
  const f = await getFormat();
  // Register only the children in the age group being taught right now.
  const { band, classIds } = await getTeacherContext();

  const [activities, children, history] = await Promise.all([
    listActivities({ classIds }),
    listChildren({ classIds }),
    listAttendance(),
  ]);

  const nextActivity = activities[0];
  const myHistory = history.filter((record) =>
    children.some((child) => child.id === record.childId),
  );

  return (
    <div className="space-y-6 py-2">
      <PageHeader
        eyebrow={t('pages.teacher.attendance.eyebrow')}
        title={
          band
            ? `${t('pages.teacher.attendance.title')} · ${ageBandLabel[band]}`
            : t('pages.teacher.attendance.title')
        }
        description={t('pages.teacher.attendance.description')}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          tone="brand"
          label="Children expected"
          value={children.length}
          icon={<CalendarCheck className="size-5" />}
        />
        <StatCard
          label="Checked in now"
          value={children.filter((child) => child.checkedIn).length}
        />
        <StatCard label="Records this term" value={myHistory.length} />
      </div>

      {nextActivity ? (
        <section>
          <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="font-display text-lg font-bold text-ink">
                {nextActivity.title}
              </h2>
              <p className="text-[0.8125rem] text-muted">
                {f.weekday(nextActivity.date)} ·{' '}
                {f.range(nextActivity.startTime, nextActivity.endTime)} ·{' '}
                {nextActivity.location}
              </p>
            </div>
          </div>
          <AttendanceTaker
            activityId={nextActivity.id}
            activityTitle={nextActivity.title}
            students={children.map((child) => ({
              id: child.id,
              fullName: child.fullName,
              photoUrl: child.photoUrl,
              note: child.allergies ? `Allergy: ${child.allergies}` : null,
            }))}
          />
        </section>
      ) : (
        <Card>
          <EmptyState title="No activity to register" description="You have no upcoming activities." />
        </Card>
      )}

      <Card>
        <CardHeader title="Recent records" description="Your previous submissions." />
        <CardBody className="px-0 pt-2 pb-0 sm:px-0">
          {myHistory.length ? (
            <TableWrap className="shadow-none">
              <Table>
                <thead>
                  <tr>
                    <Th>Child</Th>
                    <Th>Activity</Th>
                    <Th>Date</Th>
                    <Th>Status</Th>
                    <Th>Note</Th>
                  </tr>
                </thead>
                <tbody>
                  {myHistory.map((record) => (
                    <Tr key={record.id}>
                      <Td className="font-semibold text-ink">{record.childName}</Td>
                      <Td className="text-[0.8125rem] text-muted">{record.activityTitle}</Td>
                      <Td className="text-[0.8125rem] text-muted">{f.date(record.date)}</Td>
                      <Td>
                        <AttendanceBadge status={record.status} />
                      </Td>
                      <Td className="text-[0.8125rem] text-muted">{record.note ?? '—'}</Td>
                    </Tr>
                  ))}
                </tbody>
              </Table>
            </TableWrap>
          ) : (
            <EmptyState title="No attendance recorded yet" />
          )}
        </CardBody>
      </Card>
    </div>
  );
}
