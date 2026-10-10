import {
  Award,
  BookOpen,
  Compass,
  GraduationCap,
  Heart,
  Medal,
  Star,
  Target,
  TrendingUp,
  Trophy,
  Users,
  Zap,
  type LucideIcon,
} from 'lucide-react';

export interface Program {
  id: string;
  title: string;
  description: string;
  /** Short label rendered as a badge. */
  level: string;
  icon: LucideIcon;
  /**
   * Detailed programme copy. Structured overview of educational pathways
   * across school, college and academic development levels.
   */
  details: string[];
  /** Anchor id used for deep links such as /academics#school. */
  anchor: string;
}

/**
 * Academic programmes.
 *
 * NOTE: No grades, subjects, boards or exam boards are listed because none were
 * supplied by the school. Add them under `details` once confirmed.
 */
export const programs: Program[] = [
  {
    id: 'school',
    anchor: 'school',
    title: 'School Education',
    level: 'School',
    description:
      'Educational programs for school-level students, building strong foundations in core subjects, literacy and numeracy.',
    icon: GraduationCap,
    details: [
      'Structured academic instruction across primary and secondary levels.',
      'Emphasis on reading, writing, mathematics and general knowledge.',
      'Regular assessment and parent feedback on student progress.',
    ],
  },
  {
    id: 'college',
    anchor: 'college',
    title: 'College Education',
    level: 'College',
    description:
      'Programs supporting students through their college-level studies, with a focus on depth of understanding and independent learning.',
    icon: BookOpen,
    details: [
      'College-level instruction preparing students for degree-level study.',
      'Subject-focused learning with guided practice and revision.',
      'Preparation for board and competitive examinations.',
    ],
  },
  {
    id: 'academic-development',
    anchor: 'academic-development',
    title: 'Academic Development',
    level: 'Development',
    description:
      'Learning experiences focused on knowledge, skills and student growth beyond the core timetable.',
    icon: Compass,
    details: [
      'Skill-building workshops in communication and critical thinking.',
      'Study habits, time management and examination technique.',
      'Mentorship and academic counselling support.',
    ],
  },
];

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

/** "Why Choose Spectral" feature grid. */
export const whySpectral: Feature[] = [
  {
    id: 'quality-education',
    title: 'Quality Education',
    description:
      "A focused educational environment designed to support students' academic growth.",
    icon: Award,
  },
  {
    id: 'student-development',
    title: 'Student Development',
    description:
      'Encouraging confidence, discipline, communication and personal growth.',
    icon: Users,
  },
  {
    id: 'supportive-environment',
    title: 'Supportive Environment',
    description:
      'A learning environment where students can develop academically and personally.',
    icon: Heart,
  },
  {
    id: 'future-focus',
    title: 'Future Focus',
    description:
      'Helping students build knowledge and skills for their next stage of education.',
    icon: TrendingUp,
  },
];

/** The three "Education That Goes Beyond the Classroom" pillars. */
export const pillars: Feature[] = [
  {
    id: 'academic-excellence',
    title: 'Academic Excellence',
    description:
      'A structured learning approach that supports steady progress and academic confidence.',
    icon: Target,
  },
  {
    id: 'character-confidence',
    title: 'Character & Confidence',
    description:
      'Encouraging discipline, respect and self-belief alongside classroom learning.',
    icon: Users,
  },
  {
    id: 'future-ready',
    title: 'Future-Ready Learning',
    description:
      'Building the knowledge and habits students need for their next stage of education.',
    icon: TrendingUp,
  },
];

export interface AdmissionStep {
  step: string;
  title: string;
  description: string;
}

/**
 * Generic four-step process. No deadlines, fees or age limits are stated
 * because none were supplied.
 */
export const admissionProcess: AdmissionStep[] = [
  {
    step: '01',
    title: 'Submit Inquiry',
    description:
      'Contact the admissions office by phone, WhatsApp or the inquiry form to begin.',
  },
  {
    step: '02',
    title: 'Application',
    description:
      'Complete the application with the student’s details and requested documents.',
  },
  {
    step: '03',
    title: 'Admission Review',
    description:
      'The admissions team reviews the submission and may arrange a meeting or assessment.',
  },
  {
    step: '04',
    title: 'Enrollment',
    description:
      'Selected students receive enrolment details, fee information and orientation guidance.',
  },
];

/** Achievement categories. No counts, positions or results are claimed. */
export const achievementCategories: Feature[] = [
  {
    id: 'academic-achievement',
    title: 'Academic Achievement',
    description:
      'Recognising students who show consistent effort and progress in their studies.',
    icon: Trophy,
  },
  {
    id: 'student-success',
    title: 'Student Success',
    description:
      'Highlighting individual milestones, progress and personal breakthroughs.',
    icon: Star,
  },
  {
    id: 'annual-awards',
    title: 'Annual Awards',
    description:
      'Annual recognition programmes that celebrate participation and improvement.',
    icon: Medal,
  },
  {
    id: 'co-curricular',
    title: 'Co-Curricular Activities',
    description:
      'Achievements in sports, arts, debate and student-led activities.',
    icon: Zap,
  },
];

