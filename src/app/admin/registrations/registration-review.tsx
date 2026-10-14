'use client';

import { useState, useTransition } from 'react';
import { Check, HelpCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/field';
import { reviewRegistration } from '@/lib/actions/ministry';
import { useT } from '@/lib/i18n/client';
import type { RegistrationStatus } from '@/lib/types';

export function RegistrationReview({
  registrationId,
  childName,
}: {
  registrationId: string;
  childName: string;
}) {
  const [note, setNote] = useState('');
  const [asking, setAsking] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const t = useT();

  function act(status: RegistrationStatus, message?: string) {
    startTransition(async () => {
      const response = await reviewRegistration(
        registrationId,
        childName,
        status,
        message,
      );
      setResult(response.error ?? response.message ?? null);
      setAsking(false);
    });
  }

  if (result) {
    return <p className="text-[0.75rem] font-medium text-brand-700">{result}</p>;
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        <Button size="sm" onClick={() => act('approved')} disabled={isPending} className="gap-1.5">
          <Check className="size-3.5" />
          {t('ui.approve')}
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setAsking((value) => !value)}
          disabled={isPending}
          className="gap-1.5"
        >
          <HelpCircle className="size-3.5" />
          {t('ui.requestInfo')}
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => act('rejected')}
          disabled={isPending}
          className="gap-1.5 text-berry-500 hover:bg-berry-100 hover:text-berry-700"
        >
          <X className="size-3.5" />
          {t('ui.reject')}
        </Button>
      </div>

      {asking ? (
        <div className="flex flex-wrap items-center gap-2">
          <Input
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder={t('ui.whatIsMissing')}
            className="h-9 max-w-xs text-[0.8125rem]"
          />
          <Button
            size="sm"
            variant="secondary"
            disabled={!note || isPending}
            onClick={() => act('needs_info', note)}
          >
            {t('ui.sendRequest')}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
