import { Avatar } from '@/components/ui/avatar';
import { AttendanceBadge } from '@/components/ui/badge';
import { Card, CardBody, CardHeader } from '@/components/ui/card';
import {
  EmptyState,
  ProgressBar,
  StatCard,
  Table,
  TableWrap,
  Td,
  Th,
  Tr,
} from '@/components/ui/data-display';
import { PageHeader } from '@/components/ui/page-header';
import { requireRole } from '@/lib/auth';
import { getGuardianForUser, listAttendance, listChildren } from '@/lib/data/queries';
import { ageBandLabel, bandForAge } from '@/lib/labels';
import { getT } from '@/lib/i18n/server';
import { getFormat } from '@/lib/i18n/format';
import { ageFromBirthDate, percent } from '@/lib/utils';

export const metadata = { title: 'Attendance' };

export default async function ParentAttendancePage() {
  const t = await getT();
  const f = await getFormat();
  const user = await requireRole('parent');
  const guardian = await getGuardianForUser(user.id);
  const children = await listChildren({ guardianId: guardian?.id });
  const childIds = children.map((child) => child.id);
  const records = (await listAttendance()).filter((record) =>
    childIds.includes(record.childId),
  );

  const present = records.filter((record) => record.status === 'present').length;

  return (
    <div className="space-y-6 py-2">
      <PageHeader
        eyebrow={t('pages.parent.attendance.eyebrow')}
        title={t('pages.parent.attendance.title')}
        description={t('pages.parent.attendance.description')}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard tone="brand" label="Overall attendance" value={`${percent(present, records.length)}%`} />
        <StatCard label="Present" value={present} />
        <StatCard label="Late" value={records.filter((r) => r.status === 'late').length} />
        <StatCard label="Absent" value={records.filter((r) => r.status === 'absent').length} />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {children.map((child) => (
          <Card key={child.id}>
            <CardBody className="flex items-center gap-4">
              <Avatar name={child.fullName} src={child.photoUrl} size="lg" />
              <div className="min-w-0 flex-1">
                <p className="text-[0.9375rem] font-bold text-ink">{child.fullName}</p>
                <p className="mb-2 text-[0.75rem] text-muted">
                  {bandForAge(ageFromBirthDate(child.birthDate))
                    ? ageBandLabel[bandForAge(ageFromBirthDate(child.birthDate))!]
                    : 'Awaiting group'}
                </p>
                <ProgressBar value={child.attendanceRate} size="sm" />
              </div>
              <span className="font-display text-xl font-extrabold text-brand-700">
                {child.attendanceRate}%
              </span>
            </CardBody>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader title="Attendance history" description="Most recent first." />
        <CardBody className="px-0 pt-2 pb-0 sm:px-0">
          {records.length ? (
            <TableWrap className="shadow-none">
              <Table>
                <thead>
                  <tr>
                    <Th>Child</Th>
                    <Th>Activity</Th>
                    <Th>Date</Th>
                    <Th>Status</Th>
                    <Th>Checked out by</Th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record) => (
                    <Tr key={record.id}>
                      <Td className="font-semibold text-ink">{record.childName}</Td>
                      <Td className="text-[0.8125rem] text-muted">{record.activityTitle}</Td>
                      <Td className="text-[0.8125rem] text-muted">{f.date(record.date)}</Td>
                      <Td>
                        <AttendanceBadge status={record.status} />
                      </Td>
                      <Td className="text-[0.8125rem] text-muted">
                        {record.checkedOutBy ?? '—'}
                      </Td>
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
