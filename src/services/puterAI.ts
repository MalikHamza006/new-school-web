import { SPECTRAL_AI_CONFIG, type Message } from '../config/spectralAI';
import { getFallbackAssistantResponse } from './spectralKnowledge';

interface WindowWithPuter extends Window {
  puter?: {
    ai?: {
      chat: (
        promptOrMessages: string | Array<{ role: string; content: string }>,
        options?: { model?: string }
      ) => Promise<unknown>;
    };
    auth?: {
      isSignedIn?: () => Promise<boolean> | boolean;
    };
  };
}

/**
 * Ensures Puter.js is loaded and ready.
 */
export async function ensurePuterLoaded(timeoutMs = 3000): Promise<boolean> {
  const win = typeof window !== 'undefined' ? (window as unknown as WindowWithPuter) : null;
  if (!win) return false;

  if (win.puter?.ai?.chat) {
    return true;
  }

  const startTime = Date.now();

  return new Promise((resolve) => {
    const checkInterval = setInterval(() => {
      if (win.puter?.ai?.chat) {
        clearInterval(checkInterval);
        resolve(true);
        return;
      }

      if (Date.now() - startTime > timeoutMs) {
        clearInterval(checkInterval);
        resolve(false);
      }
    }, 100);
  });
}

/**
 * Sends conversation messages to Puter AI and extracts the reply text.
 * If Puter AI takes more than 4 seconds or is unavailable/unauthenticated,
 * it falls back cleanly to the institutional knowledge base so the UI is NEVER stuck.
 */
export async function queryPuterAI(
  messages: Message[],
  model = SPECTRAL_AI_CONFIG.defaultModel
): Promise<string> {
  const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user')?.content || '';
  const isLoaded = await ensurePuterLoaded(2000);
  const win = typeof window !== 'undefined' ? (window as unknown as WindowWithPuter) : null;

  if (isLoaded && win?.puter?.ai?.chat) {
    const apiMessages = [
      { role: 'system', content: SPECTRAL_AI_CONFIG.systemPrompt },
      ...messages
        .filter((m) => m.role === 'user' || m.role === 'assistant')
        .map((m) => ({ role: m.role, content: m.content })),
    ];

    try {
      // Set a strict 4.5s timeout on Puter AI network request to prevent UI hanging
      const puterPromise = win.puter.ai.chat(apiMessages, { model });
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Puter AI timeout')), 4500)
      );

      const response = await Promise.race([puterPromise, timeoutPromise]);
      const extracted = extractTextFromResponse(response);
      if (extracted) return extracted;
    } catch (err) {
      console.warn('Puter AI request timed out or unauthenticated, falling back to LMS knowledge engine:', err);
    }
  }

  // Graceful fallback to verified LMS knowledge base
  return getFallbackAssistantResponse(lastUserMsg);
}

function extractTextFromResponse(response: unknown): string {
  if (typeof response === 'string') {
    return response.trim();
  }

  if (response && typeof response === 'object') {
    const record = response as Record<string, unknown>;

    if (record.message && typeof record.message === 'object') {
      const msg = record.message as Record<string, unknown>;
      if (typeof msg.content === 'string') return msg.content.trim();
    }

    if (typeof record.text === 'string') return record.text.trim();
    if (typeof record.content === 'string') return record.content.trim();

    const stringified = String(response);
    if (stringified && stringified !== '[object Object]') {
      return stringified.trim();
    }
  }

  return '';
}
