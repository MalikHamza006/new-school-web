import { useState, useEffect, useRef, useCallback } from 'react';
import { SPECTRAL_AI_CONFIG } from '../config/spectralAI';
import { cleanSpeechText } from '../utils/cleanSpeechText';

interface UseTextToSpeechOptions {
  rate?: number;
  pitch?: number;
  volume?: number;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (err: unknown) => void;
}

export function useTextToSpeech(options: UseTextToSpeechOptions = {}) {
  const {
    rate = SPECTRAL_AI_CONFIG.textToSpeech.rate,
    pitch = SPECTRAL_AI_CONFIG.textToSpeech.pitch,
    volume = SPECTRAL_AI_CONFIG.textToSpeech.volume,
    onStart,
    onEnd,
    onError,
  } = options;

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const selectedVoiceRef = useRef<SpeechSynthesisVoice | null>(null);

  const onStartRef = useRef(onStart);
  const onEndRef = useRef(onEnd);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onStartRef.current = onStart;
  }, [onStart]);

  useEffect(() => {
    onEndRef.current = onEnd;
  }, [onEnd]);

  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  // Check support and load voices
  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setIsSupported(false);
      return;
    }

    setIsSupported(true);

    const updateVoices = () => {
      try {
        const voices = window.speechSynthesis.getVoices();
        if (!voices || voices.length === 0) return;

        // Choose a natural English or suitable neutral voice
        const preferredVoice =
          voices.find((v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Google') || v.name.includes('Online'))) ||
          voices.find((v) => v.lang.startsWith('en-US')) ||
          voices.find((v) => v.lang.startsWith('en')) ||
          voices[0];

        selectedVoiceRef.current = preferredVoice || null;
      } catch {
        // ignore
      }
    };

    updateVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }

    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        try {
          window.speechSynthesis.cancel();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  const stopSpeaking = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // ignore
      }
    }
    setIsSpeaking(false);
  }, []);

  const speak = useCallback(
    (text: string) => {
      if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
        onEndRef.current?.();
        return;
      }

      // 1. Cancel any prior speech to prevent overlap
      try {
        window.speechSynthesis.cancel();
      } catch {
        // ignore
      }

      const cleanText = cleanSpeechText(text);
      if (!cleanText) {
        setIsSpeaking(false);
        onEndRef.current?.();
        return;
      }

      try {
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.rate = rate;
        utterance.pitch = pitch;
        utterance.volume = volume;

        if (selectedVoiceRef.current) {
          utterance.voice = selectedVoiceRef.current;
        }

        utterance.onstart = () => {
          setIsSpeaking(true);
          onStartRef.current?.();
        };

        utterance.onend = () => {
          setIsSpeaking(false);
          onEndRef.current?.();
        };

        utterance.onerror = (e) => {
          // 'canceled' or 'interrupted' is expected when user hits stop
          setIsSpeaking(false);
          if (e.error !== 'canceled' && e.error !== 'interrupted') {
            console.warn('SpeechSynthesis error:', e);
            onErrorRef.current?.(e);
          }
          onEndRef.current?.();
        };

        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.warn('Failed to speak with SpeechSynthesis:', err);
        setIsSpeaking(false);
        onErrorRef.current?.(err);
        onEndRef.current?.();
      }
    },
    [rate, pitch, volume]
  );

  return {
    isSpeaking,
    isSupported,
    speak,
    stopSpeaking,
  };
}
