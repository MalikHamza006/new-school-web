import { useState, useEffect } from 'react';
import { useVoiceAssistant } from '../../hooks/useVoiceAssistant';
import { AIChatPanel } from './AIChatPanel';
import { SPECTRAL_AI_CONFIG } from '../../config/spectralAI';
import { Bot, Sparkles, Mic } from 'lucide-react';

export function SpectralAIAssistant() {
  const [isOpen, setIsOpen] = useState(false);

  const {
    state,
    messages,
    errorMessage,
    sendMessage,
    toggleListening,
    stopSpeaking,
    resetChat,
  } = useVoiceAssistant();

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const handleToggleOpen = () => {
    setIsOpen((prev) => !prev);
  };

  const handleClose = () => {
    setIsOpen(false);
    if (state === 'speaking') {
      stopSpeaking();
    }
  };

  return (
    <div className="print:hidden">
      {/* Floating Entry Trigger Button */}
      {!isOpen && (
        <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-40">
          <button
            type="button"
            onClick={handleToggleOpen}
            className="group relative flex items-center gap-2 rounded-full bg-navy p-2 sm:px-4 sm:py-2.5 text-white shadow-float border border-gold/30 hover:border-gold hover:bg-navy-800 transition-all duration-300 hover:scale-105 active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
            aria-label="Open Spectral AI Concierge"
            title="Open Spectral AI Concierge"
          >
            {/* Glowing gold background pulse */}
            <span
              className="absolute -inset-0.5 rounded-full bg-gold/20 opacity-0 group-hover:opacity-100 transition-opacity blur-sm pointer-events-none"
              aria-hidden="true"
            />

            {/* Icon with pulsing green online dot */}
            <div className="relative flex h-7 w-7 items-center justify-center rounded-full bg-navy-800 text-gold ring-1 ring-gold/40">
              <Bot className="h-4 w-4 text-gold group-hover:scale-110 transition-transform" />
              <span
                className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full border border-navy bg-emerald-500"
                aria-hidden="true"
              />
            </div>

            {/* Desktop Label & Micro Indicator */}
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-semibold tracking-wide text-white flex items-center gap-1">
                <span>{SPECTRAL_AI_CONFIG.badgeText}</span>
                <Sparkles className="h-3 w-3 text-gold opacity-80" />
              </span>
              <span className="text-[10px] text-navy-200 font-medium">
                AI Concierge &amp; Guide
              </span>
            </div>

            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gold/15 text-gold group-hover:bg-gold group-hover:text-navy transition-colors sm:ml-1">
              <Mic className="h-3 w-3" />
            </div>
          </button>
        </div>
      )}

      {/* Floating / Bottom Sheet Chat Panel */}
      <AIChatPanel
        isOpen={isOpen}
        onClose={handleClose}
        state={state}
        messages={messages}
        errorMessage={errorMessage}
        onSendMessage={sendMessage}
        onToggleVoice={toggleListening}
        onStopSpeaking={stopSpeaking}
        onResetChat={resetChat}
      />
    </div>
  );
}
