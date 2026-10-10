import { useState, useRef, useEffect, useId } from 'react';
import type { FormEvent } from 'react';
import { AIMessage } from './AIMessage';
import { VoiceButton } from './VoiceButton';
import { AIStatus } from './AIStatus';
import { SPECTRAL_AI_CONFIG, type AssistantState, type Message } from '../../config/spectralAI';
import { X, SendHorizontal, RotateCcw, Bot, Sparkles } from 'lucide-react';

interface AIChatPanelProps {
  isOpen: boolean;
  onClose: () => void;
  state: AssistantState;
  messages: Message[];
  errorMessage: string | null;
  onSendMessage: (text: string, speakResponse?: boolean) => void;
  onToggleVoice: () => void;
  onStopSpeaking: () => void;
  onResetChat: () => void;
}

export function AIChatPanel({
  isOpen,
  onClose,
  state,
  messages,
  errorMessage,
  onSendMessage,
  onToggleVoice,
  onStopSpeaking,
  onResetChat,
}: AIChatPanelProps) {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const titleId = useId();

  // Scroll to bottom when messages update or state changes
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, state, isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = inputText.trim();
    if (!trimmed || state === 'processing') return;

    onSendMessage(trimmed, true);
    setInputText('');
  };

  if (!isOpen) return null;

  return (
    <aside
      aria-labelledby={titleId}
      aria-modal="true"
      role="dialog"
      className="fixed inset-x-2 bottom-2 top-auto z-50 flex flex-col overflow-hidden rounded-2xl border border-navy/15 bg-white shadow-float sm:bottom-20 sm:right-6 sm:left-auto sm:w-[410px] sm:max-w-[calc(100vw-2rem)] sm:h-[580px] h-[86vh] transition-all animate-scale-in"
    >
      {/* Header */}
      <header className="flex items-center justify-between border-b border-navy-800/40 bg-navy px-4 py-3 text-white">
        <div className="flex items-center gap-3">
          <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-navy-800 ring-1 ring-gold/40 shadow-xs">
            <Bot className="h-5 w-5 text-gold" />
            <span
              className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-navy bg-emerald-500"
              aria-label="Online"
              title="Online"
            />
          </div>
          <div>
            <h2 id={titleId} className="text-sm font-semibold tracking-tight text-white flex items-center gap-1.5">
              <span>{SPECTRAL_AI_CONFIG.assistantName}</span>
              <Sparkles className="h-3.5 w-3.5 text-gold" />
            </h2>
            <p className="text-[11px] text-navy-200">
              {SPECTRAL_AI_CONFIG.assistantSubtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onResetChat}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-navy-200 transition hover:bg-navy-800 hover:text-white focus-visible:outline-2 focus-visible:outline-gold"
            title="Reset conversation"
            aria-label="Reset conversation"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-navy-200 transition hover:bg-navy-800 hover:text-white focus-visible:outline-2 focus-visible:outline-gold"
            title="Close assistant"
            aria-label="Close assistant"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* Messages Scroll Area */}
      <div
        className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-canvas/40"
        tabIndex={0}
        role="log"
        aria-live="polite"
      >
        {messages.map((message) => (
          <AIMessage key={message.id} message={message} />
        ))}

        {/* Typing / Thinking Skeleton */}
        {state === 'processing' && (
          <div className="flex items-start gap-2.5 text-xs text-ink-muted">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-navy text-gold ring-1 ring-gold/40 shadow-xs">
              <Bot className="h-4 w-4 text-gold" />
            </div>
            <div className="flex items-center gap-1.5 rounded-2xl rounded-tl-xs bg-canvas border border-navy/10 px-3.5 py-2.5 shadow-xs">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-navy-400" />
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-navy-400 [animation-delay:200ms]" />
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-navy-400 [animation-delay:400ms]" />
              <span className="ml-1 text-xs text-ink-muted font-medium">Spectral AI is thinking…</span>
            </div>
          </div>
        )}

        {/* Quick Action Chips when conversation is fresh */}
        {messages.length <= 1 && (
          <div className="pt-2">
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-ink-muted">
              Quick Suggestions
            </p>
            <div className="flex flex-wrap gap-1.5">
              {SPECTRAL_AI_CONFIG.quickActions.map((action) => (
                <button
                  key={action}
                  type="button"
                  onClick={() => onSendMessage(action, true)}
                  disabled={state === 'processing'}
                  className="rounded-full border border-navy/15 bg-white px-3 py-1.5 text-xs font-medium text-navy shadow-2xs transition hover:border-gold hover:bg-gold/10 hover:text-navy active:scale-95 disabled:opacity-50 text-left"
                >
                  {action}
                </button>
              ))}
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Voice Control & Status Area */}
      <div className="border-t border-navy/8 bg-white px-4 pt-3 pb-2 flex flex-col items-center gap-2">
        <AIStatus state={state} customError={errorMessage} />
        <VoiceButton
          state={state}
          onToggle={onToggleVoice}
          onStopSpeaking={onStopSpeaking}
        />
      </div>

      {/* Text Input Fallback Bar with Quick Action Chips */}
      <div className="border-t border-navy/10 bg-white p-3">
        {/* Quick Action Bar if active conversation */}
        {messages.length > 1 && (
          <div className="mb-2 flex items-center gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
            {SPECTRAL_AI_CONFIG.quickActions.slice(0, 4).map((action) => (
              <button
                key={action}
                type="button"
                onClick={() => onSendMessage(action, true)}
                disabled={state === 'processing'}
                className="shrink-0 rounded-full border border-navy/10 bg-canvas px-2.5 py-1 text-[11px] font-medium text-navy hover:border-gold hover:bg-gold/10 active:scale-95 disabled:opacity-50"
              >
                {action}
              </button>
            ))}
          </div>
        )}

        <form onSubmit={handleSubmit} className="relative flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your question..."
            disabled={state === 'processing'}
            className="w-full rounded-xl border border-navy/15 bg-canvas px-3.5 py-2 text-sm text-ink placeholder:text-ink-muted focus:border-navy focus:bg-white focus:outline-none focus:ring-2 focus:ring-navy/15 disabled:opacity-60"
            aria-label="Type your message for Spectral AI Concierge"
          />
          <button
            type="submit"
            disabled={!inputText.trim() || state === 'processing'}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-navy text-gold transition hover:bg-navy-800 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy"
            aria-label="Send message"
            title="Send message"
          >
            <SendHorizontal className="h-4 w-4" />
          </button>
        </form>
        <p className="mt-1.5 text-center text-[10px] text-ink-muted">
          Spectral AI Concierge guides you through admissions and academics.
        </p>
      </div>
    </aside>
  );
}
