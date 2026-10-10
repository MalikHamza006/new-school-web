import {
  Award,
  BarChart3,
  Bell,
  BookOpen,
  CalendarCheck,
  CalendarDays,
  ClipboardCheck,
  ClipboardList,
  GraduationCap,
  LayoutDashboard,
  PencilLine,
  TrendingUp,
  UserCog,
  UserPlus,
  Users,
  Wallet,
  type LucideIcon,
} from 'lucide-react';
import type { PortalId } from './portals';
import type { Permission } from './portalAccess';

/**
 * Content for the four demo portal dashboards.
 *
 * WHAT THIS IS
 * ------------
 * A complete, navigable demonstration of each portal: the pages, the sections
 * and the sample rows a signed-in student, parent, teacher or administrator
 * would see. Everything is DATA — there is no per-page component to keep in
 * sync, so adding a page means adding one section object here.
 *
 * WHAT THIS IS NOT
 * ----------------
 * None of it is real. Every name, mark, amount and date is invented sample
 * content for a design demo, and the UI says so with a persistent "Demo" badge.
 * The school has not confirmed any of these figures (`confirmed: false` on every
 * portal in `data/portals.ts`), so nothing here may ever be presented as a real
 * attendance record, result or fee. There is no backend and no persistence.
 *
 * Block model
 * -----------
 * Each section renders from a small set of blocks (`DashboardBlock`). A block is
 * pure data plus a `type`; `BlockRenderer` maps the type to a component. That is
 * what keeps twenty-plus pages on-brand without twenty-plus bespoke layouts.
 */

/* ------------------------------------------------------------------ */
/* Block types                                                         */
/* ------------------------------------------------------------------ */

export type BadgeTone = 'gold' | 'navy' | 'muted' | 'success' | 'warning';

export interface StatItem {
  label: string;
  value: string;
  hint?: string;
  icon?: LucideIcon;
}

export interface StatBlock {
  type: 'stats';
  items: StatItem[];
}

/** A cell is either plain text, or text plus a badge tone. */
export type TableCell = string | { text: string; badge?: BadgeTone };

export interface TableBlock {
  type: 'table';
  columns: string[];
  rows: TableCell[][];
  caption?: string;
}

export interface SchedulePeriod {
  time: string;
  title: string;
  detail?: string;
}

export interface ScheduleDay {
  day: string;
  periods: SchedulePeriod[];
}

export interface ScheduleBlock {
  type: 'schedule';
  days: ScheduleDay[];
}

export interface ProgressItem {
  label: string;
  /** 0–100. */
  value: number;
  detail?: string;
}

export interface ProgressBlock {
  type: 'progress';
  items: ProgressItem[];
  caption?: string;
}

export interface ListEntry {
  title: string;
  meta?: string;
  description?: string;
  badge?: string;
  badgeTone?: BadgeTone;
}

export interface ListBlock {
  type: 'list';
  heading?: string;
  items: ListEntry[];
}

export interface NoticeEntry {
  title: string;
  date: string;
  body: string;
  tag?: string;
}

export interface NoticeBlock {
  type: 'notices';
  items: NoticeEntry[];
}

export interface FeeLine {
  label: string;
  amount: string;
  status: BadgeTone;
  statusLabel: string;
}

export interface FeesBlock {
  type: 'fees';
  lines: FeeLine[];
  totalLabel: string;
  total: string;
  note?: string;
}

export interface TimelineEntry {
  title: string;
  time: string;
  description?: string;
}

export interface TimelineBlock {
  type: 'timeline';
  items: TimelineEntry[];
}

export interface NoteBlock {
  type: 'note';
  text: string;
  tone?: 'info' | 'gold';
}

export type DashboardBlock =
  | StatBlock
  | TableBlock
  | ScheduleBlock
  | ProgressBlock
  | ListBlock
  | NoticeBlock
  | FeesBlock
  | TimelineBlock
  | NoteBlock;

/* ------------------------------------------------------------------ */
/* Section + dashboard types                                           */
/* ------------------------------------------------------------------ */

export interface PortalSection {
  /** Section id — also the URL segment: `/portal/:role/:id`. */
  id: string;
  label: string;
  icon: LucideIcon;
  /** The permission a role must hold to see and open this section. */
  permission: Permission;
  title: string;
  description: string;
  blocks: DashboardBlock[];
}

export interface PortalDashboard {
  role: PortalId;
  /** Matches `Portal.name`. */
  portalName: string;
  audience: string;
  greeting: string;
  subtitle: string;
  /** The sample signed-in identity shown in the topbar and sidebar. */
  user: { name: string; meta: string; initials: string };
  sections: PortalSection[];
}

/** Shown in every dashboard, and on the demo entry buttons. */
export const demoNotice =
  'Demo preview with sample data. This portal is not connected to any live school system, and nothing here is a real record.';

/* ------------------------------------------------------------------ */
/* Student                                                             */
/* ------------------------------------------------------------------ */

const student: PortalDashboard = {
  role: 'student',
  portalName: 'Student Portal',
  audience: 'Students',
  greeting: 'Welcome back, Ayesha',
  subtitle: 'Your classes, work and results for the current term.',
  user: { name: 'Ayesha Khan', meta: 'Grade 9-A · Roll 2024-001', initials: 'AK' },
  sections: [
    {
      id: 'overview',
      label: 'Overview',
      icon: LayoutDashboard,
      permission: 'overview:view',
      title: 'Overview',
      description: 'A snapshot of your attendance, work and upcoming deadlines.',
      blocks: [
        {
          type: 'stats',
          items: [
            { label: 'Attendance', value: '94%', hint: 'This term', icon: CalendarCheck },
            { label: 'Due this week', value: '3', hint: 'Assignments', icon: ClipboardList },
            { label: 'Average score', value: '82%', hint: 'Across subjects', icon: Award },
            { label: 'Class position', value: '6th', hint: 'Of 41 students', icon: TrendingUp },
          ],
        },
        {
          type: 'list',
          heading: 'Due this week',
          items: [
            { title: "Physics lab report: Ohm's law", meta: 'Physics · Ms. Sana', badge: 'Thu', badgeTone: 'warning' },
            { title: 'Mathematics exercise 4.2', meta: 'Mathematics · Mr. Adnan', badge: 'Fri', badgeTone: 'muted' },
            { title: 'English essay draft', meta: 'English · Ms. Hira', badge: 'Mon', badgeTone: 'muted' },
          ],
        },
        {
          type: 'note',
          text: 'Attendance and marks shown here are sample values for the demo.',
        },
      ],
    },
    {
      id: 'timetable',
      label: 'Timetable',
      icon: CalendarDays,
      permission: 'timetable:view',
      title: 'Timetable',
      description: 'Your weekly class schedule. Periods and rooms are examples.',
      blocks: [
        {
          type: 'schedule',
          days: [
            {
              day: 'Monday',
              periods: [
                { time: '08:00', title: 'Mathematics', detail: 'Room 12 · Mr. Adnan' },
                { time: '09:00', title: 'Physics', detail: 'Lab 2 · Ms. Sana' },
                { time: '10:00', title: 'English', detail: 'Room 12 · Ms. Hira' },
                { time: '11:15', title: 'Urdu', detail: 'Room 9 · Mr. Kamran' },
              ],
            },
            {
              day: 'Tuesday',
              periods: [
                { time: '08:00', title: 'Chemistry', detail: 'Lab 1 · Mr. Bilal' },
                { time: '09:00', title: 'Mathematics', detail: 'Room 12 · Mr. Adnan' },
                { time: '10:00', title: 'Biology', detail: 'Room 7 · Ms. Nadia' },
                { time: '11:15', title: 'Islamiat', detail: 'Room 4 · Mr. Farooq' },
              ],
            },
            {
              day: 'Wednesday',
              periods: [
                { time: '08:00', title: 'English', detail: 'Room 12 · Ms. Hira' },
                { time: '09:00', title: 'Physics', detail: 'Lab 2 · Ms. Sana' },
                { time: '10:00', title: 'Mathematics', detail: 'Room 12 · Mr. Adnan' },
                { time: '11:15', title: 'Computer Science', detail: 'IT Lab · Mr. Usman' },
              ],
            },
            {
              day: 'Thursday',
              periods: [
                { time: '08:00', title: 'Biology', detail: 'Room 7 · Ms. Nadia' },
                { time: '09:00', title: 'Chemistry', detail: 'Lab 1 · Mr. Bilal' },
                { time: '10:00', title: 'Pak Studies', detail: 'Room 9 · Mr. Kamran' },
                { time: '11:15', title: 'Mathematics', detail: 'Room 12 · Mr. Adnan' },
              ],
            },
            {
              day: 'Friday',
              periods: [
                { time: '08:00', title: 'Mathematics', detail: 'Room 12 · Mr. Adnan' },
                { time: '09:00', title: 'English', detail: 'Room 12 · Ms. Hira' },
                { time: '10:00', title: 'Physics', detail: 'Lab 2 · Ms. Sana' },
                { time: '11:15', title: 'Sports', detail: 'Ground · Mr. Tauqir' },
              ],
            },
          ],
        },
      ],
    },
    {
      id: 'assignments',
      label: 'Assignments',
      icon: ClipboardList,
      permission: 'assignment:view',
      title: 'Assignments',
      description: 'What has been set, when it is due, and where each one stands.',
      blocks: [
        {
          type: 'table',
          columns: ['Assignment', 'Subject', 'Due', 'Status'],
          rows: [
            ["Lab report: Ohm's law", 'Physics', 'Thu 12 Jun', { text: 'In progress', badge: 'warning' }],
            ['Exercise 4.2', 'Mathematics', 'Fri 13 Jun', { text: 'Not started', badge: 'muted' }],
            ['Essay draft', 'English', 'Mon 16 Jun', { text: 'Draft due', badge: 'gold' }],
            ['Map work', 'Geography', 'Last week', { text: 'Submitted', badge: 'success' }],
          ],
        },
        {
          type: 'note',
          text: 'Submitting work is part of this portal. Submissions are disabled in the demo.',
          tone: 'info',
        },
      ],
    },
    {
      id: 'attendance',
      label: 'Attendance',
      icon: CalendarCheck,
      permission: 'attendance:view',
      title: 'Attendance',
      description: 'Your attendance for the current term, by month and by day.',
      blocks: [
        {
          type: 'stats',
          items: [
            { label: 'Present', value: '94%', hint: 'This term' },
            { label: 'Absent', value: '3%', hint: 'This term' },
            { label: 'On leave', value: '3%', hint: 'This term' },
            { label: 'Days recorded', value: '42', hint: 'This term' },
          ],
        },
        {
          type: 'progress',
          caption: 'Monthly attendance',
          items: [
            { label: 'April', value: 96, detail: '96%' },
            { label: 'May', value: 93, detail: '93%' },
            { label: 'June', value: 95, detail: '95%' },
            { label: 'July', value: 92, detail: '92%' },
          ],
        },
        {
          type: 'table',
          columns: ['Date', 'Day', 'Status'],
          rows: [
            ['10 Jun', 'Tuesday', { text: 'Present', badge: 'success' }],
            ['11 Jun', 'Wednesday', { text: 'Present', badge: 'success' }],
            ['12 Jun', 'Thursday', { text: 'On leave', badge: 'warning' }],
            ['13 Jun', 'Friday', { text: 'Present', badge: 'success' }],
          ],
        },
      ],
    },
    {
      id: 'results',
      label: 'Results',
      icon: GraduationCap,
      permission: 'result:view',
      title: 'Results',
      description: 'Your latest assessment results and subject averages.',
      blocks: [
        {
          type: 'progress',
          caption: 'Subject-wise average',
          items: [
            { label: 'English', value: 88, detail: '88%' },
            { label: 'Mathematics', value: 86, detail: '86%' },
            { label: 'Urdu', value: 84, detail: '84%' },
            { label: 'Chemistry', value: 82, detail: '82%' },
            { label: 'Physics', value: 79, detail: '79%' },
            { label: 'Biology', value: 77, detail: '77%' },
          ],
        },
        {
          type: 'table',
          columns: ['Subject', 'Marks', 'Grade', 'Result'],
          rows: [
            ['English', '88 / 100', { text: 'A', badge: 'success' }],
            ['Mathematics', '86 / 100', { text: 'A', badge: 'success' }],
            ['Urdu', '84 / 100', { text: 'A', badge: 'success' }],
            ['Chemistry', '82 / 100', { text: 'B', badge: 'gold' }],
            ['Physics', '79 / 100', { text: 'B', badge: 'gold' }],
            ['Biology', '77 / 100', { text: 'B', badge: 'gold' }],
          ],
        },
        {
          type: 'note',
          text: 'Marks shown are sample data for the demo and are not an official result.',
        },
      ],
    },
  ],
};

/* ------------------------------------------------------------------ */
/* Parent                                                              */
/* ------------------------------------------------------------------ */

const parent: PortalDashboard = {
  role: 'parent',
  portalName: 'Parents Portal',
  audience: 'Parents',
  greeting: 'Welcome, Mr. Imran',
  subtitle: 'Attendance, progress, fees and notices for your child.',
  user: { name: 'Imran Khan', meta: 'Guardian of Ayesha Khan · Grade 9-A', initials: 'IK' },
  sections: [
    {
      id: 'overview',
      label: 'Overview',
      icon: LayoutDashboard,
      permission: 'overview:view',
      title: 'Overview',
      description: "A summary of your child's term at a glance.",
      blocks: [
        {
          type: 'stats',
          items: [
            { label: 'Attendance', value: '94%', hint: 'This term', icon: CalendarCheck },
            { label: 'Average score', value: '82%', hint: 'Across subjects', icon: Award },
            { label: 'Fees outstanding', value: 'Rs 4,200', hint: 'Due 20 Jun', icon: Wallet },
            { label: 'New notices', value: '2', hint: 'Unread', icon: Bell },
          ],
        },
        {
          type: 'progress',
          caption: 'Subject performance — Ayesha Khan',
          items: [
            { label: 'English', value: 88, detail: '88%' },
            { label: 'Mathematics', value: 86, detail: '86%' },
            { label: 'Urdu', value: 84, detail: '84%' },
            { label: 'Chemistry', value: 82, detail: '82%' },
            { label: 'Physics', value: 79, detail: '79%' },
            { label: 'Biology', value: 77, detail: '77%' },
          ],
        },
        {
          type: 'notices',
          items: [
            {
              title: 'Parent–teacher meeting',
              date: '12 Jun',
              tag: 'Event',
              body: "The term's parent–teacher meeting is scheduled for Saturday. Slots are allocated by the class teacher.",
            },
            {
              title: 'Summer break notice',
              date: '08 Jun',
              tag: 'Notice',
              body: 'The school will observe the summer break as per the academic calendar. Details are given in the office notice.',
            },
          ],
        },
      ],
    },
    {
      id: 'progress',
      label: 'Progress',
      icon: TrendingUp,
      permission: 'progress:view',
      title: 'Progress',
      description: 'How your child is doing across subjects and terms.',
      blocks: [
        {
          type: 'progress',
          caption: 'Subject performance',
          items: [
            { label: 'English', value: 88, detail: 'Grade A' },
            { label: 'Mathematics', value: 86, detail: 'Grade A' },
            { label: 'Urdu', value: 84, detail: 'Grade A' },
            { label: 'Chemistry', value: 82, detail: 'Grade B' },
            { label: 'Physics', value: 79, detail: 'Grade B' },
            { label: 'Biology', value: 77, detail: 'Grade B' },
          ],
        },
        {
          type: 'table',
          columns: ['Term', 'Average', 'Grade', 'Class position'],
          rows: [
            ['First term', '80%', { text: 'A', badge: 'success' }, '7th'],
            ['Second term', '82%', { text: 'A', badge: 'success' }, '6th'],
            ['Mid-year', '81%', { text: 'A', badge: 'success' }, '6th'],
          ],
        },
      ],
    },
    {
      id: 'attendance',
      label: 'Attendance',
      icon: CalendarCheck,
      permission: 'attendance:view',
      title: 'Attendance',
      description: "Your child's attendance for the current term.",
      blocks: [
        {
          type: 'stats',
          items: [
            { label: 'Present', value: '94%', hint: 'This term' },
            { label: 'Absent', value: '3%', hint: 'This term' },
            { label: 'On leave', value: '3%', hint: 'This term' },
            { label: 'Days recorded', value: '42', hint: 'This term' },
          ],
        },
        {
          type: 'progress',
          caption: 'Monthly attendance',
          items: [
            { label: 'April', value: 96, detail: '96%' },
            { label: 'May', value: 93, detail: '93%' },
            { label: 'June', value: 95, detail: '95%' },
            { label: 'July', value: 92, detail: '92%' },
          ],
        },
        {
          type: 'table',
          columns: ['Date', 'Day', 'Status', 'Note'],
          rows: [
            ['10 Jun', 'Tuesday', { text: 'Present', badge: 'success' }, '—'],
            ['11 Jun', 'Wednesday', { text: 'Present', badge: 'success' }, '—'],
            ['12 Jun', 'Thursday', { text: 'On leave', badge: 'warning' }, 'Leave requested'],
            ['13 Jun', 'Friday', { text: 'Present', badge: 'success' }, '—'],
          ],
        },
      ],
    },
    {
      id: 'fees',
      label: 'Fees',
      icon: Wallet,
      permission: 'fee:view',
      title: 'Fees',
      description: 'What has been paid, and what is outstanding for the term.',
      blocks: [
        {
          type: 'fees',
          lines: [
            { label: 'Tuition fee — July', amount: 'Rs 9,500', status: 'success', statusLabel: 'Paid' },
            { label: 'Transport — July', amount: 'Rs 2,500', status: 'success', statusLabel: 'Paid' },
            { label: 'Examination fee', amount: 'Rs 1,200', status: 'warning', statusLabel: 'Due' },
            { label: 'Uniform & books', amount: 'Rs 3,000', status: 'muted', statusLabel: 'Pending' },
          ],
          totalLabel: 'Outstanding',
          total: 'Rs 4,200',
          note: 'Amounts are sample data for the demo. For actual dues, please contact the school office.',
        },
        {
          type: 'table',
          columns: ['Date', 'Item', 'Amount', 'Status'],
          rows: [
            ['05 May', 'Tuition fee — May', 'Rs 9,500', { text: 'Paid', badge: 'success' }],
            ['05 Jun', 'Tuition fee — June', 'Rs 9,500', { text: 'Paid', badge: 'success' }],
            ['05 Jun', 'Transport — June', 'Rs 2,500', { text: 'Paid', badge: 'success' }],
          ],
        },
      ],
    },
    {
      id: 'notices',
      label: 'Notices',
      icon: Bell,
      permission: 'notice:view',
      title: 'Notices',
      description: 'Announcements and messages from the school.',
      blocks: [
        {
          type: 'notices',
          items: [
            {
              title: 'Parent–teacher meeting',
              date: '12 Jun',
              tag: 'Event',
              body: "The term's parent–teacher meeting is scheduled for Saturday. Please book a slot with the class teacher in advance.",
            },
            {
              title: 'Summer break notice',
              date: '08 Jun',
              tag: 'Notice',
              body: 'The school will observe the summer break as per the academic calendar. The office remains open for admissions.',
            },
            {
              title: 'Fee submission reminder',
              date: '01 Jun',
              tag: 'Fees',
              body: 'Kindly clear outstanding dues before the due date to avoid a late fee. Contact the accounts office for details.',
            },
            {
              title: 'Annual sports day',
              date: '24 May',
              tag: 'Event',
              body: 'Annual sports day will be held later this term. Students should report in the school sports kit.',
            },
          ],
        },
      ],
    },
  ],
};

/* ------------------------------------------------------------------ */
/* Teacher                                                             */
/* ------------------------------------------------------------------ */

const teacher: PortalDashboard = {
  role: 'teacher',
  portalName: 'Teacher Portal',
  audience: 'Teachers',
  greeting: 'Good morning, Ms. Sana',
  subtitle: 'Your classes, registers, assignments and grading.',
  user: { name: 'Sana Malik', meta: 'Science Department · Staff STF-014', initials: 'SM' },
  sections: [
    {
      id: 'overview',
      label: 'Overview',
      icon: LayoutDashboard,
      permission: 'overview:view',
      title: 'Overview',
      description: 'Your day, your classes and what is waiting on you.',
      blocks: [
        {
          type: 'stats',
          items: [
            { label: 'Classes today', value: '5', hint: 'Across 4 rooms', icon: CalendarDays },
            { label: 'Students', value: '168', hint: 'In your classes', icon: Users },
            { label: 'Awaiting grading', value: '24', hint: 'Submissions', icon: PencilLine },
            { label: 'New notices', value: '1', hint: 'From the office', icon: Bell },
          ],
        },
        {
          type: 'schedule',
          days: [
            {
              day: 'Today',
              periods: [
                { time: '08:00', title: 'Physics — Grade 9-A', detail: 'Lab 2' },
                { time: '09:00', title: 'Physics — Grade 9-B', detail: 'Room 12' },
                { time: '10:00', title: 'Science — Grade 8-C', detail: 'Room 7' },
                { time: '11:15', title: 'Physics — Grade 10-A', detail: 'Lab 2' },
                { time: '12:15', title: 'Science — Grade 8-A', detail: 'Room 4' },
              ],
            },
          ],
        },
        {
          type: 'list',
          heading: 'Awaiting grading',
          items: [
            { title: "Physics lab report — Grade 9-A", meta: '18 submissions', badge: '24', badgeTone: 'warning' },
            { title: 'Science quiz — Grade 8-C', meta: '6 submissions', badge: '6', badgeTone: 'muted' },
          ],
        },
      ],
    },
    {
      id: 'classes',
      label: 'Classes',
      icon: BookOpen,
      permission: 'class:view',
      title: 'Classes',
      description: 'The classes and subjects assigned to you.',
      blocks: [
        {
          type: 'table',
          columns: ['Class', 'Subject', 'Students', 'Room', 'Timings'],
          rows: [
            ['Grade 9-A', 'Physics', '41', 'Lab 2', '08:00 – 09:00'],
            ['Grade 9-B', 'Physics', '39', 'Room 12', '09:00 – 10:00'],
            ['Grade 8-C', 'Science', '44', 'Room 7', '10:00 – 11:00'],
            ['Grade 10-A', 'Physics', '44', 'Lab 2', '11:15 – 12:15'],
          ],
        },
        {
          type: 'note',
          text: 'Access is limited to the classes and subjects assigned to you.',
        },
      ],
    },
    {
      id: 'attendance',
      label: 'Attendance register',
      icon: ClipboardCheck,
      permission: 'attendance:manage',
      title: 'Attendance register',
      description: 'Take and manage the register for Grade 9-A, Physics.',
      blocks: [
        {
          type: 'stats',
          items: [
            { label: 'Present', value: '38', hint: 'Of 41' },
            { label: 'Absent', value: '2', hint: 'Marked today' },
            { label: 'On leave', value: '1', hint: 'Approved' },
          ],
        },
        {
          type: 'table',
          columns: ['Roll', 'Student', 'Status'],
          rows: [
            ['2024-001', 'Ayesha Khan', { text: 'Present', badge: 'success' }],
            ['2024-002', 'Bilal Ahmed', { text: 'Present', badge: 'success' }],
            ['2024-003', 'Hina Tariq', { text: 'Absent', badge: 'warning' }],
            ['2024-004', 'Usman Raza', { text: 'On leave', badge: 'gold' }],
            ['2024-005', 'Zainab Ali', { text: 'Present', badge: 'success' }],
          ],
        },
        {
          type: 'note',
          text: 'Marking the register is part of this portal. Statuses shown are sample values.',
          tone: 'info',
        },
      ],
    },
    {
      id: 'assignments',
      label: 'Assignments',
      icon: ClipboardList,
      permission: 'assignment:manage',
      title: 'Assignments',
      description: 'Set work, track submissions and publish material.',
      blocks: [
        {
          type: 'table',
          columns: ['Assignment', 'Class', 'Due', 'Submitted'],
          rows: [
            ["Lab report: Ohm's law", 'Grade 9-A', 'Thu 12 Jun', { text: '18 / 41', badge: 'warning' }],
            ['Science quiz revision', 'Grade 8-C', 'Fri 13 Jun', { text: '35 / 44', badge: 'success' }],
            ['Chapter 4 problems', 'Grade 9-B', 'Mon 16 Jun', { text: '0 / 39', badge: 'muted' }],
          ],
        },
        {
          type: 'progress',
          caption: 'Submissions by class',
          items: [
            { label: 'Grade 9-A', value: 44, detail: '18 of 41' },
            { label: 'Grade 9-B', value: 0, detail: '0 of 39' },
            { label: 'Grade 8-C', value: 80, detail: '35 of 44' },
            { label: 'Grade 10-A', value: 62, detail: '27 of 44' },
          ],
        },
      ],
    },
    {
      id: 'grades',
      label: 'Grades',
      icon: PencilLine,
      permission: 'grade:manage',
      title: 'Grades',
      description: 'Enter and manage marks for your subjects.',
      blocks: [
        {
          type: 'table',
          columns: ['Student', 'Assessment', 'Marks', 'Grade'],
          rows: [
            ['Ayesha Khan', 'Physics — mid term', '86 / 100', { text: 'A', badge: 'success' }],
            ['Bilal Ahmed', 'Physics — mid term', '72 / 100', { text: 'B', badge: 'gold' }],
            ['Hina Tariq', 'Physics — mid term', '68 / 100', { text: 'C', badge: 'muted' }],
            ['Usman Raza', 'Physics — mid term', '91 / 100', { text: 'A+', badge: 'success' }],
            ['Zainab Ali', 'Physics — mid term', '79 / 100', { text: 'B', badge: 'gold' }],
          ],
        },
        {
          type: 'note',
          text: 'Marks entered here are sample data for the demo and are not recorded anywhere.',
        },
      ],
    },
  ],
};

/* ------------------------------------------------------------------ */
/* Admin                                                               */
/* ------------------------------------------------------------------ */

const admin: PortalDashboard = {
  role: 'admin',
  portalName: 'Admin Portal',
  audience: 'Staff',
  greeting: 'School office',
  subtitle: 'Admissions, records, staff, fees and reports.',
  user: { name: 'Office Administrator', meta: 'School Office · Authorised account', initials: 'OA' },
  sections: [
    {
      id: 'overview',
      label: 'Overview',
      icon: LayoutDashboard,
      permission: 'overview:view',
      title: 'Overview',
      description: 'The numbers the office watches, and what came in today.',
      blocks: [
        {
          type: 'stats',
          items: [
            { label: 'Students', value: '640', hint: 'On roll', icon: Users },
            { label: 'Staff', value: '48', hint: 'Teaching & support', icon: UserCog },
            { label: 'Applications', value: '37', hint: 'Open this term', icon: UserPlus },
            { label: 'Fees collected', value: 'Rs 1.2M', hint: 'This month', icon: Wallet },
          ],
        },
        {
          type: 'timeline',
          items: [
            { title: 'New admission enquiry', time: '09:12', description: 'Grade 6 — referred to the admissions desk.' },
            { title: 'Fee receipt issued', time: '09:40', description: 'Rs 9,500 — tuition, Grade 9-A.' },
            { title: 'Staff leave approved', time: '10:05', description: 'Science department, one day.' },
            { title: 'Notice published', time: '11:20', description: 'Parent–teacher meeting, all classes.' },
          ],
        },
        {
          type: 'note',
          text: 'This is a demo of the office view. All figures are sample data.',
        },
      ],
    },
    {
      id: 'admissions',
      label: 'Admissions',
      icon: UserPlus,
      permission: 'admission:manage',
      title: 'Admissions',
      description: 'Applications in progress, from enquiry to enrolment.',
      blocks: [
        {
          type: 'stats',
          items: [
            { label: 'New applications', value: '37', hint: 'This term' },
            { label: 'Interviews', value: '12', hint: 'Scheduled' },
            { label: 'Offers made', value: '9', hint: 'Awaiting reply' },
            { label: 'Enrolled', value: '21', hint: 'Confirmed' },
          ],
        },
        {
          type: 'table',
          columns: ['Applicant', 'Class', 'Applied', 'Status'],
          rows: [
            ['A. Rehman', 'Grade 6', '10 Jun', { text: 'Interview', badge: 'gold' }],
            ['S. Nawaz', 'Grade 9', '09 Jun', { text: 'Offer sent', badge: 'warning' }],
            ['M. Iqbal', 'Grade 1', '08 Jun', { text: 'Enrolled', badge: 'success' }],
            ['K. Aslam', 'Grade 11', '07 Jun', { text: 'Under review', badge: 'muted' }],
          ],
        },
        {
          type: 'note',
          text: 'Applications shown are sample records for the demo.',
          tone: 'info',
        },
      ],
    },
    {
      id: 'students',
      label: 'Students',
      icon: Users,
      permission: 'student:manage',
      title: 'Students',
      description: 'Student records across the school.',
      blocks: [
        {
          type: 'stats',
          items: [
            { label: 'Total students', value: '640', hint: 'On roll' },
            { label: 'Boys', value: '342', hint: '53%' },
            { label: 'Girls', value: '298', hint: '47%' },
            { label: 'New this term', value: '21', hint: 'Enrolled' },
          ],
        },
        {
          type: 'table',
          columns: ['Student', 'Class', 'Guardian', 'Status'],
          rows: [
            ['Ayesha Khan', 'Grade 9-A', 'Imran Khan', { text: 'Active', badge: 'success' }],
            ['Bilal Ahmed', 'Grade 9-A', 'Nadeem Ahmed', { text: 'Active', badge: 'success' }],
            ['Hina Tariq', 'Grade 9-A', 'Tariq Mehmood', { text: 'Active', badge: 'success' }],
            ['Usman Raza', 'Grade 9-A', 'Raza Ali', { text: 'Fees due', badge: 'warning' }],
          ],
        },
      ],
    },
    {
      id: 'staff',
      label: 'Staff',
      icon: UserCog,
      permission: 'staff:manage',
      title: 'Staff',
      description: 'Teaching and support staff records.',
      blocks: [
        {
          type: 'table',
          columns: ['Name', 'Role', 'Department', 'Status'],
          rows: [
            ['Sana Malik', 'Teacher', 'Science', { text: 'Active', badge: 'success' }],
            ['Adnan Yousaf', 'Teacher', 'Mathematics', { text: 'Active', badge: 'success' }],
            ['Hira Shah', 'Teacher', 'English', { text: 'Active', badge: 'success' }],
            ['Kamran Butt', 'Teacher', 'Urdu', { text: 'On leave', badge: 'warning' }],
            ['Nadia Aslam', 'Teacher', 'Biology', { text: 'Active', badge: 'success' }],
          ],
        },
        {
          type: 'note',
          text: 'Staff directory shown is sample data for the demo.',
        },
      ],
    },
    {
      id: 'fees',
      label: 'Fees',
      icon: Wallet,
      permission: 'fee:manage',
      title: 'Fees',
      description: 'Collection this month, and outstanding dues by class.',
      blocks: [
        {
          type: 'stats',
          items: [
            { label: 'Collected', value: 'Rs 1.2M', hint: 'This month' },
            { label: 'Outstanding', value: 'Rs 184,000', hint: 'Across classes' },
            { label: 'Receipts', value: '128', hint: 'This month' },
            { label: 'Late fee', value: 'Rs 6,400', hint: 'Charged' },
          ],
        },
        {
          type: 'progress',
          caption: 'Collection by class',
          items: [
            { label: 'Grade 9', value: 92, detail: '92%' },
            { label: 'Grade 8', value: 88, detail: '88%' },
            { label: 'Grade 10', value: 81, detail: '81%' },
            { label: 'Grade 6', value: 76, detail: '76%' },
          ],
        },
        {
          type: 'table',
          columns: ['Receipt', 'Student', 'Amount', 'Status'],
          rows: [
            ['R-1042', 'Ayesha Khan', 'Rs 12,000', { text: 'Paid', badge: 'success' }],
            ['R-1041', 'Bilal Ahmed', 'Rs 9,500', { text: 'Paid', badge: 'success' }],
            ['R-1040', 'Usman Raza', 'Rs 4,200', { text: 'Partial', badge: 'warning' }],
            ['R-1039', 'Hina Tariq', 'Rs 9,500', { text: 'Paid', badge: 'success' }],
          ],
        },
      ],
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: BarChart3,
      permission: 'report:view',
      title: 'Reports',
      description: 'Attendance, enrolment and performance reports.',
      blocks: [
        {
          type: 'stats',
          items: [
            { label: 'School attendance', value: '93%', hint: 'This term' },
            { label: 'Enrolment', value: '640', hint: 'On roll' },
            { label: 'Applications', value: '37', hint: 'This term' },
            { label: 'Pass rate', value: '96%', hint: 'Last result' },
          ],
        },
        {
          type: 'progress',
          caption: 'Attendance by class',
          items: [
            { label: 'Grade 9', value: 95, detail: '95%' },
            { label: 'Grade 8', value: 94, detail: '94%' },
            { label: 'Grade 10', value: 92, detail: '92%' },
            { label: 'Grade 6', value: 90, detail: '90%' },
          ],
        },
        {
          type: 'table',
          columns: ['Report', 'Period', 'Status'],
          rows: [
            ['Attendance summary', 'This term', { text: 'Ready', badge: 'success' }],
            ['Enrolment by class', 'This term', { text: 'Ready', badge: 'success' }],
            ['Fee collection', 'This month', { text: 'Ready', badge: 'success' }],
            ['Result analysis', 'Last result', { text: 'Draft', badge: 'gold' }],
          ],
        },
        {
          type: 'note',
          text: 'Reports are sample data for the demo and are not generated from real records.',
        },
      ],
    },
  ],
};

/* ------------------------------------------------------------------ */
/* Registry                                                            */
/* ------------------------------------------------------------------ */

export const portalDashboards: Record<PortalId, PortalDashboard> = {
  student,
  parent,
  teacher,
  admin,
};

export function getDashboard(role: PortalId): PortalDashboard {
  return portalDashboards[role];
}

export function getSection(role: PortalId, sectionId: string): PortalSection | undefined {
  return portalDashboards[role].sections.find((section) => section.id === sectionId);
}
