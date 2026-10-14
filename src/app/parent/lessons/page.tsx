import { NotebookPen } from 'lucide-react';
import { LessonCard } from '@/components/domain/lesson-card';
import { Button } from '@/components/ui/button';
import { Card, CardBody, CardHeader } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/data-display';
import { PageHeader, SectionHeading } from '@/components/ui/page-header';
import { requireRole } from '@/lib/auth';
import {
  getGuardianForUser,
  listChildren,
  listClasses,
  listLessons,
} from '@/lib/data/queries';
import { ageBandLabel } from '@/lib/labels';
import { getT } from '@/lib/i18n/server';

export const metadata = { title: 'Lessons' };

export default async function ParentLessonsPage() {
  const t = await getT();
  const user = await requireRole('parent');
  const guardian = await getGuardianForUser(user.id);
  const children = await listChildren({ guardianId: guardian?.id });
  const classIds = children.map((child) => child.classId).filter(Boolean) as string[];
  const [allLessons, classes] = await Promise.all([listLessons(), listClasses()]);
  const lessons = allLessons.filter(
    (lesson) => classIds.includes(lesson.classId) && lesson.status === 'published',
  );
  const homework = lessons.filter((lesson) => lesson.hasHomework);

  // Parents see the age group, not the internal class name.
  const groupFor = (classId: string) => {
    const band = classes.find((klass) => klass.id === classId)?.ageBand;
    return band ? ageBandLabel[band] : 'Age group';
  };

  return (
    <div className="space-y-6 py-2">
      <PageHeader
        eyebrow={t('pages.parent.lessons.eyebrow')}
        title={t('pages.parent.lessons.title')}
        description={t('pages.parent.lessons.description')}
      />

      {homework.length ? (
        <Card>
          <CardHeader
            title="Homework to do at home"
            description="A few minutes together makes a big difference."
            icon={<NotebookPen className="size-[1.1rem]" />}
          />
          <CardBody className="space-y-2.5 pt-2">
            {homework.map((lesson) => (
              <div
                key={lesson.id}
                className="flex flex-wrap items-center gap-3 rounded-lg bg-canvas/70 px-4 py-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[0.8125rem] font-bold text-ink">
                    {lesson.title}
                  </p>
                  <p className="truncate text-[0.6875rem] text-muted">
                    {groupFor(lesson.classId)} · {lesson.biblePassage}
                  </p>
                </div>
                <Button size="sm" variant="secondary">
                  Mark as done
                </Button>
              </div>
            ))}
          </CardBody>
        </Card>
      ) : null}

      <section>
        <SectionHeading title="Lessons" description="Shared by your children's teachers." />
        {lessons.length ? (
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {lessons.map((lesson) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                groupLabel={groupFor(lesson.classId)}
              />
            ))}
          </div>
        ) : (
          <Card>
            <EmptyState
              title="No lessons shared yet"
              description="Lessons appear here once a teacher publishes them."
            />
          </Card>
        )}
      </section>
    </div>
  );
}
