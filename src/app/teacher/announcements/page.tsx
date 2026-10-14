import { BellRing } from 'lucide-react';
import { ClassAlertButtons } from './class-alert-buttons';
import { AnnouncementCard } from '@/components/domain/announcement-card';
import { NotificationList } from '@/components/domain/notification-list';
import { Button } from '@/components/ui/button';
import { Card, CardBody, CardHeader } from '@/components/ui/card';
import { Field, Input, Select, Textarea } from '@/components/ui/field';
import { PageHeader, SectionHeading } from '@/components/ui/page-header';
import {
  filterAnnouncementsByBands,
  listAnnouncements,
  listNotifications,
} from '@/lib/data/queries';
import { getTeacherContext } from '@/lib/data/teacher-context';
import { listChildren } from '@/lib/data/queries';
import { classLabelIn } from '@/lib/class-label';
import { ageBandLabel } from '@/lib/labels';
import { Badge } from '@/components/ui/badge';
import { getT } from '@/lib/i18n/server';

export const metadata = { title: 'Announcements' };

export default async function TeacherAnnouncementsPage() {
  const t = await getT();
  const {
    teacher,
    approvedBands,
    allClasses: myClasses,
    classes: activeClasses,
  } = await getTeacherContext();
  const [allAnnouncements, notifications] = await Promise.all([
    listAnnouncements(),
    listNotifications(),
  ]);

  // Announcements cover every age group this teacher is approved for, so
  // nothing is missed while they are focused on one group.
  const announcements = filterAnnouncementsByBands(
    allAnnouncements,
    teacher?.ageBands.length ? teacher.ageBands : approvedBands,
  );

  // Classes in the age group being taught right now — the ones a start/end
  // alert would go out for.
  const alertClasses = await Promise.all(
    activeClasses.map(async (klass) => ({
      id: klass.id,
      // Groups are named by age; the language separates two streams.
      label: classLabelIn(t, activeClasses, klass),
      group: ageBandLabel[klass.ageBand],
      childCount: (await listChildren({ classId: klass.id })).length,
    })),
  );

  return (
    <div className="space-y-6 py-2">
      <PageHeader
        eyebrow={t('pages.teacher.announcements.eyebrow')}
        title={t('pages.teacher.announcements.title')}
        description={t('pages.teacher.announcements.description')}
      />

      <div className="grid gap-5 xl:grid-cols-[1.2fr_1fr]">
        <div className="space-y-4">
          <SectionHeading
            title="From the ministry"
            description="Includes announcements aimed at the age groups you teach."
            action={
              <div className="flex flex-wrap gap-1.5">
                {(teacher?.ageBands.length ? teacher.ageBands : approvedBands).map((band) => (
                  <Badge key={band} tone="brand">
                    {ageBandLabel[band]}
                  </Badge>
                ))}
              </div>
            }
          />
          {announcements.map((announcement) => (
            <AnnouncementCard key={announcement.id} announcement={announcement} />
          ))}
        </div>

        <div className="space-y-5">
          {/* Start / end alerts — straight to the parents' notification bar */}
          <Card>
            <CardHeader
              title="Class start & end alerts"
              description="Tell parents the moment the class begins or finishes."
              icon={<BellRing className="size-[1.1rem]" />}
            />
            <CardBody className="pt-2">
              <ClassAlertButtons classes={alertClasses} />
            </CardBody>
          </Card>

          <Card>
            <CardHeader
              title="Notify my group"
              description="Only families in the age group you select will receive this."
            />
            <CardBody className="space-y-4 pt-2">
              <Field label="Age group" htmlFor="classId">
                <Select id="classId" name="classId">
                  {myClasses.map((klass) => (
                    <option key={klass.id} value={klass.id}>
                      {classLabelIn(t, myClasses, klass)}
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Title" htmlFor="title">
                <Input id="title" name="title" placeholder="Bring your Bible on Saturday" />
              </Field>
              <Field label="Message" htmlFor="body">
                <Textarea id="body" name="body" rows={3} />
              </Field>
              <Button>Send to group</Button>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="My notifications" />
            <CardBody className="pt-0">
              <NotificationList notifications={notifications} limit={5} />
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
