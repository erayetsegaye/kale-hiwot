import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  CalendarCheck,
  Camera,
  HeartPulse,
  Phone,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { AttendanceBadge, Badge, StatusBadge } from '@/components/ui/badge';
import { Card, CardBody, CardHeader } from '@/components/ui/card';
import {
  DetailRow,
  EmptyState,
  ProgressBar,
  Table,
  TableWrap,
  Td,
  Th,
  Tr,
} from '@/components/ui/data-display';
import { PageHeader } from '@/components/ui/page-header';
import {
  getAuthorizedPickups,
  getChild,
  getEmergencyContacts,
  getProgressSummary,
  listAttendance,
  listProgressEntries,
} from '@/lib/data/queries';
import { childGroup } from '@/lib/class-label';
import { genderText } from '@/lib/i18n/domain';
import { getT } from '@/lib/i18n/server';
import { getFormat } from '@/lib/i18n/format';
import { ageFromBirthDate } from '@/lib/utils';

export default async function ChildProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const t = await getT();
  const f = await getFormat();
  const { id } = await params;
  const child = await getChild(id);
  if (!child) notFound();

  const [contacts, pickups, attendance, progress, entries] = await Promise.all([
    getEmergencyContacts(child.id),
    getAuthorizedPickups(child.id),
    listAttendance({ childId: child.id }),
    getProgressSummary(child.id),
    // Staff see internal notes as well as parent-visible ones.
    listProgressEntries(child.id, 'staff'),
  ]);

  return (
    <div className="space-y-6 py-2">
      <Link
        href="/admin/children"
        className="inline-flex items-center gap-1.5 text-[0.8125rem] font-semibold text-muted hover:text-brand-700"
      >
        <ArrowLeft className="size-4" />
        All children
      </Link>

      <PageHeader
        eyebrow={childGroup(t, child)}
        title={child.fullName}
        description={`${ageFromBirthDate(child.birthDate)} · ${f.date(child.joinedAt)}`}
        actions={
          <>
            <StatusBadge status={child.status} />
            {child.checkedIn ? (
              <Badge tone="brand" icon={<CalendarCheck className="size-3" />}>
                Checked in
              </Badge>
            ) : null}
          </>
        }
      />

      <div className="grid gap-5 lg:grid-cols-[1fr_1.4fr]">
        <div className="space-y-5">
          <Card>
            <CardBody className="flex items-center gap-4">
              <Avatar name={child.fullName} src={child.photoUrl} size="xl" />
              <div className="min-w-0">
                <p className="text-base font-bold text-ink">{child.fullName}</p>
                <p className="text-[0.8125rem] text-muted">
                  {genderText(t, child.gender)} · {f.date(child.birthDate)}
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  <Badge tone={child.photoConsent ? 'brand' : 'berry'} icon={<Camera className="size-3" />}>
                    {child.photoConsent ? 'Photo consent given' : 'No photo consent'}
                  </Badge>
                </div>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Safety & health" icon={<HeartPulse className="size-[1.1rem]" />} />
            <CardBody className="pt-2">
              <dl>
                <DetailRow label="Allergies">{child.allergies ?? 'None recorded'}</DetailRow>
                <DetailRow label="Medical notes">
                  {child.medicalNotes ?? 'None recorded'}
                </DetailRow>
                <DetailRow label="Guardians">{child.guardianNames.join(', ')}</DetailRow>
              </dl>
            </CardBody>
          </Card>

          <Card>
            <CardHeader
              title="Emergency contacts"
              icon={<Phone className="size-[1.1rem]" />}
            />
            <CardBody className="space-y-2.5 pt-2">
              {contacts.length ? (
                contacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="flex items-center gap-3 rounded-lg bg-canvas/70 p-3"
                  >
                    <Avatar name={contact.name} size="sm" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[0.8125rem] font-semibold text-ink">
                        {contact.name}
                      </p>
                      <p className="text-[0.6875rem] text-muted">
                        {contact.relationship} · {contact.phone}
                      </p>
                    </div>
                    {contact.isPrimary ? <Badge tone="brand">Primary</Badge> : null}
                  </div>
                ))
              ) : (
                <EmptyState title="No emergency contact" description="Ask the guardian to add one." />
              )}
            </CardBody>
          </Card>

          <Card>
            <CardHeader
              title="Authorised pick-up"
              description="Only these people may collect this child."
              icon={<UserCheck className="size-[1.1rem]" />}
            />
            <CardBody className="space-y-2.5 pt-2">
              {pickups.map((pickup) => (
                <div
                  key={pickup.id}
                  className="flex items-center gap-3 rounded-lg bg-canvas/70 p-3"
                >
                  <Avatar name={pickup.name} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[0.8125rem] font-semibold text-ink">
                      {pickup.name}
                    </p>
                    <p className="text-[0.6875rem] text-muted">
                      {pickup.relationship} · {pickup.phone}
                    </p>
                  </div>
                  <Badge tone={pickup.verified ? 'brand' : 'sun'} icon={<ShieldCheck className="size-3" />}>
                    {pickup.verified ? 'Verified' : 'Unverified'}
                  </Badge>
                </div>
              ))}
            </CardBody>
          </Card>
        </div>

        <div className="space-y-5">
          <Card>
            <CardHeader title="Progress" description="Across the current term." />
            <CardBody className="space-y-4 pt-2">
              <ProgressBar label="Attendance" value={progress.attendanceRate} />
              <ProgressBar label="Participation" value={progress.participation} tone="sky" />
              <ProgressBar label="Quiz average" value={progress.quizAverage} />
              <div className="flex flex-wrap gap-1.5 pt-1">
                <Badge tone="brand">{progress.memoryVerses} memory verses</Badge>
                {progress.achievements.map((achievement) => (
                  <Badge key={achievement.id} tone="plum">
                    {achievement.title}
                  </Badge>
                ))}
              </div>

              {/* Everything staff recorded, including internal notes */}
              <ul className="space-y-2 border-t border-line/60 pt-4">
                {entries.slice(0, 8).map((entry) => (
                  <li key={entry.id} className="flex items-start gap-2.5">
                    <span
                      className={
                        entry.visibility === 'internal'
                          ? 'mt-1.5 size-1.5 shrink-0 rounded-full bg-sun-500'
                          : 'mt-1.5 size-1.5 shrink-0 rounded-full bg-brand-400'
                      }
                    />
                    <span className="min-w-0">
                      <span className="block text-[0.8125rem] font-semibold text-ink">
                        {entry.title}
                        {entry.score !== null ? (
                          <span className="ml-2 text-brand-700">{entry.score}%</span>
                        ) : null}
                        {entry.visibility === 'internal' ? (
                          <Badge tone="sun" className="ml-2">
                            Internal
                          </Badge>
                        ) : null}
                      </span>
                      {entry.detail ? (
                        <span className="block text-[0.75rem] leading-relaxed text-muted">
                          {entry.detail}
                        </span>
                      ) : null}
                      <span className="block text-[0.625rem] text-faint">
                        {entry.recordedByName}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Attendance history" />
            <CardBody className="px-0 pt-2 pb-0 sm:px-0">
              {attendance.length ? (
                <TableWrap className="shadow-none">
                  <Table className="min-w-[520px]">
                    <thead>
                      <tr>
                        <Th>Date</Th>
                        <Th>Activity</Th>
                        <Th>Status</Th>
                        <Th>Checked out by</Th>
                      </tr>
                    </thead>
                    <tbody>
                      {attendance.map((record) => (
                        <Tr key={record.id}>
                          <Td className="text-[0.8125rem] text-muted">
                            {f.date(record.date)}
                          </Td>
                          <Td className="text-[0.8125rem] font-medium text-ink">
                            {record.activityTitle}
                          </Td>
                          <Td>
                            <AttendanceBadge status={record.status} />
                          </Td>
                          <Td className="text-[0.8125rem] text-muted">
                            {record.checkedOutBy ?? '—'}
                          </Td>
                        </Tr>
                      ))}
                    </tbody>
                  </Table>
                </TableWrap>
              ) : (
                <EmptyState title="No attendance recorded yet" />
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}
