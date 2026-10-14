import { Paperclip, Send, ShieldCheck } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { Badge, RoleBadge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardBody, CardHeader } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/data-display';
import { Textarea } from '@/components/ui/field';
import { getT } from '@/lib/i18n/server';
import { getFormat } from '@/lib/i18n/format';
import type { MessageThread } from '@/lib/types';
import { cn } from '@/lib/utils';

/**
 * Parent ↔ teacher conversation view. Threads are scoped to a child, so both
 * sides always know which family the conversation is about.
 */
export async function MessageCenter({
  threads,
  perspective,
}: {
  threads: MessageThread[];
  perspective: 'teacher' | 'parent' | 'admin';
}) {
  const t = await getT();
  const f = await getFormat();
  const active = threads[0];

  return (
    <div className="grid gap-5 lg:grid-cols-[22rem_1fr]">
      <Card className="overflow-hidden">
        <CardHeader
          title={t('ui.conversations')}
          description={`${threads.reduce((total, thread) => total + thread.unread, 0)} ${t('ui.unreadCount')}`}
        />
        <CardBody className="px-0 pt-2 pb-0 sm:px-0">
          {threads.length ? (
            <ul className="divide-y divide-line/60">
              {threads.map((thread) => (
                <li key={thread.id}>
                  <button
                    type="button"
                    className={cn(
                      'flex w-full gap-3 px-5 py-4 text-left transition-colors hover:bg-brand-50/60',
                      thread.id === active?.id && 'bg-brand-50',
                    )}
                  >
                    <Avatar name={thread.withName} size="sm" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-[0.8125rem] font-bold text-ink">
                          {thread.withName}
                        </p>
                        <span className="shrink-0 text-[0.625rem] text-faint">
                          {f.ago(thread.lastMessageAt)}
                        </span>
                      </div>
                      <p className="truncate text-[0.75rem] font-medium text-brand-700">
                        {thread.subject}
                      </p>
                      <p className="truncate text-[0.75rem] text-muted">
                        {thread.lastMessage}
                      </p>
                    </div>
                    {thread.unread ? (
                      <span className="mt-1 flex size-5 shrink-0 items-center justify-center rounded-full bg-brand-700 text-[0.625rem] font-bold text-white">
                        {thread.unread}
                      </span>
                    ) : null}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState title={t('ui.allCaughtUp')} />
          )}
        </CardBody>
      </Card>

      <Card className="flex flex-col">
        {active ? (
          <>
            <CardHeader
              title={active.subject}
              description={
                active.childName
                  ? `${t('ui.about')} ${active.childName}`
                  : t('ui.ministryOffice')
              }
              action={
                <div className="flex items-center gap-2">
                  <RoleBadge role={active.withRole} />
                  <Avatar name={active.withName} size="sm" />
                </div>
              }
            />
            <CardBody className="flex-1 space-y-4 pt-2">
              <div className="flex gap-3">
                <Avatar name={active.withName} size="sm" />
                <div className="max-w-[85%] rounded-lg rounded-tl-none bg-canvas p-4">
                  <p className="text-[0.8125rem] leading-relaxed text-ink">
                    {active.lastMessage}
                  </p>
                  <p className="mt-1.5 text-[0.625rem] text-faint">
                    {f.ago(active.lastMessageAt)}
                  </p>
                </div>
              </div>

              <div className="flex flex-row-reverse gap-3">
                <div className="max-w-[85%] rounded-lg rounded-tr-none bg-brand-700 p-4 text-white">
                  <p className="text-[0.8125rem] leading-relaxed">
                    {perspective === 'parent'
                      ? t('ui.thankYouParent')
                      : t('ui.thankYouTeacher')}
                  </p>
                  <p className="mt-1.5 text-[0.625rem] text-brand-100/80">
                    {t('ui.justNow')}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 rounded-lg bg-brand-50 px-4 py-3">
                <ShieldCheck className="size-4 shrink-0 text-brand-700" />
                <p className="text-[0.6875rem] leading-relaxed text-brand-800">
                  {t('ui.messageRetention')}
                </p>
              </div>
            </CardBody>

            <div className="border-t border-line/60 p-4">
              <Textarea rows={3} placeholder={t('ui.writeMessage')} />
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <Button variant="ghost" size="sm" className="gap-1.5">
                  <Paperclip className="size-3.5" />
                  {t('ui.attach')}
                </Button>
                <div className="flex items-center gap-2">
                  <Badge tone="neutral">{t('ui.visibleToAdmins')}</Badge>
                  <Button size="sm" className="gap-1.5">
                    <Send className="size-3.5" />
                    {t('ui.send')}
                  </Button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <EmptyState
            title={t('ui.selectConversation')}
            description={t('ui.selectConversationHint')}
          />
        )}
      </Card>
    </div>
  );
}
