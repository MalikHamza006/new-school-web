import { useState, useEffect, useRef, useCallback } from 'react';
import { Volume2, VolumeX, Play, Pause, Square } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const WELCOME_SCRIPT =
  'Welcome to Spectral Model School & College. We are committed to providing quality education and supporting students in their academic and personal development. Explore our academics, admissions, campus and achievements, or contact us to learn more.';

const MUTE_STORAGE_KEY = 'spectral.welcome.muted';

export function WelcomeAudioExperience() {
  const location = useLocation();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(MUTE_STORAGE_KEY) === '1';
  });
  const [isSupported, setIsSupported] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Check SpeechSynthesis support
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsSupported(true);
    }
  }, []);

  // Stop speech when navigating away from the page
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [location.pathname]);

  const handleStop = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    setIsPlaying(false);
    setIsPaused(false);
  }, []);

  const handlePlay = useCallback(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();

    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }

    try {
      const utterance = new SpeechSynthesisUtterance(WELCOME_SCRIPT);
      utterance.rate = 0.98;
      utterance.pitch = 1.0;
      utterance.volume = isMuted ? 0 : 1.0;

      // Select natural voice if available
      const voices = window.speechSynthesis.getVoices();
      const preferredVoice =
        voices.find(
          (v) =>
            v.lang.startsWith('en') &&
            (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Online'))
        ) ||
        voices.find((v) => v.lang.startsWith('en-US')) ||
        voices.find((v) => v.lang.startsWith('en')) ||
        voices[0];

      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }

      utterance.onstart = () => {
        setIsPlaying(true);
        setIsPaused(false);
      };

      utterance.onend = () => {
        setIsPlaying(false);
        setIsPaused(false);
      };

      utterance.onerror = (e) => {
        if (e.error !== 'canceled' && e.error !== 'interrupted') {
          console.warn('Welcome speech synthesis error:', e);
        }
        setIsPlaying(false);
        setIsPaused(false);
      };

      utteranceRef.current = utterance;
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('Speech synthesis playback error:', err);
      setIsPlaying(false);
      setIsPaused(false);
    }
  }, [isPaused, isMuted]);

  const handlePause = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.pause();
      setIsPaused(true);
      setIsPlaying(false);
    }
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(MUTE_STORAGE_KEY, next ? '1' : '0');
      } catch {
        // fallback
      }
      if (utteranceRef.current) {
        utteranceRef.current.volume = next ? 0 : 1.0;
      }
      return next;
    });
  }, []);

  if (!isSupported) {
    return null;
  }

  return (
    <div
      role="region"
      aria-label="Welcome audio guide"
      className="mt-6 flex flex-wrap items-center justify-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs backdrop-blur-md sm:px-5 sm:py-2.5 transition-all duration-300 hover:bg-white/20"
    >
      {/* Audio Wave / Pulse Indicator */}
      <div className="flex items-center gap-2">
        {isPlaying ? (
          <div className="flex items-center gap-0.5" aria-hidden="true">
            <span className="h-2 w-0.5 animate-[pulse_0.6s_ease-in-out_infinite] bg-gold" />
            <span className="h-3.5 w-0.5 animate-[pulse_0.8s_ease-in-out_infinite_0.15s] bg-gold" />
            <span className="h-2.5 w-0.5 animate-[pulse_0.7s_ease-in-out_infinite_0.3s] bg-gold" />
          </div>
        ) : (
          <Volume2 className="h-4 w-4 text-gold" aria-hidden="true" />
        )}
        <span className="font-medium text-white/90">
          {isPlaying ? 'Speaking Welcome Guide' : isPaused ? 'Welcome Guide Paused' : 'Welcome to Spectral'}
        </span>
      </div>

      <div className="h-3.5 w-px bg-white/20" aria-hidden="true" />

      {/* Control Buttons */}
      <div className="flex items-center gap-1.5">
        {!isPlaying ? (
          <button
            type="button"
            onClick={handlePlay}
            className="inline-flex items-center gap-1.5 rounded-full bg-gold/90 px-3 py-1 font-semibold text-navy transition hover:bg-gold active:scale-95 focus-visible:outline-2 focus-visible:outline-gold"
            aria-label="Listen to Welcome"
          >
            <Play className="h-3 w-3 fill-current" />
            <span>Listen</span>
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={handlePause}
              className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-1 text-white hover:bg-white/30 active:scale-95"
              aria-label="Pause audio"
            >
              <Pause className="h-3 w-3" />
              <span>Pause</span>
            </button>
            <button
              type="button"
              onClick={handleStop}
              className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-1 text-white hover:bg-white/30 active:scale-95"
              aria-label="Stop audio"
            >
              <Square className="h-3 w-3 fill-current" />
              <span>Stop</span>
            </button>
          </>
        )}

        <button
          type="button"
          onClick={toggleMute}
          className="flex h-7 w-7 items-center justify-center rounded-full text-white/70 hover:bg-white/15 hover:text-white"
          aria-label={isMuted ? 'Unmute welcome voice' : 'Mute welcome voice'}
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <VolumeX className="h-3.5 w-3.5 text-gold" /> : <Volume2 className="h-3.5 w-3.5" />}
        </button>
      </div>
    </div>
  );
}
