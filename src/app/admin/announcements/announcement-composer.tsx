'use client';

import { useActionState, useState } from 'react';
import { AlertCircle, AlertTriangle, CheckCircle2, Send, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Field, Input, Select, Textarea } from '@/components/ui/field';
import { sendAnnouncement, type ActionState } from '@/lib/actions/ministry';
import { ageBands as allAgeBands, audienceLabel } from '@/lib/labels';
import type { AgeBand, AudienceScope } from '@/lib/types';
import { cn } from '@/lib/utils';

const audiences = Object.keys(audienceLabel) as AudienceScope[];

export function AnnouncementComposer({
  classes = [],
}: {
  /** Identified by age group, e.g. "4–6 years · አማርኛ". */
  classes?: { id: string; label: string; band: string }[];
}) {
  const [urgent, setUrgent] = useState(false);
  const [audience, setAudience] = useState<AudienceScope>('everyone');
  const [bands, setBands] = useState<AgeBand[]>([]);
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    sendAnnouncement,
    {},
  );

  function toggleBand(band: AgeBand) {
    setBands((current) =>
      current.includes(band)
        ? current.filter((item) => item !== band)
        : [...current, band],
    );
  }

  return (
    <form
      action={formAction}
      className={cn(
        'rounded-xl p-5 shadow-card transition-colors',
        urgent ? 'bg-berry-100/70 ring-1 ring-berry-500/25' : 'bg-surface',
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="text-base font-bold text-ink">
          {urgent ? 'Emergency announcement' : 'New announcement'}
        </h3>
        <label className="flex cursor-pointer items-center gap-2 rounded-full bg-surface px-3 py-2 text-[0.75rem] font-semibold text-berry-700 ring-1 ring-berry-500/30">
          <input
            type="checkbox"
            name="urgent"
            checked={urgent}
            onChange={(event) => setUrgent(event.target.checked)}
            className="size-4 accent-[#c0453b]"
          />
          <AlertTriangle className="size-3.5" />
          Send as emergency
        </label>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-[1.6fr_1fr]">
        <Field label="Title" htmlFor="title" required>
          <Input id="title" name="title" placeholder="Gate B closed this Sunday" required />
        </Field>
        <Field label="Send to" htmlFor="audience">
          <Select
            id="audience"
            name="audience"
            value={audience}
            onChange={(event) => setAudience(event.target.value as AudienceScope)}
          >
            {audiences.map((scope) => (
              <option key={scope} value={scope}>
                {audienceLabel[scope]}
              </option>
            ))}
          </Select>
        </Field>
      </div>

      {/* Age-group targeting — only the families of children in these bands */}
      {audience === 'age_band' ? (
        <fieldset className="mt-1 mb-4 rounded-lg bg-brand-50 p-4">
          <legend className="flex items-center gap-2 px-1 text-[0.8125rem] font-bold text-brand-800">
            <Users className="size-4" />
            Which age groups?
          </legend>
          <p className="mt-1 mb-2.5 text-[0.75rem] text-brand-800/80">
            Only parents of children in the selected age groups — and the teachers who
            teach them — will receive this announcement.
          </p>
          <div className="grid gap-2 sm:grid-cols-4">
            {allAgeBands.map((band) => (
              <label
                key={band.band}
                className={cn(
                  'cursor-pointer rounded-sm px-3 py-2.5 text-center text-[0.8125rem] font-semibold transition-colors',
                  bands.includes(band.band)
                    ? 'bg-brand-700 text-white'
                    : 'bg-surface text-muted hover:text-brand-800',
                )}
              >
                <input
                  type="checkbox"
                  name="ageBands"
                  value={band.band}
                  checked={bands.includes(band.band)}
                  onChange={() => toggleBand(band.band)}
                  className="sr-only"
                />
                {band.label}
              </label>
            ))}
          </div>
          {bands.length ? (
            <p className="mt-2.5 text-[0.75rem] text-brand-800">
              Groups reached:{' '}
              <strong>
                {classes
                  .filter((klass) => bands.includes(klass.band as AgeBand))
                  .map((klass) => klass.label)
                  .join(', ') || '—'}
              </strong>
            </p>
          ) : (
            <p className="mt-2.5 text-[0.75rem] font-medium text-sun-700">
              Select at least one age group.
            </p>
          )}
        </fieldset>
      ) : null}

      {audience === 'class' ? (
        <Field label="Group" htmlFor="classId" className="mb-4">
          <Select id="classId" name="classId" defaultValue="">
            <option value="">Choose a group…</option>
            {classes.map((klass) => (
              <option key={klass.id} value={klass.id}>
                {klass.label}
              </option>
            ))}
          </Select>
        </Field>
      ) : null}

      <Field label="Message" htmlFor="body" required className="mt-1">
        <Textarea
          id="body"
          name="body"
          rows={4}
          placeholder="Write a clear, short message for families…"
          required
        />
      </Field>

      {state.error ? (
        <p className="mt-4 flex items-start gap-2 rounded-sm bg-berry-100 px-4 py-3 text-[0.8125rem] font-medium text-berry-700">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          {state.error}
        </p>
      ) : null}
      {state.message ? (
        <p className="mt-4 flex items-start gap-2 rounded-sm bg-brand-100 px-4 py-3 text-[0.8125rem] font-medium text-brand-800">
          <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
          {state.message}
        </p>
      ) : null}

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Button
          type="submit"
          disabled={pending || (audience === 'age_band' && bands.length === 0)}
          variant={urgent ? 'danger' : 'primary'}
          className="gap-2"
        >
          <Send className="size-4" />
          {pending ? 'Sending…' : urgent ? 'Send emergency alert' : 'Send announcement'}
        </Button>
        <p className="text-[0.75rem] text-muted">
          {urgent
            ? 'Delivered immediately as a push and in-app alert to everyone selected.'
            : 'Recipients see it in their notifications and announcement feed.'}
        </p>
      </div>
    </form>
  );
}
