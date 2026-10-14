import { BellRing } from 'lucide-react';
import { NotificationList } from '@/components/domain/notification-list';
import { Button } from '@/components/ui/button';
import { Card, CardBody, CardFooter, CardHeader } from '@/components/ui/card';
import { Checkbox, Switch } from '@/components/ui/field';
import { StatCard } from '@/components/ui/data-display';
import { PageHeader } from '@/components/ui/page-header';
import { reminderLabel, reminderOrder } from '@/lib/labels';
import { listNotifications } from '@/lib/data/queries';
import { getT } from '@/lib/i18n/server';

export const metadata = { title: 'Notifications' };

export default async function AdminNotificationsPage() {
  const t = await getT();
  const notifications = await listNotifications();

  return (
    <div className="space-y-6 py-2">
      <PageHeader
        eyebrow={t('pages.admin.notifications.eyebrow')}
        title={t('pages.admin.notifications.title')}
        description={t('pages.admin.notifications.description')}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Sent this week" value={248} icon={<BellRing className="size-5" />} />
        <StatCard tone="brand" label="Delivery rate" value="99.2%" />
        <StatCard label="Unread" value={notifications.filter((n) => !n.read).length} />
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.3fr_1fr]">
        <Card>
          <CardHeader title="Recent notifications" description="What members received." />
          <CardBody className="pt-0">
            <NotificationList notifications={notifications} />
          </CardBody>
        </Card>

        <div className="space-y-5">
          <Card>
            <CardHeader
              title="Default reminder timings"
              description="Applied to new activities unless overridden."
            />
            <CardBody className="grid gap-1 pt-2">
              {reminderOrder.map((reminder) => (
                <Checkbox
                  key={reminder}
                  name="defaultReminders"
                  value={reminder}
                  label={reminderLabel[reminder]}
                  defaultChecked={['one_day', 'thirty_min', 'at_start', 'at_end'].includes(
                    reminder,
                  )}
                />
              ))}
            </CardBody>
            <CardFooter>
              <Button size="sm">Save defaults</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader title="Channels" description="How notifications are delivered." />
            <CardBody className="divide-y divide-line/60 pt-0">
              <Switch label="In-app notifications" defaultChecked />
              <Switch label="Email to parents" defaultChecked />
              <Switch label="SMS for emergencies only" defaultChecked />
              <Switch label="Weekly digest to teachers" />
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
