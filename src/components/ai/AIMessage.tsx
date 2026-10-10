import type { Message } from '../../config/spectralAI';
import { Bot, User } from 'lucide-react';

interface AIMessageProps {
  message: Message;
}

export function AIMessage({ message }: AIMessageProps) {
  const isUser = message.role === 'user';

  return (
    <div
      className={`flex items-start gap-2.5 transition-opacity duration-200 ${
        isUser ? 'flex-row-reverse' : 'flex-row'
      }`}
    >
      {/* Avatar */}
      <div
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
          isUser
            ? 'bg-navy-100 text-navy'
            : 'bg-navy text-gold ring-1 ring-gold/40 shadow-xs'
        }`}
        aria-hidden="true"
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4 text-gold" />}
      </div>

      {/* Bubble */}
      <div
        className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
          isUser
            ? 'bg-navy text-white rounded-tr-xs shadow-xs'
            : 'bg-canvas border border-navy/10 text-navy-950 rounded-tl-xs shadow-xs'
        }`}
      >
        <p className="whitespace-pre-wrap select-text">{message.content}</p>
      </div>
    </div>
  );
}
