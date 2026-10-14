import { Download, FileBarChart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardBody, CardHeader } from '@/components/ui/card';
import { ProgressBar, StatCard } from '@/components/ui/data-display';
import { PageHeader } from '@/components/ui/page-header';
import { getAdminOverview } from '@/lib/data/queries';
import { classLabelIn } from '@/lib/class-label';
import { getT } from '@/lib/i18n/server';
import { percent } from '@/lib/utils';

export const metadata = { title: 'Reports' };

const months = ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'];
const attendanceTrend = [78, 82, 86, 84, 90, 93];

const reports = [
  { title: 'Attendance summary', description: 'Per class, per activity, per child.' },
  { title: 'Registration pipeline', description: 'Submitted, approved and pending.' },
  { title: 'Teacher coverage', description: 'Assignments and safeguarding status.' },
  { title: 'Lesson completion', description: 'Published lessons, homework and quizzes.' },
  { title: 'Event participation', description: 'Registrations, waitlists and consent.' },
  { title: 'Safeguarding audit', description: 'Pick-up records and consent coverage.' },
];

export default async function AdminReportsPage() {
  const t = await getT();
  const { stats, classes, children } = await getAdminOverview();

  return (
    <div className="space-y-6 py-2">
      <PageHeader
        eyebrow={t('pages.admin.reports.eyebrow')}
        title={t('pages.admin.reports.title')}
        description={t('pages.admin.reports.description')}
        actions={
          <Button variant="outline" className="gap-2">
            <Download className="size-4" />
            Export all (CSV)
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard tone="brand" label="Attendance rate" value={`${stats.attendanceRate}%`} trend={{ value: '+3%', direction: 'up' }} />
        <StatCard label="Children" value={stats.totalChildren} hint="Active records" />
        <StatCard label="Classes running" value={stats.totalClasses} />
        <StatCard label="Pending approvals" value={stats.pendingRegistrations} />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.3fr_1fr]">
        <Card>
          <CardHeader
            title="Attendance trend"
            description="Average across all classes, last six months."
            icon={<FileBarChart className="size-[1.1rem]" />}
          />
          <CardBody className="pt-4">
            <div className="flex h-52 items-end gap-3">
              {attendanceTrend.map((value, index) => (
                <div key={months[index]} className="flex flex-1 flex-col items-center gap-2">
                  <span className="text-[0.6875rem] font-bold text-ink">{value}%</span>
                  <div
                    className="w-full rounded-t-md bg-brand-600 transition-all"
                    style={{ height: `${value}%` }}
                  />
                  <span className="text-[0.6875rem] text-muted">{months[index]}</span>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardHeader title="Class distribution" description="Share of children per class." />
          <CardBody className="space-y-4 pt-3">
            {classes.map((klass) => (
              <ProgressBar
                key={klass.id}
                label={`${classLabelIn(t, classes, klass)} (${klass.childCount})`}
                value={percent(
                  klass.childCount,
                  classes.reduce((sum, item) => sum + item.childCount, 0),
                )}
              />
            ))}
          </CardBody>
        </Card>
      </div>

      <Card>
        <CardHeader
          title="Standard reports"
          description={`Generated from ${children.length} child records and linked activity data.`}
        />
        <CardBody className="grid gap-3 pt-3 sm:grid-cols-2 xl:grid-cols-3">
          {reports.map((report) => (
            <div
              key={report.title}
              className="card-hover rounded-lg bg-canvas/70 p-4"
            >
              <p className="text-[0.875rem] font-bold text-ink">{report.title}</p>
              <p className="mt-1 text-[0.75rem] leading-relaxed text-muted">
                {report.description}
              </p>
              <Button size="sm" variant="secondary" className="mt-3 gap-1.5">
                <Download className="size-3.5" />
                Generate
              </Button>
            </div>
          ))}
        </CardBody>
      </Card>
    </div>
  );
}
