export interface Faq {
  id: string;
  question: string;
  answer: string;
  /**
   * `true` when the answer is a genuine, publishable answer.
   * `false` when it is a holding answer that must be replaced with the
   * school's official policy before launch.
   */
  confirmed: boolean;
}

export const academicFaqs: Faq[] = [
  {
    id: 'acad-curriculum',
    question: 'Which curriculum and board do you follow?',
    answer:
      'This has not been confirmed yet. Please contact the school office for the current curriculum and board information.',
    confirmed: false,
  },
  {
    id: 'acad-class-size',
    question: 'What is the student-to-teacher ratio?',
    answer:
      'Class size details have not been published. Please contact the school office for current class composition.',
    confirmed: false,
  },
  {
    id: 'acad-support',
    question: 'Do you provide extra academic support?',
    answer:
      'Additional academic support is available to students who need it. Contact the school office to discuss your child’s requirements.',
    confirmed: false,
  },
  {
    id: 'acad-assessment',
    question: 'How is student progress assessed?',
    answer:
      'Progress is reviewed through regular class assessment and parent feedback. Full assessment details are shared during admission counselling.',
    confirmed: false,
  },
];

export const admissionFaqs: Faq[] = [
  {
    id: 'adm-apply',
    question: 'How do I apply for admission?',
    answer:
      'You can start an admission inquiry by calling the school, messaging on WhatsApp, or filling in the inquiry form on this website. The admissions team will guide you through the remaining steps.',
    confirmed: true,
  },
  {
    id: 'adm-fees',
    question: 'What are the admission and tuition fees?',
    answer:
      'Fee information has not been published online. Please contact the school office for the current fee structure.',
    confirmed: false,
  },
  {
    id: 'adm-dates',
    question: 'When does admission open and close?',
    answer:
      'Admission dates have not been announced on this website. Please contact the school office for current availability.',
    confirmed: false,
  },
  {
    id: 'adm-documents',
    question: 'Which documents are required?',
    answer:
      'Required documents are shared with families during the application stage. Please contact the admissions office for the current list.',
    confirmed: false,
  },
  {
    id: 'adm-age',
    question: 'Is there an age requirement?',
    answer:
      'Age requirements vary by level and have not been published here. The admissions team will confirm eligibility when you enquire.',
    confirmed: false,
  },
  {
    id: 'adm-visit',
    question: 'Can I visit the campus before applying?',
    answer:
      'Yes, you are welcome to contact the school office to arrange a campus visit.',
    confirmed: true,
  },
];

export const contactFaqs: Faq[] = [
  {
    id: 'con-hours',
    question: 'What are your office hours?',
    answer:
      'Office hours have not been published on this website. Please call ahead so we can confirm you are expected.',
    confirmed: false,
  },
  {
    id: 'con-whatsapp',
    question: 'Can I reach you on WhatsApp?',
    answer:
      'Yes. WhatsApp messages are received on the school mobile number listed on this page during working hours.',
    confirmed: true,
  },
  {
    id: 'con-directions',
    question: 'How do I find the school?',
    answer:
      'The school is located on Qazi Park Road in Qazi Park, Shahdara, Lahore, Punjab 54950. Use the map on the contact page for directions.',
    confirmed: true,
  },
];
