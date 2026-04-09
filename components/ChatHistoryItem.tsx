import React, { useState } from 'react';
import { ChatThread } from '../types';

interface ChatHistoryItemProps {
  thread: ChatThread;
  isActive: boolean;
  onSelect: () => void;
  onDelete: () => void;
}

const ChatHistoryItem: React.FC<ChatHistoryItemProps> = ({
  thread,
  isActive,
  onSelect,
  onDelete,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div
      className={`group flex items-center justify-between gap-1 px-2 py-2 rounded-md cursor-pointer text-xs transition-colors ${
        isActive
          ? 'bg-emerald-100 text-emerald-800'
          : 'hover:bg-emerald-50 text-slate-700'
      }`}
      onClick={() => {
        onSelect();
        setMenuOpen(false);
      }}
    >
      <div className="flex-1 truncate">
        <span>{thread.title || 'New chat'}</span>
      </div>
      <div
        className="relative pl-1"
        onClick={(e) => {
          e.stopPropagation();
          setMenuOpen((prev) => !prev);
        }}
      >
        <button className="opacity-0 group-hover:opacity-100 transition-opacity px-1 py-0.5 rounded hover:bg-emerald-100/80">
          ⋯
        </button>
        {menuOpen && (
          <div className="absolute right-0 mt-1 w-28 bg-white border border-emerald-100 rounded-md shadow-lg z-10 text-[11px]">
            <button
              className="w-full text-left px-3 py-1.5 hover:bg-emerald-50 text-red-500"
              onClick={() => {
                onDelete();
                setMenuOpen(false);
              }}
            >
              Delete chat
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatHistoryItem;

