import type { PortalId } from './portals';

/**
 * Role-based access control for the demo portals.
 *
 * Permissions are written as `<resource>:<action>` so a single resource can be
 * shared by more than one role while the action still differs — a student and a
 * parent can both `attendance:view`, but only a teacher can
 * `attendance:manage`. A role-prefixed scheme (`student:attendance`) would not
 * express that, and would make the two roles look like they were looking at
 * different data when they are not.
 *
 * This is a DEMO access model, enforced entirely in the browser. It exists to
 * show how the four portals are kept apart; it is not a security boundary. Real
 * authorisation has to be enforced on the server, where the browser cannot
 * rewrite the role. See `data/portals.ts` — every portal is still `confirmed:
 * false`, and nothing here touches a backend.
 */
export type Permission =
  | 'overview:view'
  | 'timetable:view'
  | 'assignment:view'
  | 'assignment:submit'
  | 'assignment:manage'
  | 'attendance:view'
  | 'attendance:manage'
  | 'result:view'
  | 'progress:view'
  | 'fee:view'
  | 'fee:manage'
  | 'class:view'
  | 'grade:manage'
  | 'notice:view'
  | 'admission:manage'
  | 'student:manage'
  | 'staff:manage'
  | 'report:view';

/**
 * The permissions granted to each role.
 *
 * This is the authoritative grant list. Every dashboard section in
 * `data/portalDashboards` names one permission, and a section only appears in a
 * role's navigation — and only renders — when the role holds that permission.
 */
export const rolePermissions: Record<PortalId, readonly Permission[]> = {
  student: [
    'overview:view',
    'timetable:view',
    'assignment:view',
    'assignment:submit',
    'attendance:view',
    'result:view',
  ],
  parent: ['overview:view', 'progress:view', 'attendance:view', 'fee:view', 'notice:view'],
  teacher: [
    'overview:view',
    'class:view',
    'attendance:manage',
    'assignment:view',
    'assignment:manage',
    'grade:manage',
  ],
  admin: [
    'overview:view',
    'admission:manage',
    'student:manage',
    'staff:manage',
    'fee:manage',
    'report:view',
  ],
};

/** Human-readable labels, used by the demo "you do not have access" panel. */
export const permissionLabels: Record<Permission, string> = {
  'overview:view': 'View dashboard overview',
  'timetable:view': 'View timetable',
  'assignment:view': 'View assignments',
  'assignment:submit': 'Submit assignments',
  'assignment:manage': 'Set and manage assignments',
  'attendance:view': 'View attendance',
  'attendance:manage': 'Take and manage attendance',
  'result:view': 'View results',
  'progress:view': 'View progress reports',
  'fee:view': 'View fees',
  'fee:manage': 'Manage fees',
  'class:view': 'View assigned classes',
  'grade:manage': 'Enter and manage grades',
  'notice:view': 'View notices',
  'admission:manage': 'Manage admissions',
  'student:manage': 'Manage student records',
  'staff:manage': 'Manage staff records',
  'report:view': 'View reports',
};

/** Does this role hold a permission? Fails closed for an unknown/absent role. */
export function hasPermission(
  role: PortalId | null | undefined,
  permission: Permission
): boolean {
  if (!role) return false;
  return rolePermissions[role].includes(permission);
}
