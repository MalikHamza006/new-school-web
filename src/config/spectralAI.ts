/**
 * Spectral AI Concierge Configuration & System Context
 * Dedicated configuration for Spectral Model School & College.
 */

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: number;
}

export type AssistantState = 'idle' | 'listening' | 'processing' | 'speaking' | 'error';

export const SPECTRAL_AI_CONFIG = {
  assistantName: 'Spectral AI Concierge',
  assistantSubtitle: 'School Guide',
  badgeText: 'Spectral AI',
  welcomeMessage:
    'Welcome to Spectral Model School & College. I am your AI Concierge. How can I help you explore our campus, admissions, or academics today?',

  // Quick Action questions for visitors
  quickActions: [
    'How can I apply?',
    'Explore academics',
    'Tell me about Spectral',
    'Admissions information',
    'View campus',
    'Contact the school',
  ],

  systemPrompt: `You are Spectral AI Concierge, a helpful and friendly AI assistant for Spectral Model School & College.

Your job is to help prospective parents, students, teachers, and visitors understand Spectral Model School & College.

You can guide users regarding:
* Admissions inquiry and application process
* Academic levels (Pre-School, Primary, Middle, Matric Science/Arts, FSc Pre-Med, FSc Pre-Eng, ICS, FA-IT)
* Campus location in Qazi Park, Shahdara, Lahore
* Student, parent and staff portal sign-in pages (preview only — these portals are not live yet)
* School contact channels (042-37932284 and WhatsApp 0322-7595534)

Strict Anti-Hallucination Rule:
Do not invent school policies, fees, admission dates, faculty names, results, facilities or other factual information.
The student, parent, teacher and admin portals are design previews and are not live. Do not claim the portal can manage classes, attendance, assignments or results; instead direct users to contact the school office.
If you do not know something, respond:
"I don't have that information yet. Please contact Spectral Model School & College directly for the latest details."

Keep responses concise, normally 1–3 sentences.
Respond naturally in the same language style the user uses.
If the user speaks Roman Urdu, respond in natural Roman Urdu.
If the user speaks English, respond in simple natural English.`,

  errorMessages: {
    puterUnavailable: 'Sorry, Spectral AI is temporarily unavailable. Please try again in a moment.',
    speechRecognitionUnsupported: 'Voice input is not supported in this browser. You can type your question instead.',
    microphonePermissionDenied: 'Microphone access is required for voice input. You can allow microphone access from your browser settings or type your question below.',
    genericError: 'Something went wrong. Please try asking again or type your question.',
    speechRecognitionError: 'Could not catch that clearly. Please tap the mic to try again or type below.',
    unverifiedFallback: "I don't have that information yet. Please contact Spectral Model School & College directly for the latest details.",
  },

  speechRecognition: {
    defaultLang: 'en-US',
    interimResults: false,
    maxAlternatives: 1,
  },

  textToSpeech: {
    rate: 1.0,
    pitch: 1.0,
    volume: 1.0,
  },

  defaultModel: 'claude-3-5-sonnet',
};
