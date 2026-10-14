import { Plus } from 'lucide-react';
import { LessonCard } from '@/components/domain/lesson-card';
import { Button } from '@/components/ui/button';
import { StatCard } from '@/components/ui/data-display';
import { PageHeader } from '@/components/ui/page-header';
import { Tabs } from '@/components/ui/tabs';
import { listClasses, listLessons } from '@/lib/data/queries';
import { classLabelIn, groupForClassId } from '@/lib/class-label';
import { getT } from '@/lib/i18n/server';

export const metadata = { title: 'Lessons' };

export default async function AdminLessonsPage({
  searchParams,
}: {
  searchParams: Promise<{ class?: string }>;
}) {
  const t = await getT();
  const params = await searchParams;
  const [allLessons, classes] = await Promise.all([listLessons(), listClasses()]);
  const lessons = params.class
    ? allLessons.filter((lesson) => lesson.classId === params.class)
    : allLessons;

  return (
    <div className="space-y-6 py-2">
      <PageHeader
        eyebrow={t('pages.admin.lessons.eyebrow')}
        title={t('pages.admin.lessons.title')}
        description={t('pages.admin.lessons.description')}
        actions={
          <Button className="gap-2">
            <Plus className="size-4" />
            New lesson
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Lessons" value={allLessons.length} />
        <StatCard
          label="Published"
          value={allLessons.filter((lesson) => lesson.status === 'published').length}
        />
        <StatCard
          label="With homework"
          value={allLessons.filter((lesson) => lesson.hasHomework).length}
        />
        <StatCard
          label="With quizzes"
          value={allLessons.filter((lesson) => lesson.hasQuiz).length}
        />
      </div>

      <Tabs
        active={params.class ? `/admin/lessons?class=${params.class}` : '/admin/lessons'}
        items={[
          { label: 'All age groups', href: '/admin/lessons', count: allLessons.length },
          ...classes.map((klass) => ({
            label: classLabelIn(t, classes, klass),
            href: `/admin/lessons?class=${klass.id}`,
            count: allLessons.filter((lesson) => lesson.classId === klass.id).length,
          })),
        ]}
      />

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {lessons.map((lesson) => (
          <LessonCard
            key={lesson.id}
            lesson={lesson}
            groupLabel={groupForClassId(t, classes, lesson.classId)}
            action={
              <Button size="sm" variant="ghost">
                Edit
              </Button>
            }
          />
        ))}
      </div>
    </div>
  );
}
