export interface Facility {
  id: string;
  title: string;
  description: string;
  /**
   * `false` until the school confirms the facility exists.
   * Unconfirmed entries render with a "to be confirmed" treatment in the UI so
   * no unverified claim is ever published as fact.
   */
  confirmed: boolean;
  image: string | null;
}

export const facilityCategories: Facility[] = [
  {
    id: 'classrooms',
    title: 'Classrooms',
    description:
      'Purpose-designed teaching spaces configured for focused, interactive learning.',
    confirmed: false,
    image: null,
  },
  {
    id: 'learning-spaces',
    title: 'Learning Spaces',
    description:
      'Additional areas for group study, revision and independent work.',
    confirmed: false,
    image: null,
  },
  {
    id: 'laboratories',
    title: 'Laboratories',
    description:
      'Facilities supporting practical, experiment-based science instruction.',
    confirmed: false,
    image: null,
  },
  {
    id: 'library',
    title: 'Library',
    description:
      'A resource space supporting reading, research and quiet study.',
    confirmed: false,
    image: null,
  },
  {
    id: 'sports',
    title: 'Sports',
    description:
      'Provision for physical education, sport and student fitness activities.',
    confirmed: false,
    image: null,
  },
  {
    id: 'activities',
    title: 'Student Activities',
    description:
      'Spaces and opportunities for clubs, societies and co-curricular activities.',
    confirmed: false,
    image: null,
  },
];
