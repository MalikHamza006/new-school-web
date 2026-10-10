import {
  CalendarDays,
  GraduationCap,
  Hash,
  IdCard,
  KeyRound,
  Layers,
  Mail,
  Phone,
  ShieldCheck,
  User,
  UserCog,
  Users,
  type LucideIcon,
} from 'lucide-react';

/**
 * The four portal identities.
 *
 * This is the single source of role identity across the demo: it is the route
 * segment (`/login/:portalId`, `/portal/:role`), the key into the RBAC map in
 * `data/portalAccess`, and the key into the dashboard content in
 * `data/portalDashboards`. Keeping one union here is what stops a role, its
 * permissions and its pages from ever drifting apart.
 */
export type PortalId = 'student' | 'parent' | 'teacher' | 'admin';

/**
 * Who the four portals are for.
 *
 * The order is deliberate: most public-facing first (students, parents), then
 * staff (teachers), then the smallest group (admin). A visitor choosing a portal
 * is usually a student or a parent, so those should not be buried at the bottom
 * of a grid.
 */
export type PortalAudience = 'Students' | 'Parents' | 'Teachers' | 'Staff';

/** Input types the sign-in forms are allowed to render. */
export type PortalFieldType =
  | 'text'
  | 'email'
  | 'tel'
  | 'password'
  | 'select'
  | 'number';

export interface PortalField {
  name: string;
  label: string;
  type: PortalFieldType;
  placeholder?: string;
  /** Options for `select` fields. */
  options?: string[];
  /** Shown under the control as quiet guidance. */
  hint?: string;
  /** Marks the field required for the demo preview. */
  required?: boolean;
  /** Rendered inside the field, on the left. */
  icon?: LucideIcon;
}

export interface PortalRole {
  /** Short label for the form's submit button, e.g. "Sign in as Student". */
  submitLabel: string;
  /** Line under the form heading. */
  description: string;
  fields: PortalField[];
  /** The kind of credential the school would issue. Generic by design. */
  credentialNote: string;
}

export interface Portal {
  id: PortalId;
  /** Name exactly as the school refers to it. */
  name: string;
  /**
   * The portal's own URL, e.g. `/login/student`.
   *
   * Each portal is a separate page rather than a tab on one shared page: the
   * four audiences are different people with different credentials, and a
   * shared page forced them to scroll past three forms that were not theirs.
   * `id` is also the route segment, so the two can never drift apart.
   */
  path: string;
  /** Audience label rendered as a badge. */
  category: PortalAudience;
  /** One-line summary shown under the name. */
  summary: string;
  icon: LucideIcon;
  /**
   * What this portal is for, phrased as intent rather than as a feature list.
   *
   * These describe the *kind* of work each group does — which is common
   * knowledge about schools generally — not any software the school has
   * confirmed it owns. No feature here claims a capability has been
   * implemented or purchased.
   */
  highlights: string[];
  /**
   * The sign-in form for this portal.
   *
   * Each portal has its own field set because the four groups genuinely differ:
   * a student is identified by a roll number, a parent by the contact number
   * the school holds on file, a teacher by staff ID, an administrator by a
   * staff username. Sharing one generic form across all four would misrepresent
   * how any of them would actually work.
   *
   * Field names and formats are placeholders. The school has not supplied its
   * actual ID formats, so they are deliberately obvious examples.
   */
  role: PortalRole;
  /**
   * `false` until the school confirms the portal exists, and until a backend
   * actually authenticates anyone.
   *
   * This is currently `false` for every entry, and the UI says so plainly.
   * There is no authentication on this site: the login form renders a
   * demonstration view and never sends credentials anywhere. A portal card
   * that looked live would be worse than one that admits it is not yet.
   */
  confirmed: boolean;
}

export const portals: Portal[] = [
  {
    id: 'student',
    name: 'Student Portal',
    path: '/login/student',
    category: 'Students',
    summary:
      'A single place for students to see their own academic information and what they need to submit.',
    icon: GraduationCap,
    highlights: [
      'View timetable and class information',
      'Access learning material and assignments',
      'Submit work and review feedback',
      'Track attendance and internal assessment',
    ],
    role: {
      submitLabel: 'Sign in as Student',
      description:
        'Students sign in with the roll number and password issued by the school office.',
      credentialNote:
        'A student is identified by roll number, not by an email address. If you have not been given one, ask your class teacher or the office.',
      fields: [
        {
          name: 'rollNumber',
          label: 'Roll Number',
          type: 'text',
          placeholder: 'e.g. 2024-001',
          icon: Hash,
          required: true,
          hint: 'The number printed on your class register.',
        },
        {
          name: 'level',
          label: 'Studying In',
          type: 'select',
          options: ['School Education', 'College Education'],
          icon: Layers,
          required: true,
        },
        {
          name: 'password',
          label: 'Password',
          type: 'password',
          placeholder: '••••••••',
          icon: KeyRound,
          required: true,
        },
      ],
    },
    confirmed: false,
  },
  {
    id: 'parent',
    name: 'Parents Portal',
    path: '/login/parent',
    category: 'Parents',
    summary:
      'Keeps parents informed about their child’s progress without needing a phone call to the office.',
    icon: Users,
    highlights: [
      'Follow attendance and report cards',
      'Review teacher remarks and feedback',
      'Receive notices and school announcements',
      'Confirm forms and permissions',
    ],
    role: {
      submitLabel: 'Sign in as Parent',
      description:
        'Parents sign in with the mobile number registered with the school, together with a password.',
      credentialNote:
        'The number must match the one already on file for your child. If you have changed it, ask the office to update the record first.',
      fields: [
        {
          name: 'mobile',
          label: 'Registered Mobile Number',
          type: 'tel',
          placeholder: 'e.g. 0322 7595534',
          icon: Phone,
          required: true,
          hint: 'Must match the number held on file by the school.',
        },
        {
          name: 'childRollNumber',
          label: 'Student Roll Number',
          type: 'text',
          placeholder: 'e.g. 2024-001',
          icon: IdCard,
          required: true,
          hint: 'Lets the office match you to the right child record.',
        },
        {
          name: 'password',
          label: 'Password',
          type: 'password',
          placeholder: '••••••••',
          icon: KeyRound,
          required: true,
        },
      ],
    },
    confirmed: false,
  },
  {
    id: 'teacher',
    name: 'Teacher Portal',
    path: '/login/teacher',
    category: 'Teachers',
    summary:
      'Where teaching staff manage classes, records and the day-to-day work of preparing a lesson.',
    icon: UserCog,
    highlights: [
      'Take and manage class registers',
      'Upload material and set assignments',
      'Enter marks and internal assessment',
      'Publish notices to students and parents',
    ],
    role: {
      submitLabel: 'Sign in as Teacher',
      description:
        'Teaching staff sign in with the staff ID and password issued by the administration.',
      credentialNote:
        'Staff accounts are issued by the school office. Access is limited to the classes and subjects assigned to you.',
      fields: [
        {
          name: 'staffId',
          label: 'Staff ID',
          type: 'text',
          placeholder: 'e.g. STF-014',
          icon: IdCard,
          required: true,
        },
        {
          name: 'email',
          label: 'Email Address',
          type: 'email',
          placeholder: 'name@school.example',
          icon: Mail,
          hint: 'Used for notices and password resets. Optional.',
        },
        {
          name: 'password',
          label: 'Password',
          type: 'password',
          placeholder: '••••••••',
          icon: KeyRound,
          required: true,
        },
      ],
    },
    confirmed: false,
  },
  {
    id: 'admin',
    name: 'Admin Portal',
    path: '/login/admin',
    category: 'Staff',
    summary:
      'Reserved for the school office and management, covering admissions through to reporting.',
    icon: ShieldCheck,
    highlights: [
      'Manage admissions and student records',
      'Handle staff and timetable data',
      'Publish notices, results and reports',
      'Oversee fees and generate reports',
    ],
    role: {
      submitLabel: 'Sign in as Administrator',
      description:
        'Reserved for the school office and management. Access is by authorised account only.',
      credentialNote:
        'Administrator accounts are created by the school. There is no self-registration; contact the office if an account is needed.',
      fields: [
        {
          name: 'username',
          label: 'Username',
          type: 'text',
          placeholder: 'e.g. office.admin',
          icon: User,
          required: true,
        },
        {
          name: 'session',
          label: 'Which Session',
          type: 'select',
          options: ['Current session', 'Previous session', 'Archive'],
          icon: CalendarDays,
          required: true,
        },
        {
          name: 'password',
          label: 'Password',
          type: 'password',
          placeholder: '••••••••',
          icon: KeyRound,
          required: true,
        },
      ],
    },
    confirmed: false,
  },
];

/** Portals that need an extra identifier, in addition to a password. */
export const portalAuthNote = 'Ask the school office for a username once the portals are switched on.';

/** Audiences, used to group the cards if the layout ever needs to. */
export const portalCategories: PortalAudience[] = [
  'Students',
  'Parents',
  'Teachers',
  'Staff',
];

/** Every portal id, in display order. Used by RBAC and the demo role switcher. */
export const portalIds: PortalId[] = portals.map((portal) => portal.id);

export function getPortalById(id: string): Portal | undefined {
  return portals.find((portal) => portal.id === id);
}

/** Type guard: is an arbitrary route segment one of the four portal ids? */
export function isPortalId(value: string | null | undefined): value is PortalId {
  return value === 'student' || value === 'parent' || value === 'teacher' || value === 'admin';
}
