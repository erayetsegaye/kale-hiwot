'use client';

import { useMemo, useState, useTransition } from 'react';
import { CheckCircle2, Save, Search } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/field';
import { saveAttendance } from '@/lib/actions/ministry';
import { useT } from '@/lib/i18n/client';
import { attendanceText } from '@/lib/i18n/domain';
import type { AttendanceStatus } from '@/lib/types';
import { cn } from '@/lib/utils';

const statuses: { value: AttendanceStatus; active: string }[] = [
  { value: 'present', active: 'bg-brand-700 text-white' },
  { value: 'late', active: 'bg-sun-500 text-white' },
  { value: 'excused', active: 'bg-sky-500 text-white' },
  { value: 'absent', active: 'bg-berry-500 text-white' },
];

export function AttendanceTaker({
  activityId,
  activityTitle,
  students,
}: {
  activityId: string;
  activityTitle: string;
  students: {
    id: string;
    fullName: string;
    photoUrl: string | null;
    note?: string | null;
  }[];
}) {
  const [marks, setMarks] = useState<Record<string, AttendanceStatus>>({});
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const t = useT();

  const visible = useMemo(
    () =>
      students.filter((child) =>
        child.fullName.toLowerCase().includes(search.trim().toLowerCase()),
      ),
    [students, search],
  );

  const counts = useMemo(() => {
    const base: Record<AttendanceStatus, number> = {
      present: 0,
      late: 0,
      excused: 0,
      absent: 0,
    };
    Object.values(marks).forEach((status) => {
      base[status] += 1;
    });
    return base;
  }, [marks]);

  function submit() {
    const entries = students.map((child) => ({
      childId: child.id,
      status: marks[child.id] ?? ('absent' as AttendanceStatus),
    }));
    startTransition(async () => {
      const response = await saveAttendance(activityId, entries);
      setMessage(response.error ?? response.message ?? null);
    });
  }

  return (
    <div className="rounded-xl bg-surface shadow-card">
      <div className="flex flex-wrap items-center gap-3 p-5">
        <label className="relative min-w-[12rem] flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-faint" />
          <span className="sr-only">Search children</span>
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={t('ui.searchChild')}
            className="pl-11"
          />
        </label>
        <Button
          variant="secondary"
          onClick={() =>
            setMarks(
              Object.fromEntries(students.map((child) => [child.id, 'present' as const])),
            )
          }
        >
          {t('ui.markAllPresent')}
        </Button>
        <Button onClick={submit} disabled={isPending} className="gap-2">
          <Save className="size-4" />
          {isPending ? t('ui.saving') : t('ui.saveAttendance')}
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 px-5 pb-4">
        {statuses.map((status) => (
          <span
            key={status.value}
            className="rounded-full bg-canvas px-3 py-1 text-[0.6875rem] font-semibold text-muted"
          >
            {attendanceText(t, status.value)}:{' '}
            <strong className="text-ink">{counts[status.value]}</strong>
          </span>
        ))}
        <span className="rounded-full bg-canvas px-3 py-1 text-[0.6875rem] font-semibold text-muted">
          {t('ui.notMarked')}:{' '}
          <strong className="text-ink">{students.length - Object.keys(marks).length}</strong>
        </span>
      </div>

      {message ? (
        <p className="mx-5 mb-4 flex items-center gap-2 rounded-sm bg-brand-100 px-4 py-3 text-[0.8125rem] font-medium text-brand-800">
          <CheckCircle2 className="size-4 shrink-0" />
          {message}
        </p>
      ) : null}

      <ul className="divide-y divide-line/60 border-t border-line/60">
        {visible.map((child) => (
          <li
            key={child.id}
            className="flex flex-wrap items-center gap-4 px-5 py-3.5 transition-colors hover:bg-brand-50/40"
          >
            <Avatar name={child.fullName} src={child.photoUrl} size="sm" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[0.875rem] font-semibold text-ink">
                {child.fullName}
              </p>
              {child.note ? (
                <p className="truncate text-[0.6875rem] text-sun-700">{child.note}</p>
              ) : null}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {statuses.map((status) => {
                const active = marks[child.id] === status.value;
                return (
                  <button
                    key={status.value}
                    type="button"
                    aria-pressed={active}
                    onClick={() =>
                      setMarks((prev) => ({ ...prev, [child.id]: status.value }))
                    }
                    className={cn(
                      'rounded-full px-3 py-1.5 text-[0.75rem] font-semibold transition-colors',
                      active
                        ? status.active
                        : 'bg-canvas text-muted hover:bg-brand-50 hover:text-brand-800',
                    )}
                  >
                    {attendanceText(t, status.value)}
                  </button>
                );
              })}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
