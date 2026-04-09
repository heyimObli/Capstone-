
import React from 'react';

const Disclaimer: React.FC = () => {
  return (
    <div className="bg-amber-50 border-b border-amber-100 px-4 py-2.5 flex items-center justify-center space-x-2 text-center">
      <svg className="w-4 h-4 text-amber-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <p className="text-[11px] md:text-xs text-amber-800 font-medium">
        This chatbot is not a replacement for professional mental health support. If you are in crisis, please call emergency services.
      </p>
    </div>
  );
};

export default Disclaimer;
