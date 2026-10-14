'use client';

import { useState, useTransition } from 'react';
import {
  AlertCircle,
  BellRing,
  CheckCircle2,
  CircleStop,
  Clock,
  PlayCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Field, Select } from '@/components/ui/field';
import { sendClassAlert, type ClassAlertKind } from '@/lib/actions/notifications';

/**
 * One tap tells every parent in the class that it has started or ended.
 * The alert lands in their notification bell and plays a chime.
 */
export function ClassAlertButtons({
  classes,
}: {
  /** `label` is the age group (plus language when two streams share it). */
  classes: { id: string; label: string; group: string; childCount: number }[];
}) {
  const [classId, setClassId] = useState(classes[0]?.id ?? '');
  const [feedback, setFeedback] = useState<{ ok: boolean; message: string } | null>(null);
  const [pendingKind, setPendingKind] = useState<ClassAlertKind | null>(null);
  const [isPending, startTransition] = useTransition();

  const selected = classes.find((item) => item.id === classId);

  function send(alert: ClassAlertKind) {
    setPendingKind(alert);
    startTransition(async () => {
      const response = await sendClassAlert(classId, alert);
      setFeedback({
        ok: !response.error,
        message: response.error ?? response.message ?? '',
      });
      setPendingKind(null);
    });
  }

  if (!classes.length) {
    return (
      <p className="rounded-lg bg-canvas/70 px-4 py-3 text-[0.8125rem] text-muted">
        You have no group assigned here yet, so there is nobody to notify.
      </p>
    );
  }

  const buttons: {
    alert: ClassAlertKind;
    label: string;
    icon: typeof PlayCircle;
    variant: 'primary' | 'outline' | 'secondary';
  }[] = [
    { alert: 'starting_soon', label: 'Starts in 30 min', icon: Clock, variant: 'outline' },
    { alert: 'started', label: 'Class has started', icon: PlayCircle, variant: 'primary' },
    { alert: 'ended', label: 'Class has ended', icon: CircleStop, variant: 'secondary' },
  ];

  return (
    <div className="space-y-4">
      {classes.length > 1 ? (
        <Field label="Age group" htmlFor="alertClass">
          <Select
            id="alertClass"
            value={classId}
            onChange={(event) => setClassId(event.target.value)}
          >
            {classes.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label} · {item.childCount} children
              </option>
            ))}
          </Select>
        </Field>
      ) : null}

      <div className="flex flex-wrap gap-2.5">
        {buttons.map((button) => (
          <Button
            key={button.alert}
            variant={button.variant}
            onClick={() => send(button.alert)}
            disabled={isPending}
            className="gap-2"
          >
            <button.icon className="size-4" />
            {isPending && pendingKind === button.alert ? 'Sending…' : button.label}
          </Button>
        ))}
      </div>

      <p className="flex items-start gap-2 text-[0.75rem] leading-relaxed text-muted">
        <BellRing className="mt-0.5 size-3.5 shrink-0 text-brand-600" />
        Sends an instant alert to the{' '}
        <strong className="text-ink">{selected?.childCount ?? 0} families</strong> in{' '}
        {selected?.label}. It appears in their notification bell with a sound.
      </p>

      {feedback ? (
        <p
          className={
            feedback.ok
              ? 'flex items-start gap-2 rounded-sm bg-brand-100 px-4 py-3 text-[0.8125rem] font-medium text-brand-800'
              : 'flex items-start gap-2 rounded-sm bg-berry-100 px-4 py-3 text-[0.8125rem] font-medium text-berry-700'
          }
        >
          {feedback.ok ? (
            <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
          ) : (
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
          )}
          {feedback.message}
        </p>
      ) : null}
    </div>
  );
}
