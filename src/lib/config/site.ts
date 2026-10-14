/**
 * Static fallbacks only.
 *
 * The live church name, contact details and address come from the database
 * (`church settings`, editable by an admin) — read them with `getSettings()`.
 * These values are used before the database is available, e.g. in build-time
 * metadata defaults.
 */
export const siteConfig = {
  name: 'Furi Kale Hiwot',
  shortName: "Children's Ministry",
  churchName: 'Furi Kale Hiwot Church',
  tagline: 'Every child known, nurtured and safe.',
  description:
    "Furi Kale Hiwot Children's Ministry — one system for families, teachers and ministry leaders to manage children, classes, activities, attendance, lessons and safety.",
  supportEmail: 'ministry@furikalehiwot.church',
  phone: '+251 11 000 0000',
  address: 'Furi, Addis Ababa, Ethiopia',
} as const;

/** Sign-in hints shown while the app runs on the local database. */
export const demoAccounts = [
  { role: 'admin', email: 'admin@furikalehiwot.church', label: 'Ministry Admin' },
  { role: 'teacher', email: 'marta.alemu@furikalehiwot.church', label: 'Teacher' },
  { role: 'parent', email: 'selam.tadesse@example.com', label: 'Parent' },
] as const;
