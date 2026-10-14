import { Bell, KeyRound, Languages, ShieldCheck, UserCog } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardBody, CardFooter, CardHeader } from '@/components/ui/card';
import { Field, Input, Switch } from '@/components/ui/field';
import { PasswordInput } from '@/components/ui/password-input';
import { PageHeader } from '@/components/ui/page-header';
import { requireRole } from '@/lib/auth';
import { getGuardianForUser } from '@/lib/data/queries';
import { LanguageSwitcher } from '@/components/ui/language-switcher';
import { getT } from '@/lib/i18n/server';

export const metadata = { title: 'Settings' };

export default async function ParentSettingsPage() {
  const t = await getT();
  const user = await requireRole('parent');
  const guardian = await getGuardianForUser(user.id);

  return (
    <div className="space-y-6 py-2">
      <PageHeader
        eyebrow={t('pages.parent.settings.eyebrow')}
        title={t('pages.parent.settings.title')}
        description={t('pages.parent.settings.description')}
      />

      <Card>
        <CardHeader
          title={t('language.label')}
          description="Use the app in English or አማርኛ. Your choice is remembered on this device."
          icon={<Languages className="size-[1.1rem]" />}
          action={<LanguageSwitcher />}
        />
      </Card>

      <div className="grid gap-5 xl:grid-cols-2">
        <Card>
          <CardHeader
            title="Profile"
            description="Used for contact and on your children's records."
            icon={<UserCog className="size-[1.1rem]" />}
          />
          <CardBody className="space-y-4 pt-2">
            <div className="flex items-center gap-4">
              <Avatar name={user.fullName} src={user.avatarUrl} size="xl" />
              <div>
                <Button size="sm" variant="outline">
                  Change photo
                </Button>
                <p className="mt-2 text-[0.6875rem] text-muted">JPG or PNG, max 2 MB.</p>
              </div>
            </div>
            <Field label="Full name" htmlFor="fullName">
              <Input id="fullName" defaultValue={guardian?.fullName ?? user.fullName} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Email" htmlFor="email">
                <Input id="email" type="email" defaultValue={guardian?.email ?? user.email} />
              </Field>
              <Field label="Phone" htmlFor="phone">
                <Input id="phone" defaultValue={guardian?.phone ?? ''} />
              </Field>
            </div>
            <Field label="Home address" htmlFor="address">
              <Input id="address" defaultValue={guardian?.address ?? ''} />
            </Field>
          </CardBody>
          <CardFooter>
            <Button size="sm">Save profile</Button>
          </CardFooter>
        </Card>

        <div className="space-y-5">
          <Card>
            <CardHeader
              title="Notification preferences"
              description="Choose how and when we contact you."
              icon={<Bell className="size-[1.1rem]" />}
            />
            <CardBody className="divide-y divide-line/60 pt-0">
              <Switch label="Reminder 1 day before an activity" defaultChecked />
              <Switch label="Reminder 30 minutes before an activity" defaultChecked />
              <Switch label="When a class starts and ends" defaultChecked />
              <Switch label="Cancellations and schedule changes" defaultChecked />
              <Switch label="Lessons and homework" defaultChecked />
              <Switch label="Ministry announcements" defaultChecked />
              <Switch label="Email digest every Friday" />
            </CardBody>
            <CardFooter>
              <Button size="sm">Save preferences</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader
              title="Security"
              description="Keep your family's information safe."
              icon={<KeyRound className="size-[1.1rem]" />}
            />
            <CardBody className="space-y-4 pt-2">
              <Field label="Current password" htmlFor="currentPassword">
                <PasswordInput id="currentPassword" autoComplete="current-password" />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="New password" htmlFor="newPassword">
                  <PasswordInput id="newPassword" autoComplete="new-password" />
                </Field>
                <Field label="Confirm new password" htmlFor="confirmPassword">
                  <PasswordInput id="confirmPassword" autoComplete="new-password" />
                </Field>
              </div>
              <div className="flex items-start gap-2 rounded-lg bg-brand-50 p-3">
                <ShieldCheck className="mt-0.5 size-4 shrink-0 text-brand-700" />
                <p className="text-[0.6875rem] leading-relaxed text-brand-800">
                  Only you and the ministry staff responsible for your children can see
                  their information.
                </p>
              </div>
            </CardBody>
            <CardFooter>
              <Button size="sm">Update password</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
