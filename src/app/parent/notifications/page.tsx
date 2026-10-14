import { AnnouncementCard } from '@/components/domain/announcement-card';
import { NotificationList } from '@/components/domain/notification-list';
import { Button } from '@/components/ui/button';
import { Card, CardBody, CardHeader } from '@/components/ui/card';
import { PageHeader } from '@/components/ui/page-header';
import {
  bandsForChildren,
  filterAnnouncementsByBands,
  getGuardianForUser,
  listAnnouncements,
  listChildren,
  listNotifications,
} from '@/lib/data/queries';
import { requireRole } from '@/lib/auth';
import { getT } from '@/lib/i18n/server';

export const metadata = { title: 'Notifications' };

export default async function ParentNotificationsPage() {
  const t = await getT();
  const user = await requireRole('parent');
  const guardian = await getGuardianForUser(user.id);
  const [notifications, allAnnouncements, children] = await Promise.all([
    listNotifications(),
    listAnnouncements(),
    listChildren({ guardianId: guardian?.id }),
  ]);

  // Age-group announcements only reach families with a child in that band.
  const announcements = filterAnnouncementsByBands(
    allAnnouncements,
    bandsForChildren(children),
  );

  return (
    <div className="space-y-6 py-2">
      <PageHeader
        eyebrow={t('pages.parent.notifications.eyebrow')}
        title={t('pages.parent.notifications.title')}
        description={t('pages.parent.notifications.description')}
        actions={<Button variant="outline">Mark all as read</Button>}
      />

      <div className="grid gap-5 xl:grid-cols-[1.3fr_1fr]">
        <Card>
          <CardHeader
            title="Your notifications"
            description={`${notifications.filter((n) => !n.read).length} unread`}
          />
          <CardBody className="pt-0">
            <NotificationList notifications={notifications} />
          </CardBody>
        </Card>

        <div className="space-y-4">
          <h2 className="font-display text-lg font-bold text-ink">
            {t('nav.items.announcements')}
          </h2>
          {announcements.map((announcement) => (
            <AnnouncementCard key={announcement.id} announcement={announcement} />
          ))}
        </div>
      </div>
    </div>
  );
}
