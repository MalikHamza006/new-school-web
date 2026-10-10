import { useState, useCallback, useRef } from 'react';
import {
  SPECTRAL_AI_CONFIG,
  type AssistantState,
  type Message,
} from '../config/spectralAI';
import { queryPuterAI } from '../services/puterAI';
import { useVoiceRecognition } from './useVoiceRecognition';
import { useTextToSpeech } from './useTextToSpeech';

export function useVoiceAssistant() {
  const [state, setState] = useState<AssistantState>('idle');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: SPECTRAL_AI_CONFIG.welcomeMessage,
      timestamp: Date.now(),
    },
  ]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // References to handle async responses safely
  const messagesRef = useRef(messages);
  messagesRef.current = messages;

  const stateRef = useRef(state);
  stateRef.current = state;

  // Text to speech hook
  const { speak, stopSpeaking: stopTTS, isSpeaking, isSupported: isTtsSupported } = useTextToSpeech({
    onStart: () => {
      setState('speaking');
    },
    onEnd: () => {
      // Transition back to idle when speaking finishes
      setState((prev) => (prev === 'speaking' ? 'idle' : prev));
    },
    onError: () => {
      setState((prev) => (prev === 'speaking' ? 'idle' : prev));
    },
  });

  // Handler for sending a user message and receiving an AI response
  const handleSendMessage = useCallback(
    async (text: string, speakResponse = true) => {
      const cleanInput = text.trim();
      if (!cleanInput) return;

      // Prevent concurrent requests
      if (stateRef.current === 'processing') return;

      // Stop any prior speech
      stopTTS();

      const userMessage: Message = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: cleanInput,
        timestamp: Date.now(),
      };

      const updatedHistory = [...messagesRef.current, userMessage];
      setMessages(updatedHistory);
      setState('processing');
      setErrorMessage(null);

      try {
        const replyText = await queryPuterAI(updatedHistory);

        const aiMessage: Message = {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          content: replyText,
          timestamp: Date.now(),
        };

        setMessages((prev) => [...prev, aiMessage]);

        if (speakResponse && isTtsSupported) {
          // Will transition state to 'speaking', then 'idle' on end
          speak(replyText);
        } else {
          setState('idle');
        }
      } catch (err: unknown) {
        console.warn('Spectral AI query error:', err);
        const fallbackText =
          err instanceof Error && err.message
            ? err.message
            : SPECTRAL_AI_CONFIG.errorMessages.genericError;

        const aiFallbackMessage: Message = {
          id: `ai-err-${Date.now()}`,
          role: 'assistant',
          content: fallbackText,
          timestamp: Date.now(),
        };

        setMessages((prev) => [...prev, aiFallbackMessage]);
        setErrorMessage(fallbackText);
        setState('error');
      }
    },
    [isTtsSupported, speak, stopTTS]
  );

  // Voice recognition hook
  const {
    startListening: startVoiceRecognition,
    stopListening: stopVoiceRecognition,
    isListening,
    isSupported: isVoiceSupported,
  } = useVoiceRecognition({
    onResult: (transcript) => {
      handleSendMessage(transcript, true);
    },
    onError: (err) => {
      setErrorMessage(err);
      setState('error');
    },
    onEnd: () => {
      setState((prev) => (prev === 'listening' ? 'idle' : prev));
    },
  });

  const toggleListening = useCallback(() => {
    // If speaking, stop speaking first
    if (state === 'speaking' || isSpeaking) {
      stopTTS();
      setState('idle');
      return;
    }

    // If currently listening, stop it
    if (state === 'listening' || isListening) {
      stopVoiceRecognition();
      setState('idle');
      return;
    }

    // Don't interrupt processing
    if (state === 'processing') return;

    // Start listening
    setErrorMessage(null);
    setState('listening');
    startVoiceRecognition();
  }, [state, isSpeaking, isListening, stopTTS, stopVoiceRecognition, startVoiceRecognition]);

  const handleStopSpeaking = useCallback(() => {
    stopTTS();
    setState('idle');
  }, [stopTTS]);

  const resetChat = useCallback(() => {
    stopTTS();
    stopVoiceRecognition();
    setState('idle');
    setErrorMessage(null);
    setMessages([
      {
        id: 'welcome',
        role: 'assistant',
        content: SPECTRAL_AI_CONFIG.welcomeMessage,
        timestamp: Date.now(),
      },
    ]);
  }, [stopTTS, stopVoiceRecognition]);

  return {
    state,
    messages,
    errorMessage,
    isVoiceSupported,
    isListening: state === 'listening' || isListening,
    isSpeaking: state === 'speaking' || isSpeaking,
    isProcessing: state === 'processing',
    sendMessage: handleSendMessage,
    toggleListening,
    stopSpeaking: handleStopSpeaking,
    resetChat,
  };
}
