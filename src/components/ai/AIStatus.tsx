import type { AssistantState } from '../../config/spectralAI';
import { Mic, Volume2, Sparkles, AlertCircle } from 'lucide-react';

interface AIStatusProps {
  state: AssistantState;
  customError?: string | null;
}

export function AIStatus({ state, customError }: AIStatusProps) {
  switch (state) {
    case 'listening':
      return (
        <div className="flex items-center justify-center gap-2 text-xs font-medium text-blue-700 animate-pulse">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-600" />
          </span>
          <Mic className="h-3.5 w-3.5" />
          <span>Listening to your voice...</span>
        </div>
      );

    case 'processing':
      return (
        <div className="flex items-center justify-center gap-2 text-xs font-medium text-navy-500">
          <Sparkles className="h-3.5 w-3.5 animate-spin text-gold" />
          <span>Spectral AI is thinking...</span>
        </div>
      );

    case 'speaking':
      return (
        <div className="flex items-center justify-center gap-2 text-xs font-medium text-gold-dark">
          <Volume2 className="h-3.5 w-3.5 animate-bounce" />
          <div className="flex items-center gap-0.5">
            <span className="h-2 w-0.5 animate-[pulse_0.8s_ease-in-out_infinite] bg-gold" />
            <span className="h-3.5 w-0.5 animate-[pulse_0.6s_ease-in-out_infinite_0.2s] bg-gold" />
            <span className="h-2 w-0.5 animate-[pulse_0.7s_ease-in-out_infinite_0.4s] bg-gold" />
          </div>
          <span>Spectral AI is speaking...</span>
        </div>
      );

    case 'error':
      return (
        <div className="flex items-center justify-center gap-1.5 text-xs font-medium text-red-600">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate max-w-[260px]">{customError || 'Something went wrong. Try again.'}</span>
        </div>
      );

    case 'idle':
    default:
      return (
        <div className="flex items-center justify-center gap-1.5 text-xs text-ink-muted">
          <span>Tap the mic to speak, or type below</span>
        </div>
      );
  }
}
