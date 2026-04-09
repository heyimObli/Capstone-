import React from 'react';
import { ChatThread } from '../types';
import ChatHistoryItem from './ChatHistoryItem';

interface ChatSidebarProps {
  threads: ChatThread[];
  activeThreadId: string | null;
  onNewChat: () => void;
  onSelectThread: (id: string) => void;
  onDeleteThread: (id: string) => void;
}

function groupThreadsByDate(threads: ChatThread[]) {
  const groups: Record<string, ChatThread[]> = {
    Today: [],
    Yesterday: [],
    Previous: [],
  };

  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isSameDay = (d1: Date, d2: Date) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  threads.forEach((thread) => {
    const created = new Date(thread.createdAt);
    if (isSameDay(created, today)) groups.Today.push(thread);
    else if (isSameDay(created, yesterday)) groups.Yesterday.push(thread);
    else groups.Previous.push(thread);
  });

  return groups;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  threads,
  activeThreadId,
  onNewChat,
  onSelectThread,
  onDeleteThread,
}) => {
  const grouped = groupThreadsByDate(threads);

  return (
    <aside className="hidden md:flex md:flex-col w-64 lg:w-72 bg-emerald-50 border-r border-emerald-100">
      {/* New Chat button */}
      <div className="p-3 border-b border-emerald-100 flex items-center bg-white/80 backdrop-blur">
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-md bg-emerald-500 hover:bg-emerald-600 text-sm font-medium text-white transition-colors"
        >
          <span className="text-lg leading-none">+</span>
          <span>New Chat</span>
        </button>
      </div>

      {/* History list */}
      <div className="flex-1 overflow-y-auto scroll-smooth px-2 py-3 space-y-4 text-xs text-slate-500">
        {['Today', 'Yesterday', 'Previous'].map((section) => {
          const list = grouped[section];
          if (!list || list.length === 0) return null;

          return (
            <div key={section}>
              <p className="px-2 mb-1 uppercase tracking-wide text-[10px] text-slate-400">
                {section}
              </p>
              <div className="space-y-1">
                {list.map((thread) => (
                  <ChatHistoryItem
                    key={thread.id}
                    thread={thread}
                    isActive={thread.id === activeThreadId}
                    onSelect={() => onSelectThread(thread.id)}
                    onDelete={() => onDeleteThread(thread.id)}
                  />
                ))}
              </div>
            </div>
          );
        })}

        {threads.length === 0 && (
          <p className="text-center text-slate-400 text-xs mt-4">
            No chats yet. Start a new conversation.
          </p>
        )}
      </div>
    </aside>
  );
};

export default ChatSidebar;

