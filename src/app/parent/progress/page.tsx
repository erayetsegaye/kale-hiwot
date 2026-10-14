import { Award, BookOpen, Sparkles } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Card, CardBody, CardHeader } from '@/components/ui/card';
import { EmptyState, ProgressBar } from '@/components/ui/data-display';
import { PageHeader } from '@/components/ui/page-header';
import { requireRole } from '@/lib/auth';
import {
  getGuardianForUser,
  getProgressSummary,
  listChildren,
  listProgressEntries,
} from '@/lib/data/queries';
import { ageBandLabel, bandForAge } from '@/lib/labels';
import { ageFromBirthDate } from '@/lib/utils';
import { getT } from '@/lib/i18n/server';

export const metadata = { title: 'Progress' };

export default async function ParentProgressPage() {
  const t = await getT();
  const user = await requireRole('parent');
  const guardian = await getGuardianForUser(user.id);
  const children = await listChildren({ guardianId: guardian?.id });

  // Parents see only what the teacher marked parent-visible.
  const summaries = await Promise.all(
    children.map(async (child) => ({
      summary: await getProgressSummary(child.id),
      entries: await listProgressEntries(child.id, 'parent'),
    })),
  );

  return (
    <div className="space-y-6 py-2">
      <PageHeader
        eyebrow={t('pages.parent.progress.eyebrow')}
        title={t('pages.parent.progress.title')}
        description={t('pages.parent.progress.description')}
      />

      {children.length ? (
        <div className="grid gap-5 lg:grid-cols-2">
          {children.map((child, index) => {
            const { summary, entries } = summaries[index];
            return (
              <Card key={child.id}>
                <CardHeader
                  title={child.fullName}
                  description={
                    bandForAge(ageFromBirthDate(child.birthDate))
                      ? ageBandLabel[bandForAge(ageFromBirthDate(child.birthDate))!]
                      : 'Awaiting group'
                  }
                  action={<Avatar name={child.fullName} src={child.photoUrl} size="md" />}
                />
                <CardBody className="space-y-4 pt-2">
                  <ProgressBar label="Attendance" value={summary.attendanceRate} />
                  <ProgressBar
                    label="Participation in class"
                    value={summary.participation}
                    tone="sky"
                  />
                  <ProgressBar label="Quiz average" value={summary.quizAverage} />

                  <div className="grid gap-3 pt-1 sm:grid-cols-2">
                    <div className="rounded-lg bg-brand-50 p-4">
                      <p className="flex items-center gap-2 text-[0.75rem] font-bold text-brand-800">
                        <BookOpen className="size-3.5" />
                        Memory verses
                      </p>
                      <p className="mt-1 font-display text-2xl font-extrabold text-brand-800">
                        {summary.memoryVerses}
                      </p>
                    </div>
                    <div className="rounded-lg bg-canvas/70 p-4">
                      <p className="flex items-center gap-2 text-[0.75rem] font-bold text-ink">
                        <Sparkles className="size-3.5 text-sun-500" />
                        Achievements
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {summary.achievements.length ? (
                          summary.achievements.map((achievement) => (
                            <Badge
                              key={achievement.id}
                              tone="plum"
                              icon={<Award className="size-3" />}
                            >
                              {achievement.title}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-[0.75rem] text-faint">—</span>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* What the teacher recorded, newest first */}
                  {entries.length ? (
                    <ul className="space-y-2 border-t border-line/60 pt-4">
                      {entries.slice(0, 5).map((entry) => (
                        <li key={entry.id} className="flex items-start gap-2.5">
                          <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand-400" />
                          <span className="min-w-0">
                            <span className="block text-[0.8125rem] font-semibold text-ink">
                              {entry.title}
                              {entry.score !== null ? (
                                <span className="ml-2 text-brand-700">{entry.score}%</span>
                              ) : null}
                            </span>
                            {entry.detail ? (
                              <span className="block text-[0.75rem] leading-relaxed text-muted">
                                {entry.detail}
                              </span>
                            ) : null}
                            <span className="block text-[0.625rem] text-faint">
                              {entry.recordedByName}
                            </span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </CardBody>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <EmptyState title="No progress to show yet" />
        </Card>
      )}
    </div>
  );
}
