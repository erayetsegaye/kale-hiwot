'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { useT } from '@/lib/i18n/client';
import {
  attendanceText,
  registrationStatusText,
  roleText,
} from '@/lib/i18n/domain';
import type { AttendanceStatus, RegistrationStatus, Role } from '@/lib/types';

export type BadgeTone =
  | 'brand'
  | 'neutral'
  | 'sun'
  | 'berry'
  | 'sky'
  | 'plum'
  | 'contrast';

const tones: Record<BadgeTone, string> = {
  brand: 'bg-brand-100 text-brand-800',
  neutral: 'bg-canvas text-muted ring-1 ring-line',
  sun: 'bg-sun-100 text-sun-700',
  berry: 'bg-berry-100 text-berry-700',
  sky: 'bg-sky-100 text-sky-700',
  plum: 'bg-plum-100 text-plum-500',
  contrast: 'bg-white/15 text-white ring-1 ring-white/25 backdrop-blur',
};

export function Badge({
  tone = 'brand',
  icon,
  children,
  className,
}: {
  tone?: BadgeTone;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.6875rem] font-semibold tracking-wide whitespace-nowrap',
        tones[tone],
        className,
      )}
    >
      {icon}
      {children}
    </span>
  );
}

export function Dot({ tone = 'brand' }: { tone?: BadgeTone }) {
  const dots: Record<BadgeTone, string> = {
    brand: 'bg-brand-500',
    neutral: 'bg-faint',
    sun: 'bg-sun-500',
    berry: 'bg-berry-500',
    sky: 'bg-sky-500',
    plum: 'bg-plum-500',
    contrast: 'bg-white',
  };
  return <span className={cn('size-1.5 rounded-full', dots[tone])} />;
}

const registrationTone: Record<RegistrationStatus, BadgeTone> = {
  approved: 'brand',
  pending: 'sun',
  needs_info: 'sky',
  rejected: 'berry',
};

export function StatusBadge({ status }: { status: RegistrationStatus }) {
  const t = useT();
  return (
    <Badge
      tone={registrationTone[status]}
      icon={<Dot tone={registrationTone[status]} />}
    >
      {registrationStatusText(t, status)}
    </Badge>
  );
}

const attendanceTone: Record<AttendanceStatus, BadgeTone> = {
  present: 'brand',
  late: 'sun',
  absent: 'berry',
  excused: 'sky',
};

export function AttendanceBadge({ status }: { status: AttendanceStatus }) {
  const t = useT();
  return <Badge tone={attendanceTone[status]}>{attendanceText(t, status)}</Badge>;
}

const roleTone: Record<Role, BadgeTone> = {
  super_admin: 'berry',
  admin: 'plum',
  teacher: 'sky',
  parent: 'brand',
};

export function RoleBadge({ role }: { role: Role }) {
  const t = useT();
  return <Badge tone={roleTone[role]}>{roleText(t, role)}</Badge>;
}
