import type { AssistantState } from '../../config/spectralAI';
import { Mic, MicOff, Square, Loader2 } from 'lucide-react';

interface VoiceButtonProps {
  state: AssistantState;
  onToggle: () => void;
  onStopSpeaking: () => void;
  disabled?: boolean;
}

export function VoiceButton({
  state,
  onToggle,
  onStopSpeaking,
  disabled = false,
}: VoiceButtonProps) {
  const isListening = state === 'listening';
  const isSpeaking = state === 'speaking';
  const isProcessing = state === 'processing';

  if (isSpeaking) {
    return (
      <div className="flex flex-col items-center gap-1.5">
        <button
          type="button"
          onClick={onStopSpeaking}
          className="group relative inline-flex items-center gap-2 rounded-full bg-gold px-4 py-2 text-xs font-semibold text-navy shadow-sm transition hover:bg-gold-light active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy"
          aria-label="Stop speaking"
        >
          <Square className="h-3.5 w-3.5 fill-current" />
          <span>Stop Speaking</span>
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <div className="relative flex items-center justify-center">
        {/* Subtle pulsing ring when listening */}
        {isListening && (
          <div
            className="absolute -inset-2.5 rounded-full border-2 border-blue-500/40 animate-ping pointer-events-none"
            aria-hidden="true"
          />
        )}

        <button
          type="button"
          onClick={onToggle}
          disabled={disabled || isProcessing}
          className={`relative flex h-14 w-14 items-center justify-center rounded-full transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy ${
            isListening
              ? 'bg-blue-600 text-white shadow-md ring-4 ring-blue-100 scale-105'
              : isProcessing
              ? 'bg-navy-100 text-navy-400 cursor-not-allowed'
              : 'bg-navy text-white hover:bg-navy-800 shadow-sm active:scale-95'
          }`}
          aria-label={
            isListening
              ? 'Stop voice input'
              : isProcessing
              ? 'Spectral AI is thinking'
              : 'Start voice input'
          }
          title={isListening ? 'Stop listening' : 'Start speaking'}
        >
          {isProcessing ? (
            <Loader2 className="h-6 w-6 animate-spin text-gold" />
          ) : isListening ? (
            <MicOff className="h-6 w-6 text-white" />
          ) : (
            <Mic className="h-6 w-6 text-gold transition-transform group-hover:scale-110" />
          )}
        </button>
      </div>

      <span className="text-[11px] font-medium text-ink-muted">
        {isListening
          ? 'Tap to stop'
          : isProcessing
          ? 'Thinking...'
          : 'Tap mic to speak'}
      </span>
    </div>
  );
}
