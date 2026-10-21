/* =============================================================================
   Interface translations.

   `en` is the source of truth; `am` (አማርኛ) is a deep-partial of it, so a missing
   Amharic string silently falls back to English instead of showing a raw key.
   Add new copy to `en` first, then translate.
   ========================================================================== */

import type { Locale } from './config';

export const en = {
  brand: {
    name: 'Furi Kale Hiwot',
    ministry: "Children's Ministry",
    church: 'Furi Kale Hiwot Church',
    tagline: 'Every child known, nurtured and safe.',
    description:
      "One system for families, teachers and ministry leaders to manage children, classes, activities, attendance, lessons and safety.",
  },

  language: {
    label: 'Language',
    choose: 'Choose language',
    english: 'English',
    amharic: 'አማርኛ (Amharic)',
  },

  /** Domain vocabulary — every enum the UI renders. */
  domain: {
    activityType: {
      class: 'Class',
      bible_study: 'Bible study',
      worship: "Children's worship",
      choir: 'Choir practice',
      teacher_meeting: 'Teacher meeting',
      parent_meeting: 'Parent meeting',
      camp: 'Camp',
      field_trip: 'Field trip',
      competition: 'Competition',
      program: 'Special programme',
      custom: 'Custom activity',
    },
    audience: {
      everyone: 'Everyone',
      parents: 'All parents',
      teachers: 'All teachers',
      children: 'All children',
      class: 'Specific class',
      group: 'Specific group',
      age_band: 'Specific age group',
    },
    reminder: {
      one_day: '1 day before',
      one_hour: '1 hour before',
      thirty_min: '30 minutes before',
      fifteen_min: '15 minutes before',
      ten_min: '10 minutes before',
      at_start: 'At start',
      at_end: 'At end',
    },
    recurrence: {
      none: 'Does not repeat',
      weekly: 'Every week',
      biweekly: 'Every two weeks',
      monthly: 'Every month',
    },
    notificationKind: {
      reminder: 'Reminder',
      started: 'Started',
      ended: 'Ended',
      cancelled: 'Cancelled',
      rescheduled: 'Rescheduled',
      announcement: 'Announcement',
      message: 'Message',
      registration: 'Registration',
      emergency: 'Emergency',
    },
    attendance: {
      present: 'Present',
      absent: 'Absent',
      late: 'Late',
      excused: 'Excused',
      notMarked: 'Not marked',
    },
    registrationStatus: {
      pending: 'Pending review',
      needs_info: 'Needs info',
      approved: 'Approved',
      rejected: 'Rejected',
    },
    activityStatus: {
      scheduled: 'Scheduled',
      cancelled: 'Cancelled',
      rescheduled: 'Rescheduled',
      completed: 'Completed',
    },
    publishStatus: {
      draft: 'Draft',
      published: 'Published',
    },
    severity: {
      info: 'info',
      warning: 'warning',
      critical: 'critical',
    },
    ageBand: {
      '4-6': '4–6 years',
      '7-9': '7–9 years',
      '10-12': '10–12 years',
      '13-15': '13–15 years',
      all: 'All age groups',
      none: 'No age group',
      awaiting: 'Awaiting group',
    },
    weekday: {
      sunday: 'Sunday',
      monday: 'Monday',
      tuesday: 'Tuesday',
      wednesday: 'Wednesday',
      thursday: 'Thursday',
      friday: 'Friday',
      saturday: 'Saturday',
    },
    weekdayShort: {
      sunday: 'Sun',
      monday: 'Mon',
      tuesday: 'Tue',
      wednesday: 'Wed',
      thursday: 'Thu',
      friday: 'Fri',
      saturday: 'Sat',
    },
    material: {
      pdf: 'PDF',
      video: 'Video',
      image: 'Image',
      link: 'Link',
    },
    gender: {
      male: 'Boy',
      female: 'Girl',
    },
  },

  common: {
    save: 'Save',
    saveChanges: 'Save changes',
    cancel: 'Cancel',
    confirm: 'Confirm',
    edit: 'Edit',
    viewAll: 'View all',
    all: 'All',
    manage: 'Manage',
    export: 'Export',
    search: 'Search',
    searchPlaceholder: 'Search children, classes, activities…',
    loading: 'Loading…',
    unread: 'unread',
    today: 'Today',
    upcoming: 'Upcoming',
    none: 'None',
    optional: 'optional',
    required: 'required',
    back: 'Back',
    continue: 'Continue',
    submit: 'Submit',
  },

  roles: {
    super_admin: 'Super Admin',
    admin: 'Ministry Admin',
    teacher: 'Teacher',
    parent: 'Parent / Guardian',
  },

  nav: {
    groups: {
      overview: 'Overview',
      people: 'People',
      ministry: 'Ministry',
      communication: 'Communication',
      system: 'System',
      teaching: 'Teaching',
      learning: 'Learning',
      family: 'Family',
      ministryLife: 'Ministry life',
    },
    items: {
      dashboard: 'Dashboard',
      calendar: 'Calendar',
      users: 'Users & roles',
      children: 'Children',
      parents: 'Parents',
      teachers: 'Teachers',
      registrations: 'Registrations',
      classes: 'Classes',
      activities: 'Activities & schedule',
      events: 'Events',
      lessons: 'Lessons',
      attendance: 'Attendance',
      announcements: 'Announcements',
      notifications: 'Notifications',
      reports: 'Reports',
      settings: 'Settings',
      auditLogs: 'Audit logs',
      myClasses: 'My classes',
      students: 'Students',
      schedule: 'Schedule',
      progress: 'Progress',
      messages: 'Messages',
      myChildren: 'My children',
      registerChild: 'Register a child',
      home: 'Home',
      approvals: 'Approvals',
      alerts: 'Alerts',
      more: 'More',
    },
  },

  /** Reusable component copy. */
  ui: {
    expected: 'expected',
    reminders: 'reminders',
    next: 'Next',
    allGroups: 'All age groups',
    checkedIn: 'Checked in',
    attendance: 'Attendance',
    memoryVerses: 'memory verses',
    viewProfile: 'View profile',
    children: 'children',
    childrenInGroup: 'children in this age group',
    places: 'places',
    classes: 'classes',
    classOne: 'class',
    noClassOpen: 'No class open yet',
    noTeacherYet: 'No teacher yet',
    registered: 'registered',
    onWaitlist: 'on the waiting list',
    consentRequired: 'Consent required',
    viewDetails: 'View details',
    homework: 'Homework',
    quiz: 'Quiz',
    emergency: 'Emergency',
    read: 'read',
    ofRead: 'of',
    allCaughtUp: "You're all caught up",
    allCaughtUpHint: 'New reminders and announcements will appear here.',
    noActivities: 'No activities',
    conversations: 'Conversations',
    unreadCount: 'unread',
    about: 'About',
    ministryOffice: 'Ministry office',
    visibleToAdmins: 'Visible to admins',
    attach: 'Attach',
    send: 'Send',
    writeMessage: 'Write a message…',
    selectConversation: 'Select a conversation',
    selectConversationHint: 'Choose a thread on the left to read and reply.',
    messageRetention:
      'Conversations about a child are retained for safeguarding and may be reviewed by ministry administrators.',
    thankYouParent: 'Thank you for letting us know — we really appreciate the update.',
    thankYouTeacher: 'Thank you for your support at home, it makes a real difference.',
    justNow: 'Just now',
    markAllPresent: 'Mark all present',
    saveAttendance: 'Save attendance',
    searchChild: 'Search a child…',
    saving: 'Saving…',
    notMarked: 'Not marked',
    allergy: 'Allergy',
    confirm: 'Confirm',
    roleChangeQuestion: 'Change {name} from {from} to {to}?',
    roleChangeNote:
      'This changes what data they can access and is recorded in the audit log.',
    approve: 'Approve',
    decline: 'Decline',
    reject: 'Reject',
    requestInfo: 'Request info',
    whatIsMissing: 'What information is missing?',
    sendRequest: 'Send request',
    legendClasses: 'Classes',
    legendStudy: 'Bible study',
    legendEvents: 'Events',
    more: 'more',
  },

  teaching: {
    pickTitle: 'Which age group are you teaching today?',
    pickSubtitle:
      'Choose the group you are with right now. Your classes, students, attendance and lessons will be focused on it — you can switch at any time.',
    startTeaching: 'Start teaching this group',
    nowTeaching: 'Now teaching',
    change: 'Change group',
    onlyGroup: 'Your only group',
    children: 'children',
    notAssigned: 'Not assigned to you',
    noClassYet: 'No class assigned in this group yet',
    noGroupsTitle: 'No age group assigned yet',
    noGroupsBody:
      'A ministry administrator needs to approve your application and assign you to a class before you can start teaching.',
    pendingTitle: 'Your application is being reviewed',
    pendingBody:
      'Welcome! Your teacher account has been created. A ministry administrator will approve it before you can see any children.',
    pendingStep1: 'Your application has been sent to the ministry office.',
    pendingStep2: 'An administrator approves you and assigns your age group.',
    pendingStep3: 'You sign in, choose the group you are teaching, and start.',
    pendingSafety:
      "Children's information stays hidden until you are approved — this protects every family in the ministry.",
  },

  shell: {
    openNav: 'Open navigation',
    closeNav: 'Close navigation',
    signOut: 'Sign out',
    notifications: 'Notifications',
    noNotifications: 'Nothing new right now',
    markAllRead: 'Mark all as read',
    soundOn: 'Sound on — tap to mute',
    soundOff: 'Sound off — tap to unmute',
    testSound: 'Play a test sound',
    soundWorks: 'Sound is working — you will hear this when a class starts or ends.',
    soundBlocked:
      'Your browser blocked the sound. Click anywhere on the page, then press the speaker again.',
    previewMode: 'Preview · no database connected',
    safeguardingTitle: 'Safeguarding first',
    safeguardingBody:
      "Children's records are protected by role-based access and row level security. Every change is logged.",
  },

  auth: {
    verse: '“Let the little children come to me.”',
    verseRef: 'Matthew 19:14',
    safetyNote:
      "Children's records are protected by role-based access and database-level security. Only the people who need to see a child's information can.",
    backHome: 'Home',
    showPassword: 'Show password',
    hidePassword: 'Hide password',
    login: {
      title: 'Welcome back',
      subtitle: "Sign in to continue to the children's ministry.",
      email: 'Email address',
      password: 'Password',
      remember: 'Keep me signed in',
      forgot: 'Forgot password?',
      submit: 'Sign in',
      submitting: 'Signing in…',
      previewTitle: 'Preview mode — choose a role to explore',
      previewNote:
        'Connect a Supabase project in .env.local to switch to real authentication — no code changes required.',
      noAccount: 'New to the ministry?',
      createAccount: 'Create a parent account',
    },
    register: {
      title: 'Create your parent account',
      subtitle:
        'Parents and guardians register here. You can add your children — and follow their classes, attendance and progress — once you are signed in.',
      teacherTitle: 'Join the teaching team',
      teacherSubtitle:
        'Tell us which age groups you would like to teach. Your account works straight away; an administrator assigns you a group.',
      accountType: 'I am registering as',
      asParent: 'A parent',
      asTeacher: 'A teacher',
      ageGroups: 'Age groups you want to teach',
      ageGroupsHint: 'Choose one or more. The ministry serves children aged 4–15.',
      teachingLanguages: 'Languages you can teach in',
      teachingLanguagesHint: 'Choose at least one.',
      teacherNote:
        'You can sign in right away. An administrator assigns you a group, and you will see those children once they do.',
      submitTeacher: 'Create teacher account',
      fullName: 'Full name',
      email: 'Email address',
      phone: 'Phone number',
      password: 'Password',
      confirmPassword: 'Confirm password',
      consent: "I agree to the ministry's child safeguarding policy",
      consentNote:
        "Your family's information is only visible to you and the ministry staff responsible for your child.",
      submit: 'Create account',
      submitting: 'Creating account…',
      haveAccount: 'Already registered?',
      signIn: 'Sign in',
    },
    forgot: {
      title: 'Reset your password',
      subtitle:
        'Enter the email address linked to your account and we will send you a secure link to choose a new password.',
      submit: 'Send reset link',
      submitting: 'Sending link…',
      back: 'Back to sign in',
    },
  },

  landing: {
    nav: {
      ministry: 'Ministry',
      classes: 'Classes',
      families: 'For families',
      safety: 'Safety',
      signIn: 'Sign in',
    },
    hero: {
      title: 'Every child known, nurtured and safe',
      body: "One system for the whole children's ministry — register children, run classes on any day of the week, take attendance, share lessons and keep every family informed.",
      primary: 'Register your child',
      secondary: 'Teacher / admin sign in',
    },
    search: {
      what: 'What are you looking for',
      whatPlaceholder: 'Class, event or Bible study',
      age: 'Age group',
      agePlaceholder: '4–6, 7–9, 10–12, 13–15',
      find: 'Find',
    },
    welcome: {
      eyebrow: 'Welcome',
      title: 'A ministry that knows every child by name',
      body: "Furi Kale Hiwot Children's Ministry exists to help children grow in faith, character and confidence. This app carries that care into the details: who is in the room, who may collect them, what they are learning, and how they are growing.",
      point1: 'Classes for ages 4–15 in Amharic (አማርኛ) or English',
      point2: 'Secure registration reviewed by the ministry team',
      point3: 'Activities on any day — not just Sunday',
      point4: 'Reminders before, at the start and at the end of every class',
      cta: 'Join the ministry',
      haveAccount: 'I already have an account',
      since: 'Since 1998',
      sinceNote: 'Serving families',
      informed: 'Parents feel informed',
    },
    features: {
      eyebrow: 'What the app does',
      title: "Everything your children's ministry runs on",
      body: 'Built around real ministry life — weekly classes, mid-week studies, seasonal programmes and the families behind every child.',
      classesTitle: 'Classes for ages 4–15',
      classesBody:
        'Four age bands — 4–6, 7–9, 10–12 and 13–15 — taught in Amharic (አማርኛ) or English, on Saturdays, Sundays and mid-week.',
      classesCta: 'Explore classes',
      familiesTitle: 'Families in the loop',
      familiesBody:
        'Parents register their children, follow attendance, lessons and progress, and talk to teachers in one place.',
      familiesCta: 'See the parent view',
      eventsTitle: 'Events & camps',
      eventsBody:
        'Camps, trips, competitions and Christmas programmes with capacity, waitlists and digital consent.',
      eventsCta: 'Browse events',
    },
    roles: {
      eyebrow: 'Three ways in',
      title: 'One system, the right view for everyone',
      body: 'Each person sees only what they need. Access is enforced in the database, not just in the interface.',
      parents: 'Parents',
      teachers: 'Teachers',
      admins: 'Administrators',
      open: 'Open',
      view: 'view',
    },
    safety: {
      eyebrow: 'Safeguarding',
      title: "Children's safety is designed in, not added on",
      body: 'Emergency contacts, authorised pick-up lists, photo consent, secure check-in and check-out, role-based access and a full audit trail of every action taken in the system.',
      statChildren: 'Children served weekly',
      statTeachers: 'Trained teachers',
      statAges: 'Ages served',
      statCheckin: 'Check-in accountability',
      rls: 'Row level security on every table',
      reminders: 'Automatic class start & end notifications',
      messaging: 'Parent ↔ teacher messaging with oversight',
    },
    footer: {
      ministry: 'Ministry',
      account: 'Account',
      contact: 'Contact',
      signIn: 'Sign in',
      createAccount: 'Create account',
      resetPassword: 'Reset password',
      rights: 'All rights reserved.',
    },
  },

  pages: {
    admin: {
      dashboard: {
        eyebrow: "Children's ministry",
        title: 'Ministry overview',
        description: 'Everything happening across classes, families and teachers today.',
        newActivity: 'New activity',
        sendAnnouncement: 'Send announcement',
        totalChildren: 'Total children',
        totalParents: 'Parents & guardians',
        totalTeachers: 'Teachers',
        totalClasses: 'Classes',
        pending: 'Pending registrations',
        todays: "Today's activities",
        upcomingEvents: 'Upcoming events',
        attendanceRate: 'Attendance rate',
        nextActivities: 'Next activities',
        approvals: 'Registration approvals',
        capacity: 'Class capacity',
        ageGroups: 'Children by age group',
        ageGroupsHint: 'All four age groups the ministry serves, from 4 to 15 years.',
        latestAnnouncements: 'Latest announcements',
        recentLog: 'Recent activity log',
      },
      users: {
        eyebrow: 'People',
        title: 'Users & roles',
        description:
          "Every account in the ministry. Change a person's role to grant or remove access — each change is confirmed and logged.",
      },
      children: {
        eyebrow: 'People',
        title: 'Children',
        description:
          'Full register of children in the ministry. Sensitive details are only visible to authorised staff.',
      },
      parents: {
        eyebrow: 'People',
        title: 'Parents & guardians',
        description: 'Family accounts linked to the children in your ministry.',
      },
      teachers: {
        eyebrow: 'People',
        title: 'Teachers',
        description:
          'Teachers can only reach the children in the classes assigned to them.',
      },
      registrations: {
        eyebrow: 'People',
        title: 'Registration approvals',
        description:
          'Children registered by their parents follow the flow: Pending → Admin review → Approved, Needs information or Rejected.',
      },
      classes: {
        eyebrow: 'Ministry',
        title: 'Classes',
        description:
          'Children aged 4–15 are grouped into four age bands, each taught in Amharic, English or both.',
      },
      activities: {
        eyebrow: 'Ministry',
        title: 'Activities & schedule',
        description:
          'The ministry runs all week — Saturday classes, Sunday worship, mid-week Bible study, choir practice and anything else you create.',
      },
      events: {
        eyebrow: 'Ministry',
        title: 'Events',
        description:
          'Camps, trips, competitions, seasonal programmes and meetings — with capacity, waitlists and consent.',
      },
      lessons: {
        eyebrow: 'Ministry',
        title: 'Lessons & curriculum',
        description:
          'Bible passages, memory verses, homework, quizzes and learning materials across every class.',
      },
      attendance: {
        eyebrow: 'Ministry',
        title: 'Attendance',
        description: 'Who was present, late, excused or absent — across every activity.',
      },
      calendar: {
        eyebrow: 'Ministry',
        title: 'Calendar',
        description:
          'Classes, Bible studies, meetings, camps and special activities in one view.',
      },
      announcements: {
        eyebrow: 'Communication',
        title: 'Announcements',
        description:
          'Reach everyone, parents only, teachers only, or a specific class or group.',
      },
      notifications: {
        eyebrow: 'Communication',
        title: 'Notifications',
        description:
          'Automatic reminders before, at the start of and at the end of every activity — plus cancellation and reschedule alerts.',
      },
      reports: {
        eyebrow: 'System',
        title: 'Reports',
        description: 'Ministry health at a glance, with exports for leadership meetings.',
      },
      settings: {
        eyebrow: 'System',
        title: 'Settings',
        description:
          'Church details, safeguarding rules, branding and backend configuration.',
      },
      audit: {
        eyebrow: 'System',
        title: 'Audit logs',
        description:
          'A permanent record of role changes, approvals, check-outs, emergency alerts and other sensitive actions.',
      },
    },
    teacher: {
      dashboard: {
        eyebrow: 'Welcome back',
        title: 'Your teaching day',
        description: 'Only the classes and children assigned to you are shown here.',
        takeAttendance: 'Take attendance',
        myChildren: 'Children in my care',
        myClasses: 'My classes',
        averageAttendance: 'Average attendance',
        unreadMessages: 'Unread messages',
        nextActivities: 'Your next activities',
        myStudents: 'My students',
        recentLessons: 'Recent lessons',
        conversations: 'Parent conversations',
      },
      classes: {
        eyebrow: 'Teaching',
        title: 'My classes',
        description:
          'You can only open the classes the administrator has assigned to you.',
      },
      students: {
        eyebrow: 'Teaching',
        title: 'My students',
        description:
          'Children in your assigned classes, with the safety notes you need at check-in.',
      },
      schedule: {
        eyebrow: 'Teaching',
        title: 'My schedule',
        description: 'Every activity you are responsible for, on any day of the week.',
      },
      attendance: {
        eyebrow: 'Teaching',
        title: 'Take attendance',
        description:
          'Mark each child present, late, excused or absent. Parents see the result immediately.',
      },
      lessons: {
        eyebrow: 'Learning',
        title: 'Lessons',
        description:
          'Plan the Bible passage, memory verse, homework and materials for each class.',
      },
      progress: {
        eyebrow: 'Learning',
        title: 'Child progress',
        description:
          'Attendance, participation, homework, quizzes and memory verses for the children in your classes.',
      },
      messages: {
        eyebrow: 'Communication',
        title: 'Messages',
        description: 'Talk with the parents of the children in your classes.',
      },
      announcements: {
        eyebrow: 'Communication',
        title: 'Announcements & alerts',
        description:
          'Messages from the ministry office, plus notices you send to your own classes.',
      },
      events: {
        eyebrow: 'Communication',
        title: 'Upcoming events',
        description: 'Camps, programmes and meetings you may be asked to support.',
      },
    },
    parent: {
      dashboard: {
        eyebrow: 'Hello',
        title: 'Your family in the ministry',
        description:
          'Everything about your children — classes, attendance, lessons and progress.',
        registerChild: 'Register a child',
        nextActivity: 'Next activity',
        viewSchedule: 'View schedule',
        myChildren: 'My children',
        attendanceTerm: 'Attendance this term',
        lessonsShared: 'Lessons shared',
        upcomingEvents: 'Upcoming events',
        upcomingClasses: 'Upcoming classes & activities',
        recentLessons: 'Recent lessons & homework',
        recentAttendance: 'Recent attendance',
        announcements: 'Announcements',
        dontMiss: "Don't miss",
      },
      children: {
        eyebrow: 'Family',
        title: 'My children',
        description:
          "Profiles, safety details and consent — kept private to your family and your child's teachers.",
      },
      registerChild: {
        eyebrow: 'Family',
        title: 'Register a child',
        description:
          'Children aged 4–15 can join. The ministry team reviews each registration before the child joins their age group. All teaching is in Amharic.',
        ourGroups: 'Our age groups',
        ourGroupsHint: 'Ages 4–15, in four groups.',
      },
      progress: {
        eyebrow: 'Family',
        title: "My children's progress",
        description:
          'How your children are growing — attendance, participation, homework, memory verses and achievements.',
      },
      schedule: {
        eyebrow: 'Ministry life',
        title: 'Our schedule',
        description:
          'Only the classes, studies and events that involve your children.',
      },
      attendance: {
        eyebrow: 'Ministry life',
        title: 'Attendance',
        description:
          'Every class and activity your children attended, were late for, missed or were excused from.',
      },
      lessons: {
        eyebrow: 'Ministry life',
        title: 'Lessons & homework',
        description:
          'What your children are learning, with memory verses you can practise together at home.',
      },
      events: {
        eyebrow: 'Ministry life',
        title: 'Events & camps',
        description:
          'Register your children, sign consent forms and keep track of what is coming up.',
      },
      messages: {
        eyebrow: 'Communication',
        title: 'Messages',
        description: "Talk with your children's teachers and the ministry office.",
      },
      notifications: {
        eyebrow: 'Communication',
        title: 'Notifications',
        description:
          'Class reminders, start and end alerts, schedule changes and ministry announcements.',
      },
      settings: {
        eyebrow: 'Communication',
        title: 'My account',
        description: 'Your profile, password and notification preferences.',
      },
    },
  },
} as const;

export type Dictionary = typeof en;

/**
 * A translation of the dictionary: same shape, every entry optional, and string
 * leaves widened from the literal types `as const` produces.
 */
export type Translation<T> = {
  [K in keyof T]?: T[K] extends string ? string : Translation<T[K]>;
};

/* -------------------------------------------------------------------------- */
/*                                   አማርኛ                                     */
/* -------------------------------------------------------------------------- */

export const am: Translation<Dictionary> = {
  brand: {
    name: 'ፉሪ ቃለ ሕይወት',
    ministry: 'የልጆች አገልግሎት',
    church: 'ፉሪ ቃለ ሕይወት ቤተ ክርስቲያን',
    tagline: 'የሚታወቅ፣ የሚያድግና ደህንነቱ የተጠበቀ እያንዳንዱ ልጅ።',
    description:
      'ለቤተሰቦች፣ ለመምህራንና ለአገልግሎት አመራሮች — ልጆችን፣ ክፍሎችን፣ እንቅስቃሴዎችን፣ ተገኝነትን፣ ትምህርቶችንና ደህንነትን ለማስተዳደር አንድ ስርዓት።',
  },

  language: {
    label: 'ቋንቋ',
    choose: 'ቋንቋ ይምረጡ',
    english: 'English (እንግሊዝኛ)',
    amharic: 'አማርኛ',
  },

  domain: {
    activityType: {
      class: 'ክፍል',
      bible_study: 'የመጽሐፍ ቅዱስ ጥናት',
      worship: 'የልጆች አምልኮ',
      choir: 'የመዘምርት ልምምድ',
      teacher_meeting: 'የመምህራን ስብሰባ',
      parent_meeting: 'የወላጆች ስብሰባ',
      camp: 'ካምፕ',
      field_trip: 'የወጣ ጉዟ',
      competition: 'ውድድር',
      program: 'ልዩ ፕሮግራም',
      custom: 'ሌላ እንቅስቃሴ',
    },
    audience: {
      everyone: 'ለሁሉም',
      parents: 'ለሁሉም ወላጆች',
      teachers: 'ለሁሉም መምህራን',
      children: 'ለሁሉም ልጆች',
      class: 'ለተወሰነ ክፍል',
      group: 'ለተወሰነ ቡድን',
      age_band: 'ለተወሰነ የዕድሜ ክልል',
    },
    reminder: {
      one_day: 'ከአንድ ቀን በፊት',
      one_hour: 'ከአንድ ሰዓት በፊት',
      thirty_min: 'ከ30 ደቂቃ በፊት',
      fifteen_min: 'ከ15 ደቂቃ በፊት',
      ten_min: 'ከ10 ደቂቃ በፊት',
      at_start: 'ሲጀመር',
      at_end: 'ሲጠናቀቅ',
    },
    recurrence: {
      none: 'አይደግምም',
      weekly: 'በየሳምንቱ',
      biweekly: 'በየሁለት ሳምንቱ',
      monthly: 'በየወሩ',
    },
    notificationKind: {
      reminder: 'ማስታወሻ',
      started: 'ተጀምሯል',
      ended: 'ተጠናቅቋል',
      cancelled: 'ተሰርዟል',
      rescheduled: 'ገዜው ተቀየሯል',
      announcement: 'ማስታወቂያ',
      message: 'መልእክት',
      registration: 'ምዝገባ',
      emergency: 'አስቤዳጅ',
    },
    attendance: {
      present: 'ተገኝቷል',
      absent: 'ቀርቷል',
      late: 'ዝግይቷል',
      excused: 'በፍቃድ',
      notMarked: 'አልተመዘገበም',
    },
    registrationStatus: {
      pending: 'በመጠባበቅ ላይ',
      needs_info: 'ተጨማሪ መረጃ ያስፈልጋል',
      approved: 'ፈቅዶታል',
      rejected: 'ተሰርዟል',
    },
    activityStatus: {
      scheduled: 'ተክዷል',
      cancelled: 'ተሰርዟል',
      rescheduled: 'ገዜው ተቀየሯል',
      completed: 'ተጠናቅቋል',
    },
    publishStatus: {
      draft: 'የመጀመሪያ መታሐፍ',
      published: 'ታትሞአል',
    },
    severity: {
      info: 'መረጃ',
      warning: 'ማስጠንቀቂያ',
      critical: 'አስበጤኚ',
    },
    ageBand: {
      '4-6': '4–6 ዓመት',
      '7-9': '7–9 ዓመት',
      '10-12': '10–12 ዓመት',
      '13-15': '13–15 ዓመት',
      all: 'ሁሉም የዕድሜ ክልሎች',
      none: 'የዕድሜ ክልል የለም',
      awaiting: 'ቡድን እየጠበቀ',
    },
    weekday: {
      sunday: 'እሑድ',
      monday: 'ሰኞ',
      tuesday: 'ማክሰኞ',
      wednesday: 'ረቡዕ',
      thursday: 'ሐሙስ',
      friday: 'ዓርብ',
      saturday: 'ቅዳሜ',
    },
    weekdayShort: {
      sunday: 'እሑ',
      monday: 'ሰኞ',
      tuesday: 'ማክ',
      wednesday: 'ረቡ',
      thursday: 'ሐሙ',
      friday: 'ዓር',
      saturday: 'ቅዳ',
    },
    material: {
      pdf: 'PDF',
      video: 'ቪዲዮ',
      image: 'ምስል',
      link: 'አገናኝ',
    },
    gender: {
      male: 'ወንድ',
      female: 'ሴት',
    },
  },

  common: {
    save: 'አስቀምጥ',
    saveChanges: 'ለውጦችን አስቀምጥ',
    cancel: 'ሰርዝ',
    confirm: 'አረጋግጥ',
    edit: 'አስተካክል',
    viewAll: 'ሁሉንም ይመልከቱ',
    all: 'ሁሉም',
    manage: 'አስተዳድር',
    export: 'አውጣ',
    search: 'ፈልግ',
    searchPlaceholder: 'ልጆችን፣ ክፍሎችን፣ እንቅስቃሴዎችን ይፈልጉ…',
    loading: 'በመጫን ላይ…',
    unread: 'ያልተነበቡ',
    today: 'ዛሬ',
    upcoming: 'በቅርቡ የሚመጡ',
    none: 'የለም',
    optional: 'በፈቃደኝነት',
    required: 'ያስፈልጋል',
    back: 'ተመለስ',
    continue: 'ቀጥል',
    submit: 'አስገባ',
  },

  roles: {
    super_admin: 'ዋና አስተዳዳሪ',
    admin: 'የአገልግሎት አስተዳዳሪ',
    teacher: 'መምህር',
    parent: 'ወላጅ / አሳዳጊ',
  },

  nav: {
    groups: {
      overview: 'አጠቃላይ እይታ',
      people: 'ሰዎች',
      ministry: 'አገልግሎት',
      communication: 'ግንኙነት',
      system: 'ሥርዓት',
      teaching: 'ማስተማር',
      learning: 'ትምህርት',
      family: 'ቤተሰብ',
      ministryLife: 'የአገልግሎት ሕይወት',
    },
    items: {
      dashboard: 'ዳሽቦርድ',
      calendar: 'የቀን መቁጠሪያ',
      users: 'ተጠቃሚዎችና ሚናዎች',
      children: 'ልጆች',
      parents: 'ወላጆች',
      teachers: 'መምህራን',
      registrations: 'ምዝገባዎች',
      classes: 'ክፍሎች',
      activities: 'እንቅስቃሴዎችና መርሃ ግብር',
      events: 'ዝግጅቶች',
      lessons: 'ትምህርቶች',
      attendance: 'ተገኝነት',
      announcements: 'ማስታወቂያዎች',
      notifications: 'ማሳወቂያዎች',
      reports: 'ሪፖርቶች',
      settings: 'ቅንብሮች',
      auditLogs: 'የክትትል መዝገብ',
      myClasses: 'የእኔ ክፍሎች',
      students: 'ተማሪዎች',
      schedule: 'መርሃ ግብር',
      progress: 'እድገት',
      messages: 'መልእክቶች',
      myChildren: 'ልጆቼ',
      registerChild: 'ልጅ ይመዝግቡ',
      home: 'መነሻ',
      approvals: 'ማጽደቂያዎች',
      alerts: 'ማሳወቂያ',
      more: 'ተጨማሪ',
    },
  },

  ui: {
    expected: 'የተገመተ',
    reminders: 'ማስታወሻዎች',
    next: 'ቀጣይ',
    allGroups: 'ሁሉም የዕድሜ ክልሎች',
    checkedIn: 'ገብቷል',
    attendance: 'ተገኝነት',
    memoryVerses: 'የቃል ጥቅሶች',
    viewProfile: 'መገለጫ ይመልከቱ',
    children: 'ልጆች',
    childrenInGroup: 'በዚህ የዕድሜ ክልል ያሉ ልጆች',
    places: 'ቦታዎች',
    classes: 'ክፍሎች',
    classOne: 'ክፍል',
    noClassOpen: 'አለመ጖ የተከፈተ ክፍል የለም',
    noTeacherYet: 'አለመ጖ መምህር የለም',
    registered: 'ተመዝግበውር',
    onWaitlist: 'በመጠባበቂያ ዝርዝር ላይ',
    consentRequired: 'ፍቃድ ያስፍልጋል',
    viewDetails: 'ዝርዝር ይመልከቱ',
    homework: 'የቤት ስራ',
    quiz: 'ፈተና',
    emergency: 'አስቤዳጅ',
    read: 'አንብበውታል',
    ofRead: 'ከ',
    allCaughtUp: 'ሁሉንም አይተውታል',
    allCaughtUpHint: 'አዲስ ማስታወሻዎችና ማስታወቂያዎች እዚህ ይታያሉ።',
    noActivities: 'እንቅስቃሴ የለም',
    conversations: 'ውይይቶች',
    unreadCount: 'ያልተነበቡ',
    about: 'ስለ',
    ministryOffice: 'የአገልግሎት ጵሕፈት ቤት',
    visibleToAdmins: 'ለአስተዳዳሪዎች ይታያል',
    attach: 'አያያዝ',
    send: 'ላክ',
    writeMessage: 'መልእክት ይጻፉ…',
    selectConversation: 'ውይይት ይምረጡ',
    selectConversationHint: 'ለማንበብና ለመመለስ በግራ ይምረጡ።',
    messageRetention:
      'ስለ ልጅ የሚደረጉ ውይይቶች ለደህንነት ሲቡ ይቀመጡ፣ በአስተዳዳሪዎችም ሊታየ኉ ይችላሉ።',
    thankYouParent: 'ስለመገለጻችሁልን እናመሰግናለን።',
    thankYouTeacher: 'በቤት ስለሚያደርጉት ድጋፍ እናመሰግናለን፣ ታላቅ ለውጥ ያመጣል።',
    justNow: 'አሁን',
    markAllPresent: 'ሁሉንም ተገኙ አድርግ',
    saveAttendance: 'ተገኝነት አስቀምጥ',
    searchChild: 'ልጅ ይፍለጉ…',
    saving: 'በማስቀመጥ ላይ…',
    notMarked: 'አልተመዘገበም',
    allergy: 'አለርጂ',
    confirm: 'አረጋግጥ',
    roleChangeQuestion: '{name}ን ከ{from} ወደ {to} ይቀየር?',
    roleChangeNote:
      'ይህ ማየት የሚችሉትን መረጃ ይቀይራል፣ በክትትል መዝገብ ውስጥም ይሰፈራል።',
    approve: 'አጽድቅ',
    decline: 'አትቀበል',
    reject: 'እምበል',
    requestInfo: 'ተጨማሪ መረጃ ጠይቅ',
    whatIsMissing: 'ምን መረጃ ጉድሎላል?',
    sendRequest: 'ጠይቆውን ላክ',
    legendClasses: 'ክፍሎች',
    legendStudy: 'የመጽሐፍ ቅዱስ ጥናት',
    legendEvents: 'ዝግጅቶች',
    more: 'ተጨማሪ',
  },

  teaching: {
    pickTitle: 'ዛሬ የትኛውን የዕድሜ ክልል እያስተማሩ ነው?',
    pickSubtitle:
      'አሁን አብሩ ያሉትን ቡድን ይምረጡ። ክፍሎችዎ፣ ተማሪዎችዎ፣ ተገኝነትና ትምህርቶች በእሱ ላይ ይኸተሰባሉ፤ በማንኛውም ሰዓት መቀየር ይችላሉ።',
    startTeaching: 'በዚህ ቡድን መምረት ይጀምሩ',
    nowTeaching: 'አሁን የሚያስተምሩት',
    change: 'ቡድን ቀይር',
    onlyGroup: 'ብውንታ ቡድንዎ',
    children: 'ልጆች',
    notAssigned: 'ለእርስዎ አልተመደበም',
    noClassYet: 'በዚህ ቡድን ውስጥ የተመደበ ክፍል የለም',
    noGroupsTitle: 'የተመደበ የዕድሜ ክልል የለም',
    noGroupsBody:
      'ማስተማር ክትጀምሩ በፊት የአገልግሎት አስተዳዳሪ ማመልከቻዎን አጵድቋ ክፍል መመደብ አለበት።',
    pendingTitle: 'ማመልከቻዎ በግምገማ ላይ ነው',
    pendingBody:
      'እንኳን ደህና መጡ! የመምህርነት መለያዎ ተክፍቷል። ልጆችን ከማየትዎ በፊት የአገልግሎት አስተዳዳሪ ያጽድቀዋል።',
    pendingStep1: 'ማመልከቻዎ ወደ አገልግሎት ጵሕፈት ቤት ተላዪቷል።',
    pendingStep2: 'አስተዳዳሪ ያጽድቅና የዕድሜ ክልልዎን ይመድባል።',
    pendingStep3: 'ገብተው የሚያስተምሩትን ቡድን ይምረጡና ይጀምሩ።',
    pendingSafety:
      'እስከሚጽደቁ ድረስ የልጆች መረጃ አይታይም — ይህ የሁሉንም ቤተሰቦች ደህንነት ይጠብቃል።',
  },

  shell: {
    openNav: 'ማውጫ ክፈት',
    closeNav: 'ማውጫ ዝጋ',
    signOut: 'ውጣ',
    notifications: 'ማሳወቂያዎች',
    noNotifications: 'አዲስ ነገር የለም',
    markAllRead: 'ሁሉንም እንደተነበቡ ምልክት አድርግ',
    soundOn: 'ድምፅ በርቷል — ለማጥፋት ይንኩት',
    soundOff: 'ድምፅ ጠፍቷል — ለመክፈት ይንኩት',
    testSound: 'ድምጹን ይመትሩ',
    soundWorks: 'ድምጹ እያሰራ ነው — ክፍል ሲጀመርና ሲጠናቀቅ ይህንን ይሰማሉ።',
    soundBlocked:
      'አሳሽዎ ድምጹን አግዶታል። በገፃው ላይ በማንኛውም ቦታ ይጠቅሉ፣ ከዚያ ድምፅ ቁልፍን እንደገና ይጠቅሉ።',
    previewMode: 'ቅድመ ዕይታ · ዳታቤዝ አልተገናኘም',
    safeguardingTitle: 'የልጆች ደህንነት መጀመሪያ',
    safeguardingBody:
      'የልጆች መረጃ በሚና ላይ በተመሠረተ መዳረሻና በረድፍ ደረጃ ደህንነት የተጠበቀ ነው። እያንዳንዱ ለውጥ ይመዘገባል።',
  },

  auth: {
    verse: '“ሕፃናት ወደ እኔ ይምጡ።”',
    verseRef: 'ማቴዎስ 19፥14',
    safetyNote:
      'የልጆች መረጃ በሚና ላይ በተመሠረተ መዳረሻና በዳታቤዝ ደረጃ ደህንነት የተጠበቀ ነው። የልጁን መረጃ ማየት የሚገባቸው ሰዎች ብቻ ያዩታል።',
    backHome: 'መነሻ',
    showPassword: 'የይለፍ ቃል አሳይ',
    hidePassword: 'የይለፍ ቃል ደብቅ',
    login: {
      title: 'እንኳን ደህና መጡ',
      subtitle: 'ወደ የልጆች አገልግሎት ለመግባት ይግቡ።',
      email: 'የኢሜይል አድራሻ',
      password: 'የይለፍ ቃል',
      remember: 'እንደገባሁ አቆየኝ',
      forgot: 'የይለፍ ቃል ረሱ?',
      submit: 'ግባ',
      submitting: 'በመግባት ላይ…',
      previewTitle: 'የቅድመ ዕይታ ሁኔታ — ለመቃኘት ሚና ይምረጡ',
      previewNote:
        'እውነተኛ መለያ ማረጋገጫ ለመጠቀም በ .env.local ውስጥ የ Supabase ፕሮጀክት ያገናኙ — ምንም ኮድ መቀየር አያስፈልግም።',
      noAccount: 'አዲስ ነዎት?',
      createAccount: 'የወላጅ መለያ ይክፈቱ',
    },
    register: {
      title: 'የወላጅ መለያዎን ይክፈቱ',
      subtitle:
        'ወላጆችና አሳዳጊዎች እዚህ ይመዘገባሉ። ከገቡ በኋላ ልጆችዎን መመዝገብና ክፍላቸውን፣ ተገኝነታቸውንና እድገታቸውን መከታተል ይችላሉ።',
      teacherTitle: 'ከመምህራን ቡድን ይቀላቀሉ',
      teacherSubtitle:
        'ማስተማር የሚፈልጉትን የዕድሜ ክልል ይምረጡ። እያንዳንዱ ማመልከቻ ወደ ልጆች መዳረሻ ከመሰጠቱ በፊት በአስተዳዳሪ ይገመገማል።',
      accountType: 'የምመዘገበው እንደ',
      asParent: 'ወላጅ',
      asTeacher: 'መምህር',
      ageGroups: 'ማስተማር የሚፈልጉት የዕድሜ ክልል',
      ageGroupsHint: 'አንድ ወይም ከዚያ በላይ ይምረጡ። አገልግሎቱ ከ4–15 ዓመት ላሉ ልጆች ነው።',
      teachingLanguages: 'ማስተማር የሚችሉባቸው ቋንቋዎች',
      teachingLanguagesHint: 'ቢያንስ አንድ ይምረጡ።',
      teacherNote:
        'ወዲይኑ መግባት ይችላሉ። አስተዳዳሪ ቡድን ይመድብሎታል፤ ከዚያ የተመደበውን ክፍል ልጆች ያያሉ።',
      submitTeacher: 'የመምህር መለያ ክፈት',
      fullName: 'ሙሉ ስም',
      email: 'የኢሜይል አድራሻ',
      phone: 'ስልክ ቁጥር',
      password: 'የይለፍ ቃል',
      confirmPassword: 'የይለፍ ቃል ያረጋግጡ',
      consent: 'የአገልግሎቱን የልጆች ደህንነት መመሪያ እቀበላለሁ',
      consentNote:
        'የቤተሰብዎ መረጃ የሚታየው ለእርስዎና ለልጅዎ ኃላፊ ለሆኑ የአገልግሎት ሠራተኞች ብቻ ነው።',
      submit: 'መለያ ክፈት',
      submitting: 'መለያ በመክፈት ላይ…',
      haveAccount: 'ከዚህ በፊት ተመዝግበዋል?',
      signIn: 'ግባ',
    },
    forgot: {
      title: 'የይለፍ ቃልዎን ዳግም ያስጀምሩ',
      subtitle:
        'ከመለያዎ ጋር የተያያዘውን ኢሜይል ያስገቡ፤ አዲስ የይለፍ ቃል ለመምረጥ ደህንነቱ የተጠበቀ አገናኝ እንልክልዎታለን።',
      submit: 'አገናኝ ላክ',
      submitting: 'በመላክ ላይ…',
      back: 'ወደ መግቢያ ተመለስ',
    },
  },

  landing: {
    nav: {
      ministry: 'አገልግሎት',
      classes: 'ክፍሎች',
      families: 'ለቤተሰቦች',
      safety: 'ደህንነት',
      signIn: 'ግባ',
    },
    hero: {
      title: 'እያንዳንዱ ልጅ የሚታወቅ፣ የሚያድግና ደህንነቱ የተጠበቀ',
      body: 'ለሙሉ የልጆች አገልግሎት አንድ ሥርዓት — ልጆችን ይመዝግቡ፣ በማንኛውም ቀን ክፍሎችን ያካሂዱ፣ ተገኝነት ይመዝግቡ፣ ትምህርቶችን ያጋሩ እና ሁሉንም ቤተሰብ መረጃ ያድርሱ።',
      primary: 'ልጅዎን ይመዝግቡ',
      secondary: 'የመምህር / አስተዳዳሪ መግቢያ',
    },
    search: {
      what: 'ምን እየፈለጉ ነው',
      whatPlaceholder: 'ክፍል፣ ዝግጅት ወይም የመጽሐፍ ቅዱስ ጥናት',
      age: 'የዕድሜ ክልል',
      agePlaceholder: '4–6, 7–9, 10–12, 13–15',
      find: 'ፈልግ',
    },
    welcome: {
      eyebrow: 'እንኳን ደህና መጡ',
      title: 'እያንዳንዱን ልጅ በስሙ የሚያውቅ አገልግሎት',
      body: 'የቃለ ሕይወት የልጆች አገልግሎት ልጆች በእምነት፣ በባሕርይና በመተማመን እንዲያድጉ ለመርዳት ነው። ይህ መተግበሪያ ያንን እንክብካቤ ወደ ዝርዝሩ ያመጣል፤ ማን በክፍሉ እንዳለ፣ ማን ሊወስዳቸው እንደሚችል፣ ምን እየተማሩ እንደሆነና እንዴት እያደጉ እንደሆነ።',
      point1: 'ከ4–15 ዓመት ለሆኑ ልጆች በአማርኛ ወይም በእንግሊዝኛ ክፍሎች',
      point2: 'በአገልግሎቱ ቡድን የሚገመገም ደህንነቱ የተጠበቀ ምዝገባ',
      point3: 'በማንኛውም ቀን እንቅስቃሴዎች — እሁድ ብቻ አይደለም',
      point4: 'ከመጀመሩ በፊት፣ ሲጀመርና ሲጠናቀቅ ማሳወቂያ',
      cta: 'ከአገልግሎቱ ይቀላቀሉ',
      haveAccount: 'መለያ አለኝ',
      since: 'ከ1998 ጀምሮ',
      sinceNote: 'ቤተሰቦችን በማገልገል',
      informed: 'ወላጆች መረጃ እንደደረሳቸው ይሰማቸዋል',
    },
    features: {
      eyebrow: 'መተግበሪያው ምን ያደርጋል',
      title: 'የልጆች አገልግሎትዎ የሚፈልገው ሁሉ',
      body: 'በእውነተኛ የአገልግሎት ሕይወት ላይ የተመሠረተ — ሳምንታዊ ክፍሎች፣ የሳምንቱ መካከል ጥናቶች፣ ወቅታዊ ፕሮግራሞችና ከእያንዳንዱ ልጅ ጀርባ ያሉ ቤተሰቦች።',
      classesTitle: 'ለ4–15 ዓመት ልጆች ክፍሎች',
      classesBody:
        'አራት የዕድሜ ክልሎች — 4–6፣ 7–9፣ 10–12 እና 13–15 — በአማርኛ ወይም በእንግሊዝኛ፣ ቅዳሜ፣ እሁድና በሳምንቱ መካከል።',
      classesCta: 'ክፍሎችን ይመልከቱ',
      familiesTitle: 'ቤተሰቦች አብረው',
      familiesBody:
        'ወላጆች ልጆቻቸውን ይመዘግባሉ፣ ተገኝነትን፣ ትምህርቶችንና እድገትን ይከታተላሉ፣ ከመምህራን ጋርም በአንድ ቦታ ይነጋገራሉ።',
      familiesCta: 'የወላጅ እይታን ይመልከቱ',
      eventsTitle: 'ዝግጅቶችና ካምፖች',
      eventsBody:
        'ካምፖች፣ ጉዞዎች፣ ውድድሮችና የገና ፕሮግራሞች ከመቀበያ አቅም፣ ከተጠባባቂ ዝርዝርና ከዲጂታል ፈቃድ ጋር።',
      eventsCta: 'ዝግጅቶችን ይመልከቱ',
    },
    roles: {
      eyebrow: 'ሦስት መግቢያዎች',
      title: 'አንድ ሥርዓት፣ ለእያንዳንዱ ትክክለኛው እይታ',
      body: 'እያንዳንዱ ሰው የሚያስፈልገውን ብቻ ያያል። መዳረሻው በዳታቤዝ ውስጥ ይጠበቃል እንጂ በገጹ ላይ ብቻ አይደለም።',
      parents: 'ወላጆች',
      teachers: 'መምህራን',
      admins: 'አስተዳዳሪዎች',
      open: 'ክፈት',
      view: 'እይታ',
    },
    safety: {
      eyebrow: 'የልጆች ደህንነት',
      title: 'የልጆች ደህንነት ከመሠረቱ የተቀየሰ ነው',
      body: 'የአደጋ ጊዜ አድራሻዎች፣ የተፈቀደላቸው ወሳጆች ዝርዝር፣ የፎቶ ፈቃድ፣ ደህንነቱ የተጠበቀ መግቢያና መውጫ ምዝገባ፣ በሚና ላይ የተመሠረተ መዳረሻ እና የእያንዳንዱ እርምጃ ሙሉ መዝገብ።',
      statChildren: 'በሳምንት የሚገለገሉ ልጆች',
      statTeachers: 'የሰለጠኑ መምህራን',
      statAges: 'የሚገለገሉ ዕድሜዎች',
      statCheckin: 'የመግቢያ ተጠያቂነት',
      rls: 'በእያንዳንዱ ሰንጠረዥ ላይ የረድፍ ደረጃ ደህንነት',
      reminders: 'የክፍል መጀመሪያና መጨረሻ ራስ-ሰር ማሳወቂያ',
      messaging: 'በክትትል ስር የወላጅ ↔ መምህር መልእክት',
    },
    footer: {
      ministry: 'አገልግሎት',
      account: 'መለያ',
      contact: 'አድራሻ',
      signIn: 'ግባ',
      createAccount: 'መለያ ክፈት',
      resetPassword: 'የይለፍ ቃል ዳግም ማስጀመር',
      rights: 'መብቱ በሕግ የተጠበቀ ነው።',
    },
  },

  pages: {
    admin: {
      dashboard: {
        eyebrow: 'የልጆች አገልግሎት',
        title: 'የአገልግሎት አጠቃላይ እይታ',
        description: 'ዛሬ በክፍሎች፣ በቤተሰቦችና በመምህራን መካከል የሚከናወነው ሁሉ።',
        newActivity: 'አዲስ እንቅስቃሴ',
        sendAnnouncement: 'ማስታወቂያ ላክ',
        totalChildren: 'ጠቅላላ ልጆች',
        totalParents: 'ወላጆችና አሳዳጊዎች',
        totalTeachers: 'መምህራን',
        totalClasses: 'ክፍሎች',
        pending: 'በመጠባበቅ ላይ ያሉ ምዝገባዎች',
        todays: 'የዛሬ እንቅስቃሴዎች',
        upcomingEvents: 'በቅርቡ የሚመጡ ዝግጅቶች',
        attendanceRate: 'የተገኝነት መጠን',
        nextActivities: 'ቀጣይ እንቅስቃሴዎች',
        approvals: 'የምዝገባ ማጽደቂያዎች',
        capacity: 'የክፍል አቅም',
        ageGroups: 'ልጆች በዕድሜ ክልል',
        ageGroupsHint: 'አገልግሎቱ የሚያገለግልባቸው አራቱም የዕድሜ ክልሎች፣ ከ4 እስከ 15 ዓመት።',
        latestAnnouncements: 'የቅርብ ጊዜ ማስታወቂያዎች',
        recentLog: 'የቅርብ ጊዜ የክትትል መዝገብ',
      },
      users: {
        eyebrow: 'ሰዎች',
        title: 'ተጠቃሚዎችና ሚናዎች',
        description:
          'በአገልግሎቱ ውስጥ ያሉ ሁሉም መለያዎች። የአንድን ሰው ሚና መቀየር መዳረሻን ይሰጣል ወይም ያስወግዳል — እያንዳንዱ ለውጥ ይረጋገጣል እና ይመዘገባል።',
      },
      children: {
        eyebrow: 'ሰዎች',
        title: 'ልጆች',
        description:
          'በአገልግሎቱ ውስጥ ያሉ ልጆች ሙሉ መዝገብ። ሚስጥራዊ መረጃዎች ለተፈቀደላቸው ሠራተኞች ብቻ ይታያሉ።',
      },
      parents: {
        eyebrow: 'ሰዎች',
        title: 'ወላጆችና አሳዳጊዎች',
        description: 'ከልጆች ጋር የተያያዙ የቤተሰብ መለያዎች።',
      },
      teachers: {
        eyebrow: 'ሰዎች',
        title: 'መምህራን',
        description: 'መምህራን የተመደቡላቸው ክፍሎች ውስጥ ያሉ ልጆችን ብቻ ማየት ይችላሉ።',
      },
      registrations: {
        eyebrow: 'ሰዎች',
        title: 'የምዝገባ ማጽደቂያዎች',
        description:
          'በወላጆች የተመዘገቡ ልጆች ይህን ቅደም ተከተል ይከተላሉ፦ በመጠባበቅ ላይ → የአስተዳዳሪ ግምገማ → ጸድቋል፣ ተጨማሪ መረጃ ያስፈልጋል ወይም ተቀባይነት አላገኘም።',
      },
      classes: {
        eyebrow: 'አገልግሎት',
        title: 'ክፍሎች',
        description:
          'ከ4–15 ዓመት ያሉ ልጆች በአራት የዕድሜ ክልሎች ተከፍለዋል፤ እያንዳንዱም በአማርኛ፣ በእንግሊዝኛ ወይም በሁለቱም ይሰጣል።',
      },
      activities: {
        eyebrow: 'አገልግሎት',
        title: 'እንቅስቃሴዎችና መርሃ ግብር',
        description:
          'አገልግሎቱ ሳምንቱን ሙሉ ይሠራል — የቅዳሜ ክፍሎች፣ የእሁድ አምልኮ፣ የሳምንቱ መካከል የመጽሐፍ ቅዱስ ጥናት፣ የመዘምራን ልምምድ እና እርስዎ የሚፈጥሩት ማንኛውም እንቅስቃሴ።',
      },
      events: {
        eyebrow: 'አገልግሎት',
        title: 'ዝግጅቶች',
        description:
          'ካምፖች፣ ጉዞዎች፣ ውድድሮች፣ ወቅታዊ ፕሮግራሞችና ስብሰባዎች — ከአቅም፣ ከተጠባባቂ ዝርዝርና ከፈቃድ ጋር።',
      },
      lessons: {
        eyebrow: 'አገልግሎት',
        title: 'ትምህርቶችና ሥርዓተ ትምህርት',
        description:
          'የመጽሐፍ ቅዱስ ክፍሎች፣ የቃል ጥቅሶች፣ የቤት ሥራ፣ ፈተናዎችና የመማሪያ ቁሳቁሶች በእያንዳንዱ ክፍል።',
      },
      attendance: {
        eyebrow: 'አገልግሎት',
        title: 'ተገኝነት',
        description: 'በእያንዳንዱ እንቅስቃሴ ማን እንደተገኘ፣ እንደዘገየ፣ እንደተፈቀደለት ወይም እንደቀረ።',
      },
      calendar: {
        eyebrow: 'አገልግሎት',
        title: 'የቀን መቁጠሪያ',
        description:
          'ክፍሎች፣ የመጽሐፍ ቅዱስ ጥናቶች፣ ስብሰባዎች፣ ካምፖችና ልዩ እንቅስቃሴዎች በአንድ እይታ።',
      },
      announcements: {
        eyebrow: 'ግንኙነት',
        title: 'ማስታወቂያዎች',
        description:
          'ለሁሉም፣ ለወላጆች ብቻ፣ ለመምህራን ብቻ ወይም ለተወሰነ ክፍል ወይም ቡድን መላክ።',
      },
      notifications: {
        eyebrow: 'ግንኙነት',
        title: 'ማሳወቂያዎች',
        description:
          'ከመጀመሩ በፊት፣ ሲጀመርና ሲጠናቀቅ ራስ-ሰር ማሳወቂያ — እንዲሁም የመሰረዝና የጊዜ ለውጥ ማሳወቂያ።',
      },
      reports: {
        eyebrow: 'ሥርዓት',
        title: 'ሪፖርቶች',
        description: 'የአገልግሎቱ ሁኔታ በአንድ እይታ፣ ለአመራር ስብሰባዎች ከሚወጡ ሰነዶች ጋር።',
      },
      settings: {
        eyebrow: 'ሥርዓት',
        title: 'ቅንብሮች',
        description: 'የቤተክርስቲያን መረጃ፣ የደህንነት መመሪያዎች፣ ብራንድ እና የዳታቤዝ ቅንብር።',
      },
      audit: {
        eyebrow: 'ሥርዓት',
        title: 'የክትትል መዝገብ',
        description:
          'የሚና ለውጦች፣ ማጽደቂያዎች፣ የልጆች መውጣት፣ የአደጋ ጊዜ ማሳወቂያዎችና ሌሎች ሚስጥራዊ እርምጃዎች ቋሚ መዝገብ።',
      },
    },
    teacher: {
      dashboard: {
        eyebrow: 'እንኳን ደህና መጡ',
        title: 'የማስተማር ቀንዎ',
        description: 'የተመደቡልዎ ክፍሎችና ልጆች ብቻ እዚህ ይታያሉ።',
        takeAttendance: 'ተገኝነት መዝግብ',
        myChildren: 'በእኔ ኃላፊነት ያሉ ልጆች',
        myClasses: 'የእኔ ክፍሎች',
        averageAttendance: 'አማካይ ተገኝነት',
        unreadMessages: 'ያልተነበቡ መልእክቶች',
        nextActivities: 'ቀጣይ እንቅስቃሴዎችዎ',
        myStudents: 'ተማሪዎቼ',
        recentLessons: 'የቅርብ ጊዜ ትምህርቶች',
        conversations: 'ከወላጆች ጋር ውይይቶች',
      },
      classes: {
        eyebrow: 'ማስተማር',
        title: 'የእኔ ክፍሎች',
        description: 'አስተዳዳሪው የመደበልዎትን ክፍሎች ብቻ መክፈት ይችላሉ።',
      },
      students: {
        eyebrow: 'ማስተማር',
        title: 'ተማሪዎቼ',
        description:
          'በተመደቡልዎ ክፍሎች ውስጥ ያሉ ልጆች፣ በመግቢያ ጊዜ የሚያስፈልጉዎት የደህንነት ማስታወሻዎች ጋር።',
      },
      schedule: {
        eyebrow: 'ማስተማር',
        title: 'የእኔ መርሃ ግብር',
        description: 'በማንኛውም ቀን ኃላፊነት የሚወስዱበት እያንዳንዱ እንቅስቃሴ።',
      },
      attendance: {
        eyebrow: 'ማስተማር',
        title: 'ተገኝነት መዝግብ',
        description:
          'እያንዳንዱን ልጅ እንደተገኘ፣ እንደዘገየ፣ እንደተፈቀደለት ወይም እንደቀረ ምልክት ያድርጉ። ወላጆች ወዲያውኑ ያዩታል።',
      },
      lessons: {
        eyebrow: 'ትምህርት',
        title: 'ትምህርቶች',
        description:
          'ለእያንዳንዱ ክፍል የመጽሐፍ ቅዱስ ክፍል፣ የቃል ጥቅስ፣ የቤት ሥራና ቁሳቁሶችን ያቅዱ።',
      },
      progress: {
        eyebrow: 'ትምህርት',
        title: 'የልጆች እድገት',
        description:
          'በክፍሎችዎ ውስጥ ላሉ ልጆች ተገኝነት፣ ተሳትፎ፣ የቤት ሥራ፣ ፈተናዎችና የቃል ጥቅሶች።',
      },
      messages: {
        eyebrow: 'ግንኙነት',
        title: 'መልእክቶች',
        description: 'በክፍሎችዎ ውስጥ ካሉ ልጆች ወላጆች ጋር ይነጋገሩ።',
      },
      announcements: {
        eyebrow: 'ግንኙነት',
        title: 'ማስታወቂያዎችና ማሳወቂያዎች',
        description:
          'ከአገልግሎት ጽሕፈት ቤት የሚመጡ መልእክቶች፣ እንዲሁም እርስዎ ለክፍልዎ የሚልኩት ማስታወቂያ።',
      },
      events: {
        eyebrow: 'ግንኙነት',
        title: 'በቅርቡ የሚመጡ ዝግጅቶች',
        description: 'እንዲያግዙ ሊጠየቁባቸው የሚችሉ ካምፖች፣ ፕሮግራሞችና ስብሰባዎች።',
      },
    },
    parent: {
      dashboard: {
        eyebrow: 'ሰላም',
        title: 'ቤተሰብዎ በአገልግሎቱ ውስጥ',
        description: 'ስለ ልጆችዎ ሁሉም — ክፍሎች፣ ተገኝነት፣ ትምህርቶችና እድገት።',
        registerChild: 'ልጅ ይመዝግቡ',
        nextActivity: 'ቀጣይ እንቅስቃሴ',
        viewSchedule: 'መርሃ ግብር ይመልከቱ',
        myChildren: 'ልጆቼ',
        attendanceTerm: 'የዚህ ወቅት ተገኝነት',
        lessonsShared: 'የተጋሩ ትምህርቶች',
        upcomingEvents: 'በቅርቡ የሚመጡ ዝግጅቶች',
        upcomingClasses: 'በቅርቡ የሚመጡ ክፍሎችና እንቅስቃሴዎች',
        recentLessons: 'የቅርብ ጊዜ ትምህርቶችና የቤት ሥራ',
        recentAttendance: 'የቅርብ ጊዜ ተገኝነት',
        announcements: 'ማስታወቂያዎች',
        dontMiss: 'እንዳያመልጥዎ',
      },
      children: {
        eyebrow: 'ቤተሰብ',
        title: 'ልጆቼ',
        description:
          'መገለጫዎች፣ የደህንነት መረጃና ፈቃድ — ለቤተሰብዎና ለልጅዎ መምህራን ብቻ የተጠበቀ።',
      },
      registerChild: {
        eyebrow: 'ቤተሰብ',
        title: 'ልጅ ይመዝግቡ',
        description:
          'ከ4–15 ዓመት ያሉ ልጆች መቀላቀል ይችላሉ። የአገልግሎቱ ቡድን እያንዳንዱን ምዝገባ ልጁ ወደ የዕድሜ ክልሉ ከመቀላቀሉ በፊት ይገመግማል። ትምህርቱ በሙሉ በአማርኛ ነው።',
        ourGroups: 'የዕድሜ ክልሎቻችን',
        ourGroupsHint: 'ከ4–15 ዓመት፣ በአራት ክልሎች።',
      },
      progress: {
        eyebrow: 'ቤተሰብ',
        title: 'የልጆቼ እድገት',
        description:
          'ልጆችዎ እንዴት እያደጉ እንደሆነ — ተገኝነት፣ ተሳትፎ፣ የቤት ሥራ፣ የቃል ጥቅሶችና ስኬቶች።',
      },
      schedule: {
        eyebrow: 'የአገልግሎት ሕይወት',
        title: 'የእኛ መርሃ ግብር',
        description: 'ልጆችዎን የሚመለከቱ ክፍሎች፣ ጥናቶችና ዝግጅቶች ብቻ።',
      },
      attendance: {
        eyebrow: 'የአገልግሎት ሕይወት',
        title: 'ተገኝነት',
        description:
          'ልጆችዎ የተገኙበት፣ የዘገዩበት፣ የቀሩበት ወይም የተፈቀደላቸው እያንዳንዱ ክፍልና እንቅስቃሴ።',
      },
      lessons: {
        eyebrow: 'የአገልግሎት ሕይወት',
        title: 'ትምህርቶችና የቤት ሥራ',
        description:
          'ልጆችዎ ምን እየተማሩ እንደሆነ፣ አብራችሁ በቤት ልትለማመዱ የምትችሉ የቃል ጥቅሶች ጋር።',
      },
      events: {
        eyebrow: 'የአገልግሎት ሕይወት',
        title: 'ዝግጅቶችና ካምፖች',
        description:
          'ልጆችዎን ይመዝግቡ፣ የፈቃድ ቅጾችን ይፈርሙ እና የሚመጣውን ይከታተሉ።',
      },
      messages: {
        eyebrow: 'ግንኙነት',
        title: 'መልእክቶች',
        description: 'ከልጆችዎ መምህራንና ከአገልግሎት ጽሕፈት ቤት ጋር ይነጋገሩ።',
      },
      notifications: {
        eyebrow: 'ግንኙነት',
        title: 'ማሳወቂያዎች',
        description:
          'የክፍል ማስታወሻዎች፣ የመጀመሪያና የመጨረሻ ማሳወቂያዎች፣ የመርሃ ግብር ለውጦችና የአገልግሎት ማስታወቂያዎች።',
      },
      settings: {
        eyebrow: 'ግንኙነት',
        title: 'መለያዬ',
        description: 'መገለጫዎ፣ የይለፍ ቃልዎና የማሳወቂያ ምርጫዎችዎ።',
      },
    },
  },
};

export const dictionaries: Record<Locale, Dictionary | Translation<Dictionary>> = {
  en,
  am,
};
