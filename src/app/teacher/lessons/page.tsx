import { Plus } from 'lucide-react';
import { LessonCard } from '@/components/domain/lesson-card';
import { Button } from '@/components/ui/button';
import { Card, CardBody, CardHeader } from '@/components/ui/card';
import { Field, Input, Select, Textarea } from '@/components/ui/field';
import { PageHeader, SectionHeading } from '@/components/ui/page-header';
import { listLessons } from '@/lib/data/queries';
import { getTeacherContext } from '@/lib/data/teacher-context';
import { classLabelIn, groupForClassId } from '@/lib/class-label';
import { getT } from '@/lib/i18n/server';

export const metadata = { title: 'Lessons' };

export default async function TeacherLessonsPage() {
  const t = await getT();
  const { classes: myClasses, classIds } = await getTeacherContext();
  const lessons = await listLessons({ classIds });

  return (
    <div className="space-y-6 py-2">
      <PageHeader
        eyebrow={t('pages.teacher.lessons.eyebrow')}
        title={t('pages.teacher.lessons.title')}
        description={t('pages.teacher.lessons.description')}
      />

      <Card>
        <CardHeader
          title="Create a lesson"
          description="Published lessons become visible to the parents of children in that class."
          icon={<Plus className="size-[1.1rem]" />}
        />
        <CardBody className="space-y-4 pt-2">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Lesson title" htmlFor="title" required>
              <Input id="title" name="title" placeholder="God calls Samuel" />
            </Field>
            <Field label="Age group" htmlFor="classId" required>
              <Select id="classId" name="classId">
                {myClasses.map((klass) => (
                  <option key={klass.id} value={klass.id}>
                    {classLabelIn(t, myClasses, klass)}
                  </option>
                ))}
              </Select>
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Bible passage" htmlFor="passage">
              <Input id="passage" name="passage" placeholder="1 Samuel 3:1–21" />
            </Field>
            <Field label="Lesson date" htmlFor="date">
              <Input id="date" name="date" type="date" />
            </Field>
          </div>
          <Field label="Memory verse" htmlFor="memoryVerse">
            <Input
              id="memoryVerse"
              name="memoryVerse"
              placeholder="“Speak, Lord, for your servant is listening.” — 1 Samuel 3:9"
            />
          </Field>
          <Field label="Lesson content" htmlFor="content">
            <Textarea id="content" name="content" rows={4} placeholder="Outline, discussion questions, activities…" />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Homework" htmlFor="homework">
              <Textarea id="homework" name="homework" rows={2} placeholder="What should children do at home?" />
            </Field>
            <Field label="Quiz questions" htmlFor="quiz">
              <Textarea id="quiz" name="quiz" rows={2} placeholder="One question per line" />
            </Field>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button>Publish lesson</Button>
            <Button variant="outline">Save as draft</Button>
          </div>
        </CardBody>
      </Card>

      <section>
        <SectionHeading title="My lessons" description="Most recent first." />
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {lessons.map((lesson) => (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              groupLabel={groupForClassId(t, myClasses, lesson.classId)}
              action={
                <Button size="sm" variant="ghost">
                  Edit
                </Button>
              }
            />
          ))}
        </div>
      </section>
    </div>
  );
}
