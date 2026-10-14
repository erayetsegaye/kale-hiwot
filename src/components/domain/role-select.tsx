'use client';

import { useState, useTransition } from 'react';
import { AlertTriangle, Check, ShieldAlert, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/field';
import { changeUserRole } from '@/lib/actions/ministry';
import { useT } from '@/lib/i18n/client';
import { roleText } from '@/lib/i18n/domain';
import type { Role } from '@/lib/types';

const roles: Role[] = ['parent', 'teacher', 'admin'];

/**
 * Admin role switcher: User → Role, with an explicit confirmation step.
 * Every confirmed change is written to the audit log by the server action.
 */
export function RoleSelect({
  userId,
  userName,
  role,
}: {
  userId: string;
  userName: string;
  role: Role;
}) {
  const [current, setCurrent] = useState<Role>(role);
  const [pendingRole, setPendingRole] = useState<Role | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const t = useT();

  function confirm() {
    if (!pendingRole) return;
    startTransition(async () => {
      const response = await changeUserRole(userId, userName, pendingRole);
      if (response.error) {
        setResult(response.error);
      } else {
        setCurrent(pendingRole);
        setResult(response.message ?? null);
      }
      setPendingRole(null);
    });
  }

  return (
    <div className="min-w-[11rem]">
      <Select
        value={current}
        aria-label={`Role for ${userName}`}
        onChange={(event) => {
          const next = event.target.value as Role;
          if (next !== current) setPendingRole(next);
        }}
        className="h-9 text-[0.8125rem]"
      >
        {roles.map((option) => (
          <option key={option} value={option}>
            {roleText(t, option)}
          </option>
        ))}
      </Select>

      {pendingRole ? (
        <div className="mt-2 rounded-sm bg-sun-100 p-3">
          <p className="flex items-start gap-2 text-[0.75rem] leading-relaxed font-semibold text-sun-700">
            <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
            {t('ui.roleChangeQuestion')
              .replace('{name}', userName)
              .replace('{from}', roleText(t, current))
              .replace('{to}', roleText(t, pendingRole))}
          </p>
          <p className="mt-1 flex items-start gap-2 text-[0.6875rem] text-sun-700/80">
            <ShieldAlert className="mt-0.5 size-3 shrink-0" />
            {t('ui.roleChangeNote')}
          </p>
          <div className="mt-2.5 flex gap-2">
            <Button size="sm" onClick={confirm} disabled={isPending} className="gap-1.5">
              <Check className="size-3.5" />
              {isPending ? t('ui.saving') : t('ui.confirm')}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setPendingRole(null)}
              className="gap-1.5"
            >
              <X className="size-3.5" />
              {t('common.cancel')}
            </Button>
          </div>
        </div>
      ) : null}

      {result ? (
        <p className="mt-2 text-[0.6875rem] leading-relaxed font-medium text-brand-700">
          {result}
        </p>
      ) : null}
    </div>
  );
}
