import { Camera, Phone, ShieldCheck, UserCheck, UserPlus } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { Badge, StatusBadge } from '@/components/ui/badge';
import { ButtonLink } from '@/components/ui/button';
import { Card, CardBody } from '@/components/ui/card';
import { DetailRow, EmptyState, ProgressBar } from '@/components/ui/data-display';
import { PageHeader } from '@/components/ui/page-header';
import { requireRole } from '@/lib/auth';
import {
  getAuthorizedPickups,
  getEmergencyContacts,
  getGuardianForUser,
  listChildren,
} from '@/lib/data/queries';
import { getT } from '@/lib/i18n/server';
import { ageBandLabel, bandForAge } from '@/lib/labels';
import { getFormat } from '@/lib/i18n/format';
import { ageFromBirthDate } from '@/lib/utils';

export const metadata = { title: 'My children' };

export default async function ParentChildrenPage() {
  const t = await getT();
  const f = await getFormat();
  const user = await requireRole('parent');
  const guardian = await getGuardianForUser(user.id);
  const children = await listChildren({ guardianId: guardian?.id });

  const details = await Promise.all(
    children.map(async (child) => ({
      child,
      contacts: await getEmergencyContacts(child.id),
      pickups: await getAuthorizedPickups(child.id),
    })),
  );

  return (
    <div className="space-y-6 py-2">
      <PageHeader
        eyebrow={t('pages.parent.children.eyebrow')}
        title={t('pages.parent.children.title')}
        description={t('pages.parent.children.description')}
        actions={
          <ButtonLink href="/parent/register-child" className="gap-2">
            <UserPlus className="size-4" />
            Register another child
          </ButtonLink>
        }
      />

      {details.length ? (
        <div className="space-y-5">
          {details.map(({ child, contacts, pickups }) => (
            <Card key={child.id}>
              <CardBody className="grid gap-6 lg:grid-cols-[1.1fr_1fr_1fr]">
                <div>
                  <div className="flex items-start gap-4">
                    <Avatar name={child.fullName} src={child.photoUrl} size="xl" />
                    <div className="min-w-0">
                      <h3 className="text-lg font-bold text-ink">{child.fullName}</h3>
                      <p className="text-[0.8125rem] text-muted">
                        {ageFromBirthDate(child.birthDate)} years ·{' '}
                        {bandForAge(ageFromBirthDate(child.birthDate))
                          ? ageBandLabel[bandForAge(ageFromBirthDate(child.birthDate))!]
                          : 'Awaiting group'}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        <StatusBadge status={child.status} />
                        <Badge
                          tone={child.photoConsent ? 'brand' : 'berry'}
                          icon={<Camera className="size-3" />}
                        >
                          {child.photoConsent ? 'Photo consent' : 'No photo consent'}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 space-y-3">
                    <ProgressBar label="Attendance" value={child.attendanceRate} />
                    <p className="text-[0.75rem] text-muted">
                      {child.memoryVersesLearned} {t('ui.memoryVerses')} ·{' '}
                      {f.date(child.joinedAt)}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="mb-2 flex items-center gap-2 text-[0.8125rem] font-bold text-ink">
                    <Phone className="size-4 text-brand-600" />
                    Emergency contacts
                  </p>
                  <div className="space-y-2">
                    {contacts.length ? (
                      contacts.map((contact) => (
                        <div
                          key={contact.id}
                          className="rounded-lg bg-canvas/70 px-3.5 py-2.5"
                        >
                          <p className="text-[0.8125rem] font-semibold text-ink">
                            {contact.name}
                          </p>
                          <p className="text-[0.6875rem] text-muted">
                            {contact.relationship} · {contact.phone}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-[0.75rem] text-faint">None added yet</p>
                    )}
                  </div>

                  <dl className="mt-4">
                    <DetailRow label="Allergies">{child.allergies ?? 'None'}</DetailRow>
                    <DetailRow label="Medical notes">
                      {child.medicalNotes ?? 'None'}
                    </DetailRow>
                  </dl>
                </div>

                <div>
                  <p className="mb-2 flex items-center gap-2 text-[0.8125rem] font-bold text-ink">
                    <UserCheck className="size-4 text-brand-600" />
                    Authorised pick-up
                  </p>
                  <div className="space-y-2">
                    {pickups.map((pickup) => (
                      <div
                        key={pickup.id}
                        className="flex items-center gap-2.5 rounded-lg bg-canvas/70 px-3.5 py-2.5"
                      >
                        <Avatar name={pickup.name} size="xs" />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[0.8125rem] font-semibold text-ink">
                            {pickup.name}
                          </p>
                          <p className="text-[0.6875rem] text-muted">
                            {pickup.relationship}
                          </p>
                        </div>
                        <Badge tone={pickup.verified ? 'brand' : 'sun'}>
                          {pickup.verified ? 'Verified' : 'Pending'}
                        </Badge>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex items-start gap-2 rounded-lg bg-brand-50 p-3">
                    <ShieldCheck className="mt-0.5 size-4 shrink-0 text-brand-700" />
                    <p className="text-[0.6875rem] leading-relaxed text-brand-800">
                      Teachers check this list before releasing your child.
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <EmptyState
            title="No children registered"
            description="Register your first child to get started."
            action={<ButtonLink href="/parent/register-child">Register a child</ButtonLink>}
          />
        </Card>
      )}
    </div>
  );
}
