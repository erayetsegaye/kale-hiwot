import { AnnouncementComposer } from './announcement-composer';
import { AnnouncementCard } from '@/components/domain/announcement-card';
import { PageHeader, SectionHeading } from '@/components/ui/page-header';
import { StatCard } from '@/components/ui/data-display';
import { listAnnouncements, listClasses } from '@/lib/data/queries';
import { classLabelIn } from '@/lib/class-label';
import { getT } from '@/lib/i18n/server';
import { percent } from '@/lib/utils';

export const metadata = { title: 'Announcements' };

export default async function AdminAnnouncementsPage() {
  const t = await getT();
  const [announcements, classes] = await Promise.all([
    listAnnouncements(),
    listClasses(),
  ]);
  const reach = announcements.reduce(
    (sum, announcement) => sum + announcement.recipientCount,
    0,
  );
  const reads = announcements.reduce(
    (sum, announcement) => sum + announcement.readCount,
    0,
  );

  return (
    <div className="space-y-6 py-2">
      <PageHeader
        eyebrow={t('pages.admin.announcements.eyebrow')}
        title={t('pages.admin.announcements.title')}
        description={t('pages.admin.announcements.description')}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Announcements sent" value={announcements.length} />
        <StatCard tone="brand" label="Average read rate" value={`${percent(reads, reach)}%`} />
        <StatCard
          label="Emergency alerts"
          value={announcements.filter((a) => a.urgent).length}
        />
      </div>

      <AnnouncementComposer
        classes={classes.map((klass) => ({
          id: klass.id,
          label: classLabelIn(t, classes, klass),
          band: klass.ageBand,
        }))}
      />

      <section>
        <SectionHeading title="Sent" description="Delivery and read tracking." />
        <div className="space-y-3">
          {announcements.map((announcement) => (
            <AnnouncementCard
              key={announcement.id}
              announcement={announcement}
              showReach
            />
          ))}
        </div>
      </section>
    </div>
  );
}
