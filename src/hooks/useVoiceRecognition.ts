import { useState, useEffect, useRef, useCallback } from 'react';
import { SPECTRAL_AI_CONFIG } from '../config/spectralAI';

interface UseVoiceRecognitionOptions {
  lang?: string;
  onResult?: (transcript: string) => void;
  onError?: (errorMessage: string) => void;
  onEnd?: () => void;
}

// Minimal SpeechRecognition interfaces for browsers without @types/dom-speech-recognition
interface IWindowWithSpeechRecognition extends Window {
  SpeechRecognition?: {
    new (): ISpeechRecognitionInstance;
  };
  webkitSpeechRecognition?: {
    new (): ISpeechRecognitionInstance;
  };
}

interface ISpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onstart: (() => void) | null;
  onresult: ((event: ISpeechRecognitionEvent) => void) | null;
  onerror: ((event: ISpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
}

interface ISpeechRecognitionEvent {
  results: {
    length: number;
    item(index: number): {
      [key: number]: { transcript: string };
      length: number;
    };
    [index: number]: {
      [key: number]: { transcript: string };
      length: number;
    };
  };
}

interface ISpeechRecognitionErrorEvent {
  error: string;
  message?: string;
}

export function useVoiceRecognition(options: UseVoiceRecognitionOptions = {}) {
  const {
    lang = SPECTRAL_AI_CONFIG.speechRecognition.defaultLang,
    onResult,
    onError,
    onEnd,
  } = options;

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(false);

  const recognitionRef = useRef<ISpeechRecognitionInstance | null>(null);
  const onResultRef = useRef(onResult);
  const onErrorRef = useRef(onError);
  const onEndRef = useRef(onEnd);

  // Keep callback refs updated to avoid stale closures
  useEffect(() => {
    onResultRef.current = onResult;
  }, [onResult]);

  useEffect(() => {
    onErrorRef.current = onError;
  }, [onError]);

  useEffect(() => {
    onEndRef.current = onEnd;
  }, [onEnd]);

  useEffect(() => {
    const win = typeof window !== 'undefined' ? (window as unknown as IWindowWithSpeechRecognition) : null;
    const RecognitionConstructor = win?.SpeechRecognition || win?.webkitSpeechRecognition;

    if (!RecognitionConstructor) {
      setIsSupported(false);
      return;
    }

    setIsSupported(true);

    try {
      const recognition = new RecognitionConstructor();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;
      recognition.lang = lang;

      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
      };

      recognition.onresult = (event: ISpeechRecognitionEvent) => {
        let finalTranscript = '';
        for (let i = 0; i < event.results.length; i++) {
          const result = event.results[i];
          if (result && result[0]) {
            finalTranscript += result[0].transcript;
          }
        }

        const trimmed = finalTranscript.trim();
        if (trimmed) {
          setTranscript(trimmed);
          onResultRef.current?.(trimmed);
        }
      };

      recognition.onerror = (event: ISpeechRecognitionErrorEvent) => {
        setIsListening(false);
        let userMessage = SPECTRAL_AI_CONFIG.errorMessages.speechRecognitionError;

        if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
          userMessage = SPECTRAL_AI_CONFIG.errorMessages.microphonePermissionDenied;
        } else if (event.error === 'no-speech') {
          userMessage = 'No speech was detected. Tap the mic to try again.';
        }

        setError(userMessage);
        onErrorRef.current?.(userMessage);
      };

      recognition.onend = () => {
        setIsListening(false);
        onEndRef.current?.();
      };

      recognitionRef.current = recognition;
    } catch (err) {
      console.warn('SpeechRecognition failed to initialize:', err);
      setIsSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore cleanup errors
        }
        recognitionRef.current = null;
      }
    };
  }, [lang]);

  const startListening = useCallback(() => {
    if (!recognitionRef.current) {
      setError(SPECTRAL_AI_CONFIG.errorMessages.speechRecognitionUnsupported);
      return;
    }

    setError(null);
    setTranscript('');

    try {
      recognitionRef.current.start();
    } catch {
      // If already started or aborting, stop and retry
      try {
        recognitionRef.current.abort();
        setTimeout(() => {
          try {
            recognitionRef.current?.start();
          } catch {
            // ignore
          }
        }, 50);
      } catch {
        // ignore
      }
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }
    setIsListening(false);
  }, [isListening]);

  return {
    isListening,
    transcript,
    error,
    isSupported,
    startListening,
    stopListening,
  };
}
