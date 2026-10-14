import { MessageCenter } from '@/components/domain/message-center';
import { PageHeader } from '@/components/ui/page-header';
import { listThreads } from '@/lib/data/queries';
import { getT } from '@/lib/i18n/server';

export const metadata = { title: 'Messages' };

export default async function TeacherMessagesPage() {
  const t = await getT();
  const threads = await listThreads();

  return (
    <div className="space-y-6 py-2">
      <PageHeader
        eyebrow={t('pages.teacher.messages.eyebrow')}
        title={t('pages.teacher.messages.title')}
        description={t('pages.teacher.messages.description')}
      />
      <MessageCenter threads={threads} perspective="teacher" />
    </div>
  );
}
