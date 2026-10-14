'use client';

import { useActionState, useState } from 'react';
import { AlertCircle, CalendarPlus, CheckCircle2, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox, Field, Input, Select, Textarea } from '@/components/ui/field';
import { saveActivity, type ActionState } from '@/lib/actions/ministry';
import {
  activityTypeLabel,
  audienceLabel,
  recurrenceLabel,
  reminderLabel,
  reminderOrder,
  weekdays,
} from '@/lib/labels';
import type { ActivityType, AudienceScope, RecurrenceFrequency } from '@/lib/types';
import { cn } from '@/lib/utils';

const types = Object.keys(activityTypeLabel) as ActivityType[];
const audiences = Object.keys(audienceLabel) as AudienceScope[];
const recurrences = Object.keys(recurrenceLabel) as RecurrenceFrequency[];

export function ActivityForm({
  classes,
}: {
  /** Groups are listed by age, e.g. "7–9 years". */
  classes: { id: string; label: string }[];
}) {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    saveActivity,
    {},
  );

  return (
    <div className="overflow-hidden rounded-xl bg-surface shadow-card">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center gap-3 px-5 py-4 text-left"
        aria-expanded={open}
      >
        <span className="flex size-10 items-center justify-center rounded-full bg-brand-700 text-white">
          <CalendarPlus className="size-5" />
        </span>
        <span className="flex-1">
          <span className="block text-sm font-bold text-ink">Create an activity</span>
          <span className="block text-[0.75rem] text-muted">
            Any day of the week — class, Bible study, choir, meeting, camp or your own
            custom activity.
          </span>
        </span>
        <ChevronDown
          className={cn(
            'size-5 shrink-0 text-muted transition-transform',
            open && 'rotate-180',
          )}
        />
      </button>

      {open ? (
        <form action={formAction} className="space-y-5 border-t border-line/60 p-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Activity name" htmlFor="title" required>
              <Input id="title" name="title" placeholder="Junior Class" required />
            </Field>
            <Field label="Activity type" htmlFor="type" required>
              <Select id="type" name="type" defaultValue="class">
                {types.map((type) => (
                  <option key={type} value={type}>
                    {activityTypeLabel[type]}
                  </option>
                ))}
              </Select>
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Date" htmlFor="date" required>
              <Input id="date" name="date" type="date" required />
            </Field>
            <Field label="Start time" htmlFor="startTime" required>
              <Input id="startTime" name="startTime" type="time" defaultValue="09:00" required />
            </Field>
            <Field label="End time" htmlFor="endTime" required>
              <Input id="endTime" name="endTime" type="time" defaultValue="10:30" required />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Location" htmlFor="location">
              <Input id="location" name="location" placeholder="Room B — Olive Wing" />
            </Field>
            <Field label="Age group" htmlFor="classId">
              <Select id="classId" name="classId" defaultValue="">
                <option value="">All age groups</option>
                {classes.map((klass) => (
                  <option key={klass.id} value={klass.id}>
                    {klass.label}
                  </option>
                ))}
              </Select>
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Target audience" htmlFor="audience">
              <Select id="audience" name="audience" defaultValue="class">
                {audiences.map((audience) => (
                  <option key={audience} value={audience}>
                    {audienceLabel[audience]}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Repeats" htmlFor="recurrence">
              <Select id="recurrence" name="recurrence" defaultValue="weekly">
                {recurrences.map((recurrence) => (
                  <option key={recurrence} value={recurrence}>
                    {recurrenceLabel[recurrence]}
                  </option>
                ))}
              </Select>
            </Field>
          </div>

          <Field label="Description" htmlFor="description">
            <Textarea
              id="description"
              name="description"
              rows={3}
              placeholder="What happens in this activity?"
            />
          </Field>

          <fieldset>
            <legend className="mb-2 text-[0.8125rem] font-semibold text-ink">
              Repeat on
            </legend>
            <div className="flex flex-wrap gap-2">
              {weekdays.map((day) => (
                <label
                  key={day}
                  className="cursor-pointer rounded-full bg-canvas px-3.5 py-2 text-[0.75rem] font-semibold text-muted transition-colors has-checked:bg-brand-700 has-checked:text-white"
                >
                  <input
                    type="checkbox"
                    name="recurrenceDays"
                    value={day.toLowerCase()}
                    className="sr-only"
                  />
                  {day.slice(0, 3)}
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-1 text-[0.8125rem] font-semibold text-ink">
              Reminders
            </legend>
            <p className="mb-2 text-[0.75rem] text-muted">
              Participants are notified automatically — including when the activity
              starts and ends.
            </p>
            <div className="grid gap-1 sm:grid-cols-2 lg:grid-cols-3">
              {reminderOrder.map((reminder) => (
                <Checkbox
                  key={reminder}
                  name="reminders"
                  value={reminder}
                  label={reminderLabel[reminder]}
                  defaultChecked={reminder === 'thirty_min' || reminder === 'at_start'}
                />
              ))}
            </div>
          </fieldset>

          {state.error ? (
            <p className="flex items-start gap-2 rounded-sm bg-berry-100 px-4 py-3 text-[0.8125rem] font-medium text-berry-700">
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              {state.error}
            </p>
          ) : null}
          {state.message ? (
            <p className="flex items-start gap-2 rounded-sm bg-brand-100 px-4 py-3 text-[0.8125rem] font-medium text-brand-800">
              <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
              {state.message}
            </p>
          ) : null}

          <div className="flex flex-wrap gap-3">
            <Button type="submit" disabled={pending}>
              {pending ? 'Scheduling…' : 'Schedule activity'}
            </Button>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </div>
        </form>
      ) : null}
    </div>
  );
}
