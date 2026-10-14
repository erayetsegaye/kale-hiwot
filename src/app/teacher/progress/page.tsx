import { Award, TrendingUp } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardBody, CardHeader } from '@/components/ui/card';
import { ProgressBar, StatCard } from '@/components/ui/data-display';
import { PageHeader } from '@/components/ui/page-header';
import { getProgressSummary, listChildren } from '@/lib/data/queries';
import { getTeacherContext } from '@/lib/data/teacher-context';
import { childGroup } from '@/lib/class-label';
import { getT } from '@/lib/i18n/server';

export const metadata = { title: 'Progress' };

export default async function TeacherProgressPage() {
  const t = await getT();
  const { classIds } = await getTeacherContext();
  const children = await listChildren({ classIds });
  const progress = await Promise.all(
    children.map((child) => getProgressSummary(child.id)),
  );

  const average = (key: 'attendanceRate' | 'participation' | 'quizAverage') => {
    const values = progress.map((item) => item[key]);
    return values.length
      ? Math.round(values.reduce((sum, value) => sum + value, 0) / values.length)
      : 0;
  };

  return (
    <div className="space-y-6 py-2">
      <PageHeader
        eyebrow={t('pages.teacher.progress.eyebrow')}
        title={t('pages.teacher.progress.title')}
        description={t('pages.teacher.progress.description')}
        actions={<Button variant="outline">Share with parents</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard tone="brand" label="Average attendance" value={`${average('attendanceRate')}%`} icon={<TrendingUp className="size-5" />} />
        <StatCard label="Participation" value={`${average('participation')}%`} />
        <StatCard label="Quiz average" value={`${average('quizAverage')}%`} />
        <StatCard
          label="Memory verses"
          value={progress.reduce((sum, item) => sum + item.memoryVerses, 0)}
        />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {children.map((child, index) => {
          const summary = progress[index];
          return (
            <Card key={child.id}>
              <CardHeader
                title={child.fullName}
                description={childGroup(t, child)}
                action={<Avatar name={child.fullName} src={child.photoUrl} size="md" />}
              />
              <CardBody className="space-y-3.5 pt-2">
                <ProgressBar label="Attendance" value={summary.attendanceRate} />
                <ProgressBar label="Participation" value={summary.participation} tone="sky" />
                <ProgressBar label="Quiz average" value={summary.quizAverage} />
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <Badge tone="brand" icon={<Award className="size-3" />}>
                    {summary.memoryVerses} memory verses
                  </Badge>
                  {summary.achievements.map((achievement) => (
                    <Badge key={achievement.id} tone="plum">
                      {achievement.title}
                    </Badge>
                  ))}
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
