import { Download, TrendingUp } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { AttendanceBadge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardBody, CardHeader } from '@/components/ui/card';
import {
  ProgressBar,
  StatCard,
  Table,
  TableWrap,
  Td,
  Th,
  Tr,
} from '@/components/ui/data-display';
import { PageHeader } from '@/components/ui/page-header';
import { listAttendance, listChildren, listClasses } from '@/lib/data/queries';
import { classLabelIn } from '@/lib/class-label';
import { getT } from '@/lib/i18n/server';
import { getFormat } from '@/lib/i18n/format';
import { percent } from '@/lib/utils';

export const metadata = { title: 'Attendance' };

export default async function AdminAttendancePage() {
  const t = await getT();
  const f = await getFormat();
  const [attendance, classes, children] = await Promise.all([
    listAttendance(),
    listClasses(),
    listChildren(),
  ]);

  const counts = {
    present: attendance.filter((r) => r.status === 'present').length,
    late: attendance.filter((r) => r.status === 'late').length,
    excused: attendance.filter((r) => r.status === 'excused').length,
    absent: attendance.filter((r) => r.status === 'absent').length,
  };

  return (
    <div className="space-y-6 py-2">
      <PageHeader
        eyebrow={t('pages.admin.attendance.eyebrow')}
        title={t('pages.admin.attendance.title')}
        description={t('pages.admin.attendance.description')}
        actions={
          <Button variant="outline" className="gap-2">
            <Download className="size-4" />
            {t('common.export')}
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          tone="brand"
          label="Present"
          value={counts.present}
          hint={`${percent(counts.present, attendance.length)}% of records`}
        />
        <StatCard label="Late" value={counts.late} />
        <StatCard label="Excused" value={counts.excused} />
        <StatCard label="Absent" value={counts.absent} />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_1.4fr]">
        <Card>
          <CardHeader
            title="Attendance by class"
            description="Average across the current term."
            icon={<TrendingUp className="size-[1.1rem]" />}
          />
          <CardBody className="space-y-4 pt-2">
            {classes.map((klass) => {
              const classChildren = children.filter((child) => child.classId === klass.id);
              const average = classChildren.length
                ? Math.round(
                    classChildren.reduce((sum, child) => sum + child.attendanceRate, 0) /
                      classChildren.length,
                  )
                : 0;
              return (
                <ProgressBar
                  key={klass.id}
                  label={classLabelIn(t, classes, klass)}
                  value={average}
                  tone={average < 75 ? 'sun' : 'brand'}
                />
              );
            })}
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Recent records" description="Most recent first." />
          <CardBody className="px-0 pt-2 pb-0 sm:px-0">
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
                  {attendance.map((record) => (
                    <Tr key={record.id}>
                      <Td>
                        <div className="flex items-center gap-2.5">
                          <Avatar name={record.childName} size="xs" />
                          <span className="font-semibold text-ink">{record.childName}</span>
                        </div>
                      </Td>
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
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
