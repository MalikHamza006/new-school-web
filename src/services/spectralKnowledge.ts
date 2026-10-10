/**
 * Spectral Model School & College — Verified Knowledge Engine
 * Provides instant, verified responses matching the website facts
 * with strict anti-hallucination guardrails and bilingual English/Roman Urdu support.
 */

interface KnowledgeEntry {
  patterns: RegExp[];
  en: string;
  ur: string;
}

const KNOWLEDGE_BASE: KnowledgeEntry[] = [
  {
    patterns: [
      /how (can|do) i apply/i,
      /apply for admission/i,
      /application process/i,
      /apply/i,
      /dakhla kaise/i,
    ],
    en: 'You can apply by filling out the online admission inquiry on our Admissions page, or visit our campus office on Qazi Park Road, Shahdara.',
    ur: 'Aap hamare Admissions page par online form bhar kar apply kar saktay hain, ya direct Qazi Park Road, Shahdara campus tashreef la saktay hain.',
  },
  {
    patterns: [
      /explore academics/i,
      /academics/i,
      /program(me)?s/i,
      /curriculum/i,
      /classes offered/i,
      /parhai/i,
    ],
    en: 'Spectral offers quality education across Pre-School, Primary, Middle, Matriculation (Science & Arts), and Intermediate (FSc Pre-Medical, FSc Pre-Engineering, ICS, and FA-IT).',
    ur: 'Spectral School Pre-School se le kar Matric (Science aur Arts) aur Intermediate (FSc Pre-Medical, Pre-Engineering, ICS, aur FA-IT) tak standard taleem faraham karta hai.',
  },
  {
    patterns: [
      /tell me about spectral/i,
      /about spectral/i,
      /about the school/i,
      /what is spectral/i,
      /school ke baray/i,
    ],
    en: 'Spectral Model School & College is a dedicated educational institution in Shahdara, Lahore, focused on academic excellence, character development, and student success.',
    ur: 'Spectral Model School & College Shahdara, Lahore ka aik mayari taleemi idara hai jo talba ki behtareen taleem aur kirdar saazi par tawajjah deta hai.',
  },
  {
    patterns: [/view campus/i, /campus/i, /facilities/i, /building/i, /labs/i, /location/i],
    en: 'Our campus is located at Qazi Park Road, Shahdara, Lahore. For details about the facilities, please contact the school office directly.',
    ur: 'Hamara campus Qazi Park Road, Shahdara, Lahore mein waqay hai. Facilities ki tafseelat ke liye barah-e-karam school office se rabta karein.',
  },
  {
    patterns: [/contact/i, /phone/i, /number/i, /whatsapp/i, /call/i, /rabta/i, /address/i],
    en: 'You can reach Spectral Model School & College at 042-37932284 or send a WhatsApp message to 0322-7595534. Our campus is on Qazi Park Road, Shahdara, Lahore.',
    ur: 'Aap Spectral School se 042-37932284 par call ya 0322-7595534 par WhatsApp ke zariye rabta kar saktay hain.',
  },
  {
    patterns: [/lms/i, /portal/i, /login/i, /features/i, /system/i],
    en: 'The website previews sign-in pages for Students, Parents, Teachers and Admins, but these portals are not live yet. Please contact the school office for class records, attendance or results.',
    ur: 'Website par Students, Parents, Teachers aur Admins ke sign-in pages sirf preview hain aur abhi live nahi hain. Classes, hazri ya nataij ke liye barah-e-karam school office se rabta karein.',
  },
  {
    patterns: [/online class/i, /video lecture/i, /lecture/i, /timings/i],
    en: 'Online or recorded classes are not managed through this website at the moment. Please contact the school office to ask how classes are currently organised.',
    ur: 'Online ya recorded classes filhal is website ke zariye manage nahi hotin. Classes ka mojooda nizam jan-nay ke liye barah-e-karam school office se rabta karein.',
  },
  {
    patterns: [/material/i, /notes/i, /book/i, /syllabus/i, /study/i],
    en: 'Study notes and curriculum guides are not published on the website yet. Please ask the school office for the current syllabus and study material.',
    ur: 'Notes aur syllabus guides filhal website par publish nahi hain. Mojooda syllabus aur study material ke liye barah-e-karam school office se poochein.',
  },
  {
    patterns: [/attendance/i, /hazri/i, /present/i, /absent/i],
    en: 'Attendance is kept by the school. It is not shown on the website at the moment, so please contact the school office for a student’s attendance record.',
    ur: 'Hazri ka record school rakhta hai. Filhal yeh website par nazar nahi aata, lihaza kisi student ki hazri ke liye barah-e-karam school office se rabta karein.',
  },
  {
    patterns: [/assignment/i, /homework/i, /task/i, /submit/i],
    en: 'Assignments are given in class. Online submission through the website is not available yet, so please check with the school office or the class teacher.',
    ur: 'Assignments class mein di jati hain. Website ke zariye online submission abhi dastiyab nahi, lihaza barah-e-karam school office ya class teacher se rabta karein.',
  },
  {
    patterns: [/result/i, /report card/i, /marks/i, /grade/i, /exam/i, /number/i],
    en: 'Examination results and progress reports are shared by the school. They are not published on the website yet, so please contact the school office for results.',
    ur: 'Imtehanat ke nataij aur report cards school share karta hai. Yeh filhal website par publish nahi hotay, lihaza nataij ke liye barah-e-karam school office se rabta karein.',
  },
  {
    patterns: [/fee/i, /fees/i, /dues/i, /voucher/i, /payment/i, /challan/i],
    en: 'The website does not process fees or show vouchers. For the official fee structure and payments, please contact the school accounts office directly.',
    ur: 'Website fees process ya vouchers show nahi karti. Mukammal fee structure aur payment ke liye barah-e-karam school accounts office se rabta karein.',
  },
];

function isRomanUrdu(query: string): boolean {
  const urduMarkers = [
    /\b(kya|kaise|hai|hain|ki|ka|ke|ko|mein|se|aur|bhi|par|kahan|karo|batao|chahiye|dakhla|hazri|rabta)\b/i,
    /\b(aap|hum|meri|mera|mere|unka|unke|kab|kitni|kitna|hoga|hogi|shukriya|theek)\b/i,
  ];
  return urduMarkers.some((marker) => marker.test(query));
}

/**
 * Returns verified, anti-hallucination responses based on website ground truth.
 */
export function getFallbackAssistantResponse(query: string): string {
  const cleanQuery = query.trim().toLowerCase();
  const romanUrdu = isRomanUrdu(cleanQuery);

  for (const item of KNOWLEDGE_BASE) {
    if (item.patterns.some((pattern) => pattern.test(cleanQuery))) {
      return romanUrdu ? item.ur : item.en;
    }
  }

  // Strict anti-hallucination fallback
  if (romanUrdu) {
    return 'Mere paas yeh maloomat dastiyab nahi hain. Barah-e-karam taza tareen tafseelat ke liye direct Spectral School (042-37932284 ya WhatsApp 0322-7595534) se rabta karein.';
  }

  return "I don't have that information yet. Please contact Spectral Model School & College directly at 042-37932284 or WhatsApp 0322-7595534 for the latest details.";
}
