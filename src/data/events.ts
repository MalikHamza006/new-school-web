export type EventCategory = 'Academic' | 'Sports' | 'Cultural' | 'Community' | 'Announcement';

export interface SchoolEvent {
  id: string;
  title: string;
  category: EventCategory;
  /** ISO `YYYY-MM-DD` date, or `null` when the date has not been announced. */
  date: string | null;
  description: string;
  /** Optional longer body for the event detail route. */
  body?: string[];
  /**
   * Image path relative to /public. `null` means the card renders a designed
   * placeholder instead of a photograph, so we never imply an image of an
   * event that has not happened.
   */
  image: string | null;
  /**
   * `placeholder` entries are structural examples only. They are surfaced in
   * the UI behind a dev-only banner so they can never be mistaken for
   * published news. Replace with real events as they are confirmed.
   */
  status: 'published' | 'placeholder';
  featured?: boolean;
}

const placeholderBody = [
  'Official schedules, session timings, and detailed student participation guidelines for this activity are shared directly with enrolled families through the school administration desk. Please contact the school office for current session notices.',
];

/**
 * Events & news activities.
 *
 * Structured categories covering academic orientation, sports, cultural exhibitions,
 * community programs, and administrative announcements.
 */
export const events: SchoolEvent[] = [
  {
    id: 'placeholder-1',
    title: 'Annual Academic Orientation & Session Welcome',
    category: 'Academic',
    date: null,
    description:
      'Orientation briefing and curriculum introduction for incoming and continuing students across school and college levels.',
    body: placeholderBody,
    image: null,
    status: 'placeholder',
    featured: true,
  },
  {
    id: 'placeholder-2',
    title: 'Sports Week & Student Athletics Activities',
    category: 'Sports',
    date: null,
    description:
      'Campus sports competitions encouraging physical fitness, teamwork, sportsmanship, and student participation.',
    body: placeholderBody,
    image: null,
    status: 'placeholder',
  },
  {
    id: 'placeholder-3',
    title: 'Co-Curricular Arts & Creative Expression Day',
    category: 'Cultural',
    date: null,
    description:
      'Student presentations, speech competitions, and artistic showcases celebrating creativity and communication.',
    body: placeholderBody,
    image: null,
    status: 'placeholder',
  },
  {
    id: 'placeholder-4',
    title: 'Campus Environment & Community Initiative',
    category: 'Community',
    date: null,
    description:
      'Student-led campus cleanliness and environmental awareness activities fostering civic responsibility.',
    body: placeholderBody,
    image: null,
    status: 'placeholder',
  },
  {
    id: 'placeholder-5',
    title: 'Academic Assessment & Revision Timetable Notice',
    category: 'Announcement',
    date: null,
    description:
      'Guidance circular regarding scheduled term assessments, preparation guidelines, and parent reporting dates.',
    body: placeholderBody,
    image: null,
    status: 'placeholder',
  },
  {
    id: 'placeholder-6',
    title: 'Science & Mathematics Practical Workshop',
    category: 'Academic',
    date: null,
    description:
      'Hands-on experimental demonstrations and conceptual problem-solving sessions for secondary and college students.',
    body: placeholderBody,
    image: null,
    status: 'placeholder',
  },
];

export const eventCategories: Array<'All' | EventCategory> = [
  'All',
  'Academic',
  'Sports',
  'Cultural',
  'Community',
  'Announcement',
];

/** Sorts published (dated) events first, newest first, then undated placeholders. */
export function sortEvents(list: SchoolEvent[]): SchoolEvent[] {
  return [...list].sort((a, b) => {
    if (a.date && b.date) return b.date.localeCompare(a.date);
    if (a.date) return -1;
    if (b.date) return 1;
    return 0;
  });
}

export function getEventById(id: string): SchoolEvent | undefined {
  return events.find((event) => event.id === id);
}
