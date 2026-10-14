import {
  BarChart3,
  Bell,
  BookOpen,
  CalendarDays,
  CalendarRange,
  ClipboardCheck,
  FileText,
  GraduationCap,
  Heart,
  LayoutDashboard,
  MessageSquare,
  Megaphone,
  Settings,
  ShieldCheck,
  Sparkles,
  UserPlus,
  Users,
  UsersRound,
  type LucideIcon,
} from 'lucide-react';
import type { Role } from '@/lib/types';
import type { TranslationKey } from '@/lib/i18n/translate';

export interface NavItem {
  /** Dictionary key — resolved per locale at render time. */
  label: TranslationKey;
  href: string;
  icon: LucideIcon;
  /** Shown as a pill on the right of the nav row. */
  badgeKey?: 'pendingRegistrations' | 'unreadNotifications' | 'unreadMessages';
}

export interface NavGroup {
  label: TranslationKey;
  items: NavItem[];
}

export const navigation: Record<Role, NavGroup[]> = {
  admin: [
    {
      label: 'nav.groups.overview',
      items: [
        { label: 'nav.items.dashboard', href: '/admin', icon: LayoutDashboard },
        { label: 'nav.items.calendar', href: '/admin/calendar', icon: CalendarDays },
      ],
    },
    {
      label: 'nav.groups.people',
      items: [
        { label: 'nav.items.users', href: '/admin/users', icon: Users },
        { label: 'nav.items.children', href: '/admin/children', icon: Heart },
        { label: 'nav.items.parents', href: '/admin/parents', icon: UsersRound },
        { label: 'nav.items.teachers', href: '/admin/teachers', icon: GraduationCap },
        {
          label: 'nav.items.registrations',
          href: '/admin/registrations',
          icon: UserPlus,
          badgeKey: 'pendingRegistrations',
        },
      ],
    },
    {
      label: 'nav.groups.ministry',
      items: [
        { label: 'nav.items.classes', href: '/admin/classes', icon: BookOpen },
        { label: 'nav.items.activities', href: '/admin/activities', icon: CalendarRange },
        { label: 'nav.items.events', href: '/admin/events', icon: Sparkles },
        { label: 'nav.items.lessons', href: '/admin/lessons', icon: FileText },
        { label: 'nav.items.attendance', href: '/admin/attendance', icon: ClipboardCheck },
      ],
    },
    {
      label: 'nav.groups.communication',
      items: [
        { label: 'nav.items.announcements', href: '/admin/announcements', icon: Megaphone },
        {
          label: 'nav.items.notifications',
          href: '/admin/notifications',
          icon: Bell,
          badgeKey: 'unreadNotifications',
        },
      ],
    },
    {
      label: 'nav.groups.system',
      items: [
        { label: 'nav.items.reports', href: '/admin/reports', icon: BarChart3 },
        { label: 'nav.items.settings', href: '/admin/settings', icon: Settings },
        { label: 'nav.items.auditLogs', href: '/admin/audit-logs', icon: ShieldCheck },
      ],
    },
  ],
  teacher: [
    {
      label: 'nav.groups.teaching',
      items: [
        { label: 'nav.items.dashboard', href: '/teacher', icon: LayoutDashboard },
        { label: 'nav.items.myClasses', href: '/teacher/classes', icon: BookOpen },
        { label: 'nav.items.students', href: '/teacher/students', icon: Heart },
        { label: 'nav.items.schedule', href: '/teacher/schedule', icon: CalendarRange },
        { label: 'nav.items.attendance', href: '/teacher/attendance', icon: ClipboardCheck },
      ],
    },
    {
      label: 'nav.groups.learning',
      items: [
        { label: 'nav.items.lessons', href: '/teacher/lessons', icon: FileText },
        { label: 'nav.items.progress', href: '/teacher/progress', icon: BarChart3 },
      ],
    },
    {
      label: 'nav.groups.communication',
      items: [
        {
          label: 'nav.items.messages',
          href: '/teacher/messages',
          icon: MessageSquare,
          badgeKey: 'unreadMessages',
        },
        { label: 'nav.items.announcements', href: '/teacher/announcements', icon: Megaphone },
        { label: 'nav.items.events', href: '/teacher/events', icon: Sparkles },
      ],
    },
  ],
  parent: [
    {
      label: 'nav.groups.family',
      items: [
        { label: 'nav.items.dashboard', href: '/parent', icon: LayoutDashboard },
        { label: 'nav.items.myChildren', href: '/parent/children', icon: Heart },
        { label: 'nav.items.registerChild', href: '/parent/register-child', icon: UserPlus },
        { label: 'nav.items.progress', href: '/parent/progress', icon: BarChart3 },
      ],
    },
    {
      label: 'nav.groups.ministryLife',
      items: [
        { label: 'nav.items.schedule', href: '/parent/schedule', icon: CalendarRange },
        { label: 'nav.items.attendance', href: '/parent/attendance', icon: ClipboardCheck },
        { label: 'nav.items.lessons', href: '/parent/lessons', icon: BookOpen },
        { label: 'nav.items.events', href: '/parent/events', icon: Sparkles },
      ],
    },
    {
      label: 'nav.groups.communication',
      items: [
        {
          label: 'nav.items.messages',
          href: '/parent/messages',
          icon: MessageSquare,
          badgeKey: 'unreadMessages',
        },
        {
          label: 'nav.items.notifications',
          href: '/parent/notifications',
          icon: Bell,
          badgeKey: 'unreadNotifications',
        },
        { label: 'nav.items.settings', href: '/parent/settings', icon: Settings },
      ],
    },
  ],
};

/** Condensed bottom bar for phones — the 5 most used destinations per role. */
export const mobileNav: Record<Role, NavItem[]> = {
  admin: [
    { label: 'nav.items.home', href: '/admin', icon: LayoutDashboard },
    { label: 'nav.items.children', href: '/admin/children', icon: Heart },
    { label: 'nav.items.schedule', href: '/admin/activities', icon: CalendarRange },
    { label: 'nav.items.approvals', href: '/admin/registrations', icon: UserPlus },
    { label: 'nav.items.more', href: '/admin/settings', icon: Settings },
  ],
  teacher: [
    { label: 'nav.items.home', href: '/teacher', icon: LayoutDashboard },
    { label: 'nav.items.classes', href: '/teacher/classes', icon: BookOpen },
    { label: 'nav.items.attendance', href: '/teacher/attendance', icon: ClipboardCheck },
    { label: 'nav.items.lessons', href: '/teacher/lessons', icon: FileText },
    { label: 'nav.items.messages', href: '/teacher/messages', icon: MessageSquare },
  ],
  parent: [
    { label: 'nav.items.home', href: '/parent', icon: LayoutDashboard },
    { label: 'nav.items.children', href: '/parent/children', icon: Heart },
    { label: 'nav.items.schedule', href: '/parent/schedule', icon: CalendarRange },
    { label: 'nav.items.lessons', href: '/parent/lessons', icon: BookOpen },
    { label: 'nav.items.alerts', href: '/parent/notifications', icon: Bell },
  ],
};
