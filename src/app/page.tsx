import Link from 'next/link';
import {
  ArrowRight,
  BellRing,
  CalendarRange,
  ClipboardCheck,
  Heart,
  MessageSquare,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';
import { Logo, LogoMark } from '@/components/brand/logo';
import { Scene } from '@/components/marketing/scene';
import { Badge } from '@/components/ui/badge';
import { ButtonLink } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/ui/language-switcher';
import { siteConfig } from '@/lib/config/site';
import { getT } from '@/lib/i18n/server';

export default async function LandingPage() {
  const t = await getT();

  const navLinks = [
    { label: t('landing.nav.ministry'), href: '#ministry' },
    { label: t('landing.nav.classes'), href: '#features' },
    { label: t('landing.nav.families'), href: '#roles' },
    { label: t('landing.nav.safety'), href: '#safety' },
  ];

  const features = [
    {
      scene: 'classroom' as const,
      title: t('landing.features.classesTitle'),
      body: t('landing.features.classesBody'),
      cta: t('landing.features.classesCta'),
      icon: CalendarRange,
    },
    {
      scene: 'family' as const,
      title: t('landing.features.familiesTitle'),
      body: t('landing.features.familiesBody'),
      cta: t('landing.features.familiesCta'),
      icon: Heart,
    },
    {
      scene: 'camp' as const,
      title: t('landing.features.eventsTitle'),
      body: t('landing.features.eventsBody'),
      cta: t('landing.features.eventsCta'),
      icon: Sparkles,
    },
  ];

  const roles = [
    {
      role: t('landing.roles.parents'),
      href: '/login?role=parent',
      icon: Heart,
      points: ['Register children in minutes', 'Attendance & progress at a glance', 'Message your child’s teacher'],
    },
    {
      role: t('landing.roles.teachers'),
      href: '/login?role=teacher',
      icon: ClipboardCheck,
      points: ['Only your assigned classes', 'One-tap attendance', 'Lessons, homework & quizzes'],
    },
    {
      role: t('landing.roles.admins'),
      href: '/login?role=admin',
      icon: Users,
      points: ['Approve registrations', 'Schedule every activity', 'Reports, roles & audit logs'],
    },
  ];

  const stats = [
    { value: '122', label: t('landing.safety.statChildren') },
    { value: '12', label: t('landing.safety.statTeachers') },
    { value: '4–15', label: t('landing.safety.statAges') },
    { value: '100%', label: t('landing.safety.statCheckin') },
  ];

  return (
    <div className="min-h-dvh bg-canvas">
      {/* ------------------------------------------------------------ Nav */}
      <div className="px-3 pt-3 sm:px-5 sm:pt-5">
        <header className="mx-auto flex max-w-[1180px] items-center gap-4 rounded-full bg-surface/95 px-4 py-2.5 shadow-card backdrop-blur sm:px-5">
          <Link href="/" aria-label={t('brand.church')}>
            <Logo size={36} subtitle={null} />
          </Link>

          <nav className="mx-auto hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-full px-4 py-2 text-[0.8125rem] font-semibold text-ink/70 transition-colors hover:bg-brand-50 hover:text-brand-800"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2 md:ml-0">
            <span className="hidden size-10 items-center justify-center rounded-full text-muted transition-colors hover:bg-brand-50 hover:text-brand-800 lg:flex">
              <Search className="size-[1.1rem]" />
            </span>
            <LanguageSwitcher />
            <ButtonLink href="/login" size="sm" className="gap-2">
              <ShieldCheck className="size-4" />
              {t('landing.nav.signIn')}
            </ButtonLink>
          </div>
        </header>
      </div>

      {/* ----------------------------------------------------------- Hero */}
      <section className="px-3 pt-3 sm:px-5">
        <div className="relative mx-auto max-w-[1180px]">
          <Scene variant="sanctuary" className="min-h-[520px] rounded-2xl sm:min-h-[560px]">
            <div
              className="absolute inset-0 rounded-2xl"
              style={{ background: 'var(--hero-overlay)' }}
            />
            <div className="relative flex min-h-[520px] flex-col justify-center gap-6 px-6 py-14 sm:min-h-[560px] sm:px-12 lg:px-16">
              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/15 py-1.5 pr-4 pl-1.5 text-xs font-semibold text-white ring-1 ring-white/25 backdrop-blur">
                <span className="flex size-7 items-center justify-center rounded-full bg-white">
                  <LogoMark size={18} />
                </span>
                {t('brand.church')}
              </span>

              <h1 className="max-w-[20ch] font-display text-[2.6rem] leading-[1.05] font-extrabold text-white sm:text-6xl">
                {t('landing.hero.title')}
              </h1>

              <p className="max-w-[52ch] text-[0.9375rem] leading-relaxed text-white/85 sm:text-base">
                {t('landing.hero.body')}
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <ButtonLink href="/register" size="lg" variant="contrast" className="gap-2">
                  {t('landing.hero.primary')}
                  <ArrowRight className="size-4" />
                </ButtonLink>
                <ButtonLink
                  href="/login"
                  size="lg"
                  variant="ghost"
                  className="gap-2 text-white hover:bg-white/15 hover:text-white"
                >
                  {t('landing.hero.secondary')}
                </ButtonLink>
              </div>
            </div>
          </Scene>

          {/* Overlapping quick-find bar (reference's floating search strip) */}
          <div className="relative z-10 mx-auto -mt-10 w-[94%] max-w-[940px] rounded-2xl bg-brand-200/70 p-2.5 shadow-float backdrop-blur sm:-mt-12">
            <div className="flex flex-col gap-2 rounded-[1.6rem] sm:flex-row sm:items-center">
              <div className="flex flex-1 flex-col gap-2 rounded-xl bg-surface p-2 sm:flex-row sm:items-center sm:rounded-full">
                <label className="flex-1 px-4 py-2">
                  <span className="block text-[0.625rem] font-bold tracking-[0.12em] text-faint uppercase">
                    {t('landing.search.what')}
                  </span>
                  <input
                    className="w-full bg-transparent text-sm font-medium text-ink placeholder:text-faint focus:outline-none"
                    placeholder={t('landing.search.whatPlaceholder')}
                  />
                </label>
                <span className="hidden h-9 w-px bg-line sm:block" />
                <label className="flex-1 px-4 py-2">
                  <span className="block text-[0.625rem] font-bold tracking-[0.12em] text-faint uppercase">
                    {t('landing.search.age')}
                  </span>
                  <input
                    className="w-full bg-transparent text-sm font-medium text-ink placeholder:text-faint focus:outline-none"
                    placeholder="4–6, 7–9, 10–12, 13–15"
                  />
                </label>
              </div>
              <ButtonLink href="/login" size="lg" className="justify-center gap-2 sm:px-8">
                <Search className="size-4" />
                {t('landing.search.find')}
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------- Welcome */}
      <section id="ministry" className="px-4 pt-20 pb-16 sm:px-6 lg:pt-24">
        <div className="mx-auto grid max-w-[1120px] items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="relative">
            <Scene variant="family" className="aspect-[4/3] rounded-xl shadow-lift" />
            <div className="absolute -top-5 -left-4 flex items-center gap-2 rounded-full bg-surface py-2 pr-5 pl-2 shadow-lift">
              <span className="flex size-10 items-center justify-center rounded-full bg-brand-50">
                <LogoMark size={24} />
              </span>
              <span className="text-[0.8125rem] font-bold text-ink">
                {t('landing.welcome.since')}
                <span className="block text-[0.6875rem] font-medium text-muted">
                  {t('landing.welcome.sinceNote')}
                </span>
              </span>
            </div>
            <div className="absolute -right-3 -bottom-5 rounded-lg bg-surface p-4 shadow-lift">
              <p className="font-display text-2xl font-extrabold text-brand-700">98%</p>
              <p className="text-[0.6875rem] font-medium text-muted">
                {t('landing.welcome.informed')}
              </p>
            </div>
          </div>

          <div>
            <Badge tone="brand">{t('landing.welcome.eyebrow')}</Badge>
            <h2 className="mt-4 font-display text-3xl font-extrabold text-ink sm:text-4xl">
              {t('landing.welcome.title')}
            </h2>
            <p className="mt-4 text-[0.9375rem] leading-relaxed text-muted">
              {t('landing.welcome.body')}
            </p>
            <ul className="mt-6 space-y-3">
              {[
                t('landing.welcome.point1'),
                t('landing.welcome.point2'),
                t('landing.welcome.point3'),
                t('landing.welcome.point4'),
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-ink/85">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-brand-100 text-brand-700">
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <ButtonLink href="/register" className="gap-2">
                <Heart className="size-4" />
                {t('landing.welcome.cta')}
              </ButtonLink>
              <Link
                href="/login"
                className="text-sm font-semibold text-brand-700 underline-offset-4 hover:underline"
              >
                {t('landing.welcome.haveAccount')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- Features */}
      <section id="features" className="surface-band px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-[1120px]">
          <div className="mx-auto max-w-2xl text-center">
            <Badge tone="brand">{t('landing.features.eyebrow')}</Badge>
            <h2 className="mt-4 font-display text-3xl font-extrabold text-ink sm:text-4xl">
              {t('landing.features.title')}
            </h2>
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">
              {t('landing.features.body')}
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {features.map((feature) => (
              <article
                key={feature.title}
                className="card-hover overflow-hidden rounded-xl bg-surface shadow-card"
              >
                <Scene variant={feature.scene} className="h-44" />
                <div className="p-6">
                  <span className="mb-3 flex size-10 items-center justify-center rounded-full bg-brand-50 text-brand-700">
                    <feature.icon className="size-5" />
                  </span>
                  <h3 className="text-lg font-bold text-ink">{feature.title}</h3>
                  <p className="mt-2 text-[0.8125rem] leading-relaxed text-muted">
                    {feature.body}
                  </p>
                  <ButtonLink href="/login" size="sm" className="mt-5 gap-1.5">
                    {feature.cta}
                    <ArrowRight className="size-3.5" />
                  </ButtonLink>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-10 flex items-center justify-center gap-2">
            {[0, 1, 2, 3].map((dot) => (
              <span
                key={dot}
                className={
                  dot === 0
                    ? 'h-2 w-6 rounded-full bg-brand-700'
                    : 'size-2 rounded-full bg-brand-300'
                }
              />
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- Roles */}
      <section id="roles" className="px-4 py-20 sm:px-6">
        <div className="mx-auto max-w-[1120px]">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <Badge tone="brand">{t('landing.roles.eyebrow')}</Badge>
              <h2 className="mt-4 font-display text-3xl font-extrabold text-ink sm:text-4xl">
                {t('landing.roles.title')}
              </h2>
            </div>
            <p className="max-w-sm text-[0.8125rem] leading-relaxed text-muted">
              {t('landing.roles.body')}
            </p>
          </div>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {roles.map((role) => (
              <Link
                key={role.role}
                href={role.href}
                className="card-hover group rounded-xl bg-surface p-7 shadow-card"
              >
                <span className="flex size-12 items-center justify-center rounded-full bg-brand-700 text-white">
                  <role.icon className="size-5" />
                </span>
                <h3 className="mt-5 text-xl font-bold text-ink">{role.role}</h3>
                <ul className="mt-4 space-y-2.5">
                  {role.points.map((point) => (
                    <li key={point} className="flex gap-2.5 text-[0.8125rem] text-muted">
                      <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand-400" />
                      {point}
                    </li>
                  ))}
                </ul>
                <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700">
                  {t('landing.roles.open')} {role.role} {t('landing.roles.view')}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- Safety */}
      <section id="safety" className="px-4 pb-20 sm:px-6">
        <div className="mx-auto max-w-[1120px] overflow-hidden rounded-2xl bg-brand-800 text-white shadow-lift">
          <div className="grid gap-10 p-8 sm:p-12 lg:grid-cols-[1.1fr_1fr] lg:items-center">
            <div>
              <Badge tone="contrast">{t('landing.safety.eyebrow')}</Badge>
              <h2 className="mt-4 font-display text-3xl font-extrabold sm:text-4xl">
                {t('landing.safety.title')}
              </h2>
              <p className="mt-4 max-w-[52ch] text-sm leading-relaxed text-brand-100/90">
                {t('landing.safety.body')}
              </p>
              <div className="mt-7 grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-4">
                {stats.map((stat) => (
                  <div key={stat.label}>
                    <p className="font-display text-2xl font-extrabold">{stat.value}</p>
                    <p className="mt-1 text-[0.6875rem] leading-snug text-brand-100/80">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {[
                { icon: ShieldCheck, label: t('landing.safety.rls') },
                { icon: BellRing, label: t('landing.safety.reminders') },
                { icon: MessageSquare, label: t('landing.safety.messaging') },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center gap-4 rounded-lg bg-white/10 p-4 ring-1 ring-white/15 backdrop-blur"
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white/15">
                    <item.icon className="size-5" />
                  </span>
                  <p className="text-sm font-semibold">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- Footer */}
      <footer className="surface-band px-4 py-12 sm:px-6">
        <div className="mx-auto flex max-w-[1120px] flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-sm">
            <Logo size={44} />
            <p className="mt-4 text-[0.8125rem] leading-relaxed text-muted">
              {t('brand.tagline')} {siteConfig.address}.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 text-[0.8125rem] sm:grid-cols-3">
            <div>
              <p className="mb-3 font-bold text-ink">{t('landing.footer.ministry')}</p>
              <ul className="space-y-2 text-muted">
                <li><a href="#features" className="hover:text-brand-700">{t('landing.nav.classes')}</a></li>
                <li><a href="#roles" className="hover:text-brand-700">{t('landing.nav.families')}</a></li>
                <li><a href="#safety" className="hover:text-brand-700">{t('landing.safety.eyebrow')}</a></li>
              </ul>
            </div>
            <div>
              <p className="mb-3 font-bold text-ink">{t('landing.footer.account')}</p>
              <ul className="space-y-2 text-muted">
                <li><Link href="/login" className="hover:text-brand-700">{t('landing.footer.signIn')}</Link></li>
                <li><Link href="/register" className="hover:text-brand-700">{t('landing.footer.createAccount')}</Link></li>
                <li><Link href="/forgot-password" className="hover:text-brand-700">{t('landing.footer.resetPassword')}</Link></li>
              </ul>
            </div>
            <div>
              <p className="mb-3 font-bold text-ink">{t('landing.footer.contact')}</p>
              <ul className="space-y-2 text-muted">
                <li>{siteConfig.supportEmail}</li>
                <li>{siteConfig.phone}</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mx-auto mt-10 max-w-[1120px] border-t border-brand-200/60 pt-6 text-[0.75rem] text-muted">
          © {new Date().getFullYear()} {t('brand.church')}. {t('landing.footer.rights')}
        </div>
      </footer>
    </div>
  );
}
