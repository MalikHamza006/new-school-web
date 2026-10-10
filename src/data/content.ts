/**
 * Editorial content for the About page and the leadership message.
 *
 * Mission, vision and philosophy copy is written to describe the values stated
 * in the project brief. It intentionally avoids any factual claim that the
 * school has not supplied (results, rankings, history, accreditations).
 *
 * The leadership message is an explicit placeholder. Replace `message` and
 * `signatureName` with the official text once received.
 */

export const mission = {
  title: 'Our Mission',
  body: [
    'To provide quality education in a disciplined, encouraging environment that develops students academically and personally, and equips them with the confidence and character needed for the next stage of their lives.',
  ],
};

export const vision = {
  title: 'Our Vision',
  body: [
    'To be a trusted educational institution in Shahdara, Lahore, known for academic seriousness, student development and a welcoming community that families can rely on year after year.',
  ],
};

export const philosophy = {
  title: 'Educational Philosophy',
  body: [
    'We believe education works best when academic rigour and personal development reinforce each other. Students are taught to think carefully, communicate clearly and take responsibility for their own learning, while being supported by an environment that values effort, respect and discipline.',
    'Our approach is practical rather than theoretical. Learning is connected to real understanding, assessed regularly, and reviewed with families so that progress is visible and next steps are clear.',
  ],
  principles: [
    {
      id: 'rigour',
      title: 'Academic Seriousness',
      description:
        'Clear expectations, regular assessment and honest feedback so students always know where they stand.',
    },
    {
      id: 'character',
      title: 'Character & Discipline',
      description:
        'Respect, responsibility and self-control taught alongside academic work, not separately from it.',
    },
    {
      id: 'support',
      title: 'Individual Support',
      description:
        'Students are known as individuals, with support adjusted to where each of them actually is.',
    },
    {
      id: 'community',
      title: 'Family Partnership',
      description:
        'Parents are treated as partners in a child’s education, with open and regular communication.',
    },
  ],
};

export const studentDevelopment = {
  title: 'Student Development',
  body: [
    'Academic potential is only part of a student’s growth. Attention is given to communication, confidence, teamwork and self-management, so students leave prepared not just for their next examination but for life beyond school.',
  ],
  areas: [
    {
      id: 'confidence',
      title: 'Confidence',
      description: 'Students are encouraged to participate, contribute and speak with assurance.',
    },
    {
      id: 'discipline',
      title: 'Discipline',
      description:
        'A clear, consistently applied routine gives students the structure to focus on learning.',
    },
    {
      id: 'communication',
      title: 'Communication',
      description:
        'Reading, writing and speaking practice that helps students explain their thinking clearly.',
    },
    {
      id: 'critical-thinking',
      title: 'Critical Thinking',
      description:
        'Students learn to question, reason and reach conclusions rather than simply recall.',
    },
  ],
};

export const introduction = {
  title: 'An Institution Focused on Education and Development',
  body: [
    'Spectral Model School & College is a school and college located on Qazi Park Road in Shahdara, Lahore. The institution is built around a straightforward idea: that a good school should develop a student academically and as a person.',
    'Teaching here is designed around subject knowledge and structured learning, paired with the habits that make learning sustainable: attention, effort, discipline and the willingness to ask questions. Students are supported by teachers who know them individually, and by families who are kept informed throughout the year.',
    'The campus serves students at both school and college level, allowing continuity of learning as students progress. Rather than promising outcomes that cannot yet be evidenced, the focus stays on what can be delivered consistently: a serious learning environment, clear expectations and steady academic support.',
  ],
};

export const leadership = {
  title: 'A Message From Our Leadership',
  message: [
    'Welcome to Spectral Model School & College. Our institution was established with a clear educational purpose: to provide purposeful, high-quality instruction in a structured environment where students grow academically, morally, and personally.',
    'We believe that genuine academic success is built on consistent discipline, intellectual curiosity, and dedicated mentorship. In partnership with our families in Shahdara and across Lahore, we work every day to ensure our students develop the knowledge, confidence, and character necessary to excel in higher education and life beyond.',
  ],
  signatureName: null as string | null,
  signatureRole: 'Office of the Principal & Academic Directorate',
  portrait: null as string | null,
};

/** Testimonials are intentionally empty — no reviews have been supplied. */
export const testimonials: Array<{
  id: string;
  name: string;
  role: string;
  quote: string;
}> = [];
