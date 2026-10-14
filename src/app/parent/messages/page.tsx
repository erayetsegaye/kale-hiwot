import { MessageCenter } from '@/components/domain/message-center';
import { PageHeader } from '@/components/ui/page-header';
import { listThreads } from '@/lib/data/queries';
import { getT } from '@/lib/i18n/server';

export const metadata = { title: 'Messages' };

export default async function ParentMessagesPage() {
  const t = await getT();
  const threads = await listThreads();

  return (
    <div className="space-y-6 py-2">
      <PageHeader
        eyebrow={t('pages.parent.messages.eyebrow')}
        title={t('pages.parent.messages.title')}
        description={t('pages.parent.messages.description')}
      />
      <MessageCenter threads={threads} perspective="parent" />
    </div>
  );
}
