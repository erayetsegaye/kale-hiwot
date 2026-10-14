import {
  BookOpen,
  FileText,
  Film,
  ImageIcon,
  Link2,
  NotebookPen,
  Quote,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { publishStatusText } from '@/lib/i18n/domain';
import { getT } from '@/lib/i18n/server';
import { getFormat } from '@/lib/i18n/format';
import type { Lesson } from '@/lib/types';

const materialIcon = {
  pdf: FileText,
  video: Film,
  image: ImageIcon,
  link: Link2,
} as const;

export async function LessonCard({
  lesson,
  action,
  /** Parents see the age group here instead of the class name. */
  groupLabel,
}: {
  lesson: Lesson;
  action?: React.ReactNode;
  groupLabel?: string;
}) {
  const t = await getT();
  const f = await getFormat();
  return (
    <article className="card-hover flex h-full flex-col rounded-lg bg-surface p-5 shadow-card">
      <div className="flex items-start justify-between gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-700">
          <BookOpen className="size-5" />
        </span>
        <div className="flex flex-wrap justify-end gap-1.5">
          <Badge tone="neutral">{groupLabel ?? lesson.className}</Badge>
          {lesson.status === 'draft' ? (
            <Badge tone="sun">{publishStatusText(t, 'draft')}</Badge>
          ) : null}
        </div>
      </div>

      <h3 className="mt-4 text-base font-bold text-ink">{lesson.title}</h3>
      <p className="mt-1 text-[0.75rem] font-semibold text-brand-700">
        {lesson.biblePassage}
      </p>
      <p className="mt-2 line-clamp-2 text-[0.8125rem] leading-relaxed text-muted">
        {lesson.summary}
      </p>

      <blockquote className="mt-4 flex gap-2.5 rounded-sm bg-brand-50 p-3.5 text-[0.75rem] leading-relaxed text-brand-800 italic">
        <Quote className="size-4 shrink-0 text-brand-400" />
        {lesson.memoryVerse}
      </blockquote>

      <div className="mt-4 flex flex-wrap gap-1.5">
        {lesson.hasHomework ? (
          <Badge tone="sky" icon={<NotebookPen className="size-3" />}>
            {t('ui.homework')}
          </Badge>
        ) : null}
        {lesson.hasQuiz ? <Badge tone="plum">{t('ui.quiz')}</Badge> : null}
        {lesson.materials.map((material) => {
          const Icon = materialIcon[material.kind];
          return (
            <Badge key={material.label} tone="neutral" icon={<Icon className="size-3" />}>
              {material.label}
            </Badge>
          );
        })}
      </div>

      <div className="mt-auto flex items-center justify-between gap-3 pt-5 text-[0.75rem] text-faint">
        <span>
          {lesson.teacherName} · {f.date(lesson.date)}
        </span>
        {action ?? null}
      </div>
    </article>
  );
}
