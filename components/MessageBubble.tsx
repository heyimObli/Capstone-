
import React from 'react';
import { Message, Emotion } from '../types';

interface MessageBubbleProps {
  message: Message;
}

const getEmotionBadge = (emotion?: Emotion) => {
  if (!emotion || emotion === 'neutral') return null;
  
  const styles: Record<string, string> = {
    happy: 'bg-yellow-100 text-yellow-700',
    sad: 'bg-blue-100 text-blue-700',
    anxious: 'bg-purple-100 text-purple-700',
    angry: 'bg-red-100 text-red-700',
    stressed: 'bg-orange-100 text-orange-700'
  };

  return (
    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-tighter ${styles[emotion] || 'bg-slate-100'}`}>
      {emotion}
    </span>
  );
};

const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isBot = message.role === 'bot';
  const isCrisis = message.isCrisis;

  return (
    <div className={`flex w-full mb-4 ${isBot ? 'justify-start' : 'justify-end animate-in slide-in-from-right-4 duration-300'}`}>
      <div className={`max-w-[85%] md:max-w-[70%] rounded-2xl px-4 py-3 shadow-sm ${
        isBot 
          ? isCrisis 
            ? 'bg-amber-50 border-2 border-amber-200 text-amber-900 rounded-tl-none'
            : 'bg-white border border-slate-100 text-slate-700 rounded-tl-none' 
          : 'bg-emerald-600 text-white rounded-tr-none'
      }`}>
        {isBot ? (
          <div className="flex items-center mb-1 space-x-2">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${isCrisis ? 'bg-amber-200' : 'bg-emerald-100'}`}>
              <span className={`text-[10px] font-bold ${isCrisis ? 'text-amber-700' : 'text-emerald-600'}`}>
                {isCrisis ? '!' : 'MB'}
              </span>
            </div>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
              {isCrisis ? 'Emergency Support' : 'MindfulBot'}
            </span>
          </div>
        ) : (
          <div className="flex justify-end mb-1">
            {getEmotionBadge(message.emotion)}
          </div>
        )}
        <p className={`text-sm leading-relaxed whitespace-pre-wrap ${isCrisis && isBot ? 'font-medium' : ''}`}>
          {message.content}
        </p>
        <div className={`text-[9px] mt-1.5 opacity-60 flex ${isBot ? 'justify-start' : 'justify-end'}`}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
