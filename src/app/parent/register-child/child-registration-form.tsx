'use client';

import { useActionState, useMemo, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Heart,
  Phone,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardBody, CardHeader } from '@/components/ui/card';
import { Checkbox, Field, Input, Select, Textarea } from '@/components/ui/field';
import { registerChild, type ActionState } from '@/lib/actions/ministry';
import { ageBands, bandForAge } from '@/lib/labels';
import { MAX_AGE, MIN_AGE } from '@/lib/types';
import { cn } from '@/lib/utils';

const steps = [
  { label: 'About the child', icon: Heart },
  { label: 'Guardian & emergency', icon: Phone },
  { label: 'Safety & consent', icon: ShieldCheck },
];

export interface RegistrationClassOption {
  id: string;
  /** Groups are shown by age, never by an internal class name. */
  ageRange: string;
  minAge: number;
  maxAge: number;
}

function ageFrom(birthDate: string) {
  if (!birthDate) return null;
  const dob = new Date(birthDate);
  if (Number.isNaN(dob.getTime())) return null;
  return Math.floor((Date.now() - dob.getTime()) / (1000 * 60 * 60 * 24 * 365.25));
}

export function ChildRegistrationForm({
  classes,
  guardian,
}: {
  classes: RegistrationClassOption[];
  guardian: { fullName: string; email: string; phone: string | null };
}) {
  const [step, setStep] = useState(0);
  const [birthDate, setBirthDate] = useState('');
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    registerChild,
    {},
  );

  const age = ageFrom(birthDate);
  const band = age === null ? null : bandForAge(age);
  const outOfRange = age !== null && (age < MIN_AGE || age > MAX_AGE);

  /** Groups that fit the child's age. */
  const matching = useMemo(() => {
    if (age === null || outOfRange) return [];
    return classes.filter((klass) => age >= klass.minAge && age <= klass.maxAge);
  }, [age, classes, outOfRange]);

  if (state.ok) {
    return (
      <Card>
        <CardBody className="flex flex-col items-center gap-3 py-14 text-center">
          <span className="flex size-14 items-center justify-center rounded-full bg-brand-100 text-brand-700">
            <CheckCircle2 className="size-7" />
          </span>
          <h2 className="font-display text-xl font-extrabold text-ink">
            Registration submitted
          </h2>
          <p className="max-w-md text-sm leading-relaxed text-muted">{state.message}</p>
          <p className="mt-2 rounded-full bg-sun-100 px-4 py-2 text-[0.75rem] font-semibold text-sun-700">
            Status: Pending → Admin review → Approved
          </p>
        </CardBody>
      </Card>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      {/* Stepper */}
      <ol className="flex flex-wrap gap-2">
        {steps.map((item, index) => (
          <li key={item.label} className="flex-1">
            <button
              type="button"
              onClick={() => setStep(index)}
              className={cn(
                'flex w-full items-center gap-2.5 rounded-full px-4 py-2.5 text-left text-[0.75rem] font-semibold transition-colors',
                index === step
                  ? 'bg-brand-700 text-white'
                  : index < step
                    ? 'bg-brand-100 text-brand-800'
                    : 'bg-surface text-muted shadow-card',
              )}
            >
              <span
                className={cn(
                  'flex size-6 shrink-0 items-center justify-center rounded-full text-[0.625rem] font-bold',
                  index === step ? 'bg-white/20' : 'bg-canvas text-brand-700',
                )}
              >
                {index + 1}
              </span>
              <span className="truncate">{item.label}</span>
            </button>
          </li>
        ))}
      </ol>

      {/* Step 1 */}
      <Card className={step === 0 ? '' : 'hidden'}>
        <CardHeader
          title="About the child"
          description="These details help us place your child in the right class."
          icon={<Heart className="size-[1.1rem]" />}
        />
        <CardBody className="space-y-4 pt-2">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="First name" htmlFor="firstName" required>
              <Input id="firstName" name="firstName" placeholder="Naomi" required />
            </Field>
            <Field label="Last name" htmlFor="lastName" required>
              <Input id="lastName" name="lastName" placeholder="Yonas" required />
            </Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Date of birth"
              htmlFor="birthDate"
              hint={`ages ${MIN_AGE}–${MAX_AGE}`}
              required
              error={
                outOfRange
                  ? `The children's ministry serves ages ${MIN_AGE}–${MAX_AGE}. This child is ${age}.`
                  : undefined
              }
            >
              <Input
                id="birthDate"
                name="birthDate"
                type="date"
                value={birthDate}
                onChange={(event) => setBirthDate(event.target.value)}
                required
              />
            </Field>
            <Field label="Gender" htmlFor="gender">
              <Select id="gender" name="gender" defaultValue="female">
                <option value="female">Girl</option>
                <option value="male">Boy</option>
              </Select>
            </Field>
          </div>

          {/* Age-matched groups */}
          <Field
            label="Preferred class"
            htmlFor="classId"
            hint={band ? `age band ${band}` : 'enter a date of birth first'}
          >
            <Select id="classId" name="classId" defaultValue="">
              <option value="">Let the ministry decide</option>
              {(matching.length ? matching : classes).map((klass) => (
                <option key={klass.id} value={klass.id}>
                  {klass.ageRange}
                </option>
              ))}
            </Select>
          </Field>

          {age !== null && !outOfRange ? (
            <div className="rounded-lg bg-brand-50 p-4">
              <p className="text-[0.75rem] font-bold text-brand-800">
                {age} years old · age band{' '}
                {ageBands.find((entry) => entry.band === band)?.label}
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {matching.length ? (
                  matching.map((klass) => (
                    <Badge key={klass.id} tone="brand">
                      {klass.ageRange}
                    </Badge>
                  ))
                ) : (
                  <span className="text-[0.75rem] text-brand-800/80">
                    No class currently open for this age — the ministry team will contact
                    you.
                  </span>
                )}
              </div>
            </div>
          ) : null}

          <Field label="Previous group" htmlFor="previousClass" hint="optional">
            <Input
              id="previousClass"
              name="previousClass"
              placeholder="e.g. 4–6 years"
            />
          </Field>
          <Field label="Photo" htmlFor="photo" hint="optional, helps teachers at check-in">
            <Input id="photo" name="photo" type="file" accept="image/*" className="pt-2.5" />
          </Field>
        </CardBody>
      </Card>

      {/* Step 2 */}
      <Card className={step === 1 ? '' : 'hidden'}>
        <CardHeader
          title="Guardian & emergency contacts"
          description="Who we call first, and who else may be contacted."
          icon={<Phone className="size-[1.1rem]" />}
        />
        <CardBody className="space-y-4 pt-2">
          <div className="rounded-lg bg-canvas/70 p-4">
            <p className="text-[0.625rem] font-bold tracking-[0.12em] text-faint uppercase">
              Registering guardian
            </p>
            <p className="mt-1.5 text-[0.875rem] font-bold text-ink">{guardian.fullName}</p>
            <p className="text-[0.75rem] text-muted">
              {guardian.email} · {guardian.phone ?? 'no phone on file'}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Emergency contact" htmlFor="emergencyName" required>
              <Input id="emergencyName" name="emergencyName" placeholder="Full name" required />
            </Field>
            <Field label="Relationship" htmlFor="emergencyRelationship">
              <Input
                id="emergencyRelationship"
                name="emergencyRelationship"
                placeholder="Father, aunt…"
              />
            </Field>
            <Field label="Phone number" htmlFor="emergencyPhone" required>
              <Input id="emergencyPhone" name="emergencyPhone" type="tel" placeholder="+251 9…" required />
            </Field>
          </div>

          <div className="rounded-lg bg-brand-50 p-4">
            <p className="flex items-center gap-2 text-[0.8125rem] font-bold text-brand-800">
              <UserCheck className="size-4" />
              Authorised pick-up person
            </p>
            <p className="mt-1 text-[0.75rem] text-brand-800/80">
              Only people listed here may collect your child from an activity.
            </p>
            <div className="mt-3 grid gap-4 sm:grid-cols-3">
              <Field label="Full name" htmlFor="pickupName">
                <Input id="pickupName" name="pickupName" placeholder="Full name" />
              </Field>
              <Field label="Relationship" htmlFor="pickupRelationship">
                <Input id="pickupRelationship" name="pickupRelationship" placeholder="Uncle" />
              </Field>
              <Field label="Phone number" htmlFor="pickupPhone">
                <Input id="pickupPhone" name="pickupPhone" type="tel" placeholder="+251 9…" />
              </Field>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Step 3 */}
      <Card className={step === 2 ? '' : 'hidden'}>
        <CardHeader
          title="Safety & consent"
          description="This information is shared only with the teachers responsible for your child."
          icon={<ShieldCheck className="size-[1.1rem]" />}
        />
        <CardBody className="space-y-4 pt-2">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Allergies" htmlFor="allergies" hint="optional">
              <Input id="allergies" name="allergies" placeholder="Peanuts, dust…" />
            </Field>
            <Field label="Medical notes" htmlFor="medicalNotes" hint="optional">
              <Input id="medicalNotes" name="medicalNotes" placeholder="Carries an inhaler" />
            </Field>
          </div>
          <Field label="Anything else we should know?" htmlFor="notes">
            <Textarea
              id="notes"
              name="notes"
              rows={3}
              placeholder="Learning needs, sensitivities, family circumstances…"
            />
          </Field>

          <div className="space-y-1 rounded-lg bg-canvas/70 p-2">
            <Checkbox
              name="photoConsent"
              label="I consent to photos and videos of my child being used by the ministry"
              description="You can change this at any time in your settings."
            />
            <Checkbox
              name="medicalConsent"
              required
              label="I authorise the ministry to seek emergency medical care if needed"
            />
            <Checkbox
              name="policyConsent"
              required
              label="I have read and agree to the child safeguarding policy"
            />
          </div>

          {state.error ? (
            <p className="flex items-start gap-2 rounded-sm bg-berry-100 px-4 py-3 text-[0.8125rem] font-medium text-berry-700">
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              {state.error}
            </p>
          ) : null}
        </CardBody>
      </Card>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() => setStep((value) => Math.max(0, value - 1))}
          disabled={step === 0}
        >
          Back
        </Button>
        {step < steps.length - 1 ? (
          <Button type="button" onClick={() => setStep((value) => value + 1)}>
            Continue
          </Button>
        ) : (
          <Button type="submit" disabled={pending} className="gap-2">
            <CheckCircle2 className="size-4" />
            {pending ? 'Submitting…' : 'Submit registration'}
          </Button>
        )}
      </div>
    </form>
  );
}
