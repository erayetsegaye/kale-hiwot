import { Building2, Database, Languages, Palette, ShieldCheck } from 'lucide-react';
import { LogoMark } from '@/components/brand/logo';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardBody, CardFooter, CardHeader } from '@/components/ui/card';
import { Field, Input, Select, Switch } from '@/components/ui/field';
import { PageHeader } from '@/components/ui/page-header';
import { LanguageSwitcher } from '@/components/ui/language-switcher';
import { siteConfig } from '@/lib/config/site';
import { getT } from '@/lib/i18n/server';
import { isSupabaseConfigured } from '@/lib/supabase/env';

export const metadata = { title: 'Settings' };

export default async function AdminSettingsPage() {
  const t = await getT();

  return (
    <div className="space-y-6 py-2">
      <PageHeader
        eyebrow={t('pages.admin.settings.eyebrow')}
        title={t('pages.admin.settings.title')}
        description={t('pages.admin.settings.description')}
      />

      {/* Interface language */}
      <Card>
        <CardHeader
          title={t('language.label')}
          description="Choose the language of the interface. Each person's choice is remembered on their own device."
          icon={<Languages className="size-[1.1rem]" />}
          action={<LanguageSwitcher />}
        />
        <CardBody className="pt-2">
          <div className="flex flex-wrap gap-3">
            <div className="rounded-lg bg-canvas/70 px-4 py-3">
              <p className="text-[0.8125rem] font-bold text-ink">English</p>
              <p className="text-[0.6875rem] text-muted">Default interface language</p>
            </div>
            <div className="rounded-lg bg-canvas/70 px-4 py-3">
              <p className="text-[0.8125rem] font-bold text-ink">አማርኛ</p>
              <p className="text-[0.6875rem] text-muted">Amharic interface</p>
            </div>
          </div>
        </CardBody>
      </Card>

      <div className="grid gap-5 xl:grid-cols-2">
        <Card>
          <CardHeader
            title="Church profile"
            description="Shown on announcements, consent forms and reports."
            icon={<Building2 className="size-[1.1rem]" />}
          />
          <CardBody className="space-y-4 pt-2">
            <Field label="Church name" htmlFor="churchName">
              <Input id="churchName" defaultValue={siteConfig.churchName} />
            </Field>
            <Field label="Ministry name" htmlFor="ministryName">
              <Input id="ministryName" defaultValue={siteConfig.shortName} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Contact email" htmlFor="email">
                <Input id="email" type="email" defaultValue={siteConfig.supportEmail} />
              </Field>
              <Field label="Phone" htmlFor="phone">
                <Input id="phone" defaultValue={siteConfig.phone} />
              </Field>
            </div>
            <Field label="Address" htmlFor="address">
              <Input id="address" defaultValue={siteConfig.address} />
            </Field>
            <Field label="Default language for new members" htmlFor="defaultLocale">
              <Select id="defaultLocale" defaultValue="en">
                <option value="en">English</option>
                <option value="am">አማርኛ (Amharic)</option>
              </Select>
            </Field>
            <Field label="Week starts on" htmlFor="weekStart">
              <Select id="weekStart" defaultValue="sunday">
                <option value="sunday">Sunday</option>
                <option value="monday">Monday</option>
                <option value="saturday">Saturday</option>
              </Select>
            </Field>
          </CardBody>
          <CardFooter>
            <Button size="sm">Save changes</Button>
          </CardFooter>
        </Card>

        <div className="space-y-5">
          <Card>
            <CardHeader
              title="Safeguarding rules"
              description="These controls apply across the whole ministry."
              icon={<ShieldCheck className="size-[1.1rem]" />}
            />
            <CardBody className="divide-y divide-line/60 pt-0">
              <Switch
                label="Require admin approval for every child registration"
                defaultChecked
              />
              <Switch
                label="Require an authorised pick-up person at check-out"
                defaultChecked
              />
              <Switch
                label="Block photos of children without photo consent"
                defaultChecked
              />
              <Switch
                label="Require safeguarding clearance before a teacher is assigned"
                defaultChecked
              />
              <Switch label="Allow parents to message teachers directly" defaultChecked />
              <Switch label="Hide medical notes from non-teaching volunteers" defaultChecked />
            </CardBody>
            <CardFooter>
              <Button size="sm">Save policy</Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader
              title="Branding"
              description="The church emblem is themed from a single colour token, so it can be re-coloured without replacing the original file."
              icon={<Palette className="size-[1.1rem]" />}
            />
            <CardBody className="pt-2">
              <div className="flex flex-wrap items-center gap-5">
                <div className="flex flex-col items-center gap-2">
                  <LogoMark variant="original" size={60} />
                  <span className="text-[0.6875rem] text-muted">Original</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <LogoMark variant="themed" size={60} />
                  <span className="text-[0.6875rem] text-muted">Themed</span>
                </div>
                <div className="flex flex-col items-center gap-2 rounded-lg bg-brand-800 p-3">
                  <LogoMark variant="contrast" size={48} />
                  <span className="text-[0.6875rem] text-brand-100">On dark</span>
                </div>
              </div>
              <p className="mt-4 text-[0.75rem] leading-relaxed text-muted">
                Change <code className="rounded bg-canvas px-1.5 py-0.5">--logo-color</code> in{' '}
                <code className="rounded bg-canvas px-1.5 py-0.5">globals.css</code> to
                re-theme the emblem everywhere. The original artwork is kept untouched.
              </p>
            </CardBody>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader
          title="Backend"
          description="Supabase PostgreSQL with Row Level Security."
          icon={<Database className="size-[1.1rem]" />}
          action={
            <Badge tone={isSupabaseConfigured ? 'brand' : 'sun'}>
              {isSupabaseConfigured ? 'Connected' : 'Not connected — preview data'}
            </Badge>
          }
        />
        <CardBody className="pt-2">
          <p className="text-[0.8125rem] leading-relaxed text-muted">
            Add <code className="rounded bg-canvas px-1.5 py-0.5">NEXT_PUBLIC_SUPABASE_URL</code>{' '}
            and{' '}
            <code className="rounded bg-canvas px-1.5 py-0.5">
              NEXT_PUBLIC_SUPABASE_ANON_KEY
            </code>{' '}
            to <code className="rounded bg-canvas px-1.5 py-0.5">.env.local</code>, then run the
            migrations in <code className="rounded bg-canvas px-1.5 py-0.5">supabase/migrations</code>.
            Every screen already reads through the Supabase data layer — no code changes
            are needed when the project is connected.
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
