
import React, { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Message, Emotion, User, AuthState, ViewState, JournalEntry, ChatThread } from './types';
import { api } from './services/api';
import { classifyEmotion } from './server/utils/analysis';
import MessageBubble from './components/MessageBubble';
import Disclaimer from './components/Disclaimer';
import AuthForms from './components/AuthForms';
import MoodDashboard from './components/MoodDashboard';
import JournalView from './components/JournalView';
import DocumentationView from './components/DocumentationView';
import ChatSidebar from './components/ChatSidebar';

const App: React.FC = () => {
  const [auth, setAuth] = useState<AuthState>(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    return {
      user: savedUser ? JSON.parse(savedUser) : null,
      token: savedToken,
      view: savedToken ? 'chat' : 'login'
    };
  });

  const [messages, setMessages] = useState<Message[]>(() => {
    const savedMessages = localStorage.getItem(`messages_${auth.user?.id}`);
    if (savedMessages) {
      const parsed = JSON.parse(savedMessages);
      return parsed.map((m: any) => ({ ...m, timestamp: new Date(m.timestamp) }));
    }
    return [{
      id: 'welcome',
      role: 'bot',
      content: `Hello. I'm MindfulBot, your companion for emotional support and wellness. How are you feeling today?`,
      timestamp: new Date(),
    }];
  });

  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(() => {
    const savedJournal = localStorage.getItem(`journal_${auth.user?.id}`);
    if (savedJournal) {
      const parsed = JSON.parse(savedJournal);
      return parsed.map((e: any) => ({ ...e, createdAt: new Date(e.createdAt) }));
    }
    return [];
  });

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Local chat threads (ChatGPT-style sidebar). These are a UI organizing layer
  // persisted per user in localStorage so they survive refresh.
  const [chatThreads, setChatThreads] = useState<ChatThread[]>(() => {
    const savedUser = localStorage.getItem('user');
    if (!savedUser) return [];
    const user = JSON.parse(savedUser) as User;
    const raw = localStorage.getItem(`threads_${user.id}`);
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw) as any[];
      return parsed.map((t) => ({
        ...t,
        createdAt: new Date(t.createdAt),
        messages: (t.messages || []).map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp),
        })),
      }));
    } catch {
      return [];
    }
  });

  const [activeThreadId, setActiveThreadId] = useState<string | null>(() => {
    const savedUser = localStorage.getItem('user');
    if (!savedUser) return null;
    const user = JSON.parse(savedUser) as User;
    return localStorage.getItem(`activeThread_${user.id}`) || null;
  });

  useEffect(() => {
    if (auth.user?.id) {
      localStorage.setItem(`messages_${auth.user.id}`, JSON.stringify(messages));
      localStorage.setItem(`journal_${auth.user.id}`, JSON.stringify(journalEntries));
    }
  }, [messages, journalEntries, auth.user?.id]);

  // Persist chat threads and active thread per user so sidebar survives refresh.
  useEffect(() => {
    if (!auth.user?.id) return;
    localStorage.setItem(`threads_${auth.user.id}`, JSON.stringify(chatThreads));
    if (activeThreadId) {
      localStorage.setItem(`activeThread_${auth.user.id}`, activeThreadId);
    } else {
      localStorage.removeItem(`activeThread_${auth.user.id}`);
    }
  }, [chatThreads, activeThreadId, auth.user?.id]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading, auth.view]);

  const handleAuthSuccess = async (user: User, token: string) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setAuth({ user, token, view: 'chat' });

    // After successful login/signup, load chat and journal history from MongoDB
    try {
      const chats = await api.getChatHistory(token);
      if (chats.length > 0) {
        const historyMessages: Message[] = [];
        chats.forEach((chat) => {
          const createdAt = new Date(chat.createdAt);
          const userEmotion = classifyEmotion(chat.userMessage);

          historyMessages.push({
            id: `${chat._id}-user`,
            role: 'user',
            content: chat.userMessage,
            timestamp: createdAt,
            emotion: userEmotion,
          });

          historyMessages.push({
            id: `${chat._id}-bot`,
            role: 'bot',
            content: chat.botResponse,
            timestamp: createdAt,
          });
        });

        setMessages(historyMessages);

        // Seed a single thread with loaded history if none exist yet
        setChatThreads((prev) => {
          if (prev.length > 0) return prev;

          const firstUserMessage = historyMessages.find((m) => m.role === 'user');
          const baseTitle = firstUserMessage?.content ?? 'First conversation';
          const title =
            baseTitle.length > 30 ? baseTitle.slice(0, 27).trimEnd() + '...' : baseTitle;

          const initialThread: ChatThread = {
            id: uuidv4(),
            title,
            createdAt: historyMessages[0]?.timestamp ?? new Date(),
            messages: historyMessages,
          };
          setActiveThreadId(initialThread.id);
          return [initialThread];
        });
      }

      const journal = await api.getJournalEntries(token);
      if (journal.length > 0) {
        const historyJournal: JournalEntry[] = journal.map((e) => ({
          id: e.id,
          content: e.content,
          reflection: e.reflection,
          createdAt: new Date(e.createdAt),
        }));
        setJournalEntries(historyJournal);
      }
    } catch (err) {
      console.error("Failed to load history:", err);
    }
  };

  const handleLogout = () => {
    const currentUser = auth.user;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    if (currentUser?.id) {
      localStorage.removeItem(`threads_${currentUser.id}`);
      localStorage.removeItem(`activeThread_${currentUser.id}`);
      localStorage.removeItem(`messages_${currentUser.id}`);
      localStorage.removeItem(`journal_${currentUser.id}`);
    }
    setAuth({ user: null, token: null, view: 'login' });
    setMessages([{
      id: 'welcome',
      role: 'bot',
      content: "Hello. I'm MindfulBot, your companion for emotional support and wellness. How are you feeling today?",
      timestamp: new Date(),
    }]);
    setJournalEntries([]);
    setChatThreads([]);
    setActiveThreadId(null);
  };

  const setView = (view: ViewState | 'docs') => setAuth(prev => ({ ...prev, view: view as ViewState }));

  const handleSaveJournal = async (content: string) => {
    try {
      const newEntry = await api.saveJournalEntry(content, auth.token);
      setJournalEntries(prev => [...prev, newEntry]);
    } catch (error) {
      console.error("Journaling failed:", error);
      throw error;
    }
  };

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    const detectedEmotion = classifyEmotion(userText);
    
    const userMessage: Message = {
      id: uuidv4(),
      role: 'user',
      content: userText,
      timestamp: new Date(),
      emotion: detectedEmotion
    };

    // Base messages including the new user message
    const baseMessages = [...messages, userMessage];
    setMessages(baseMessages);
    setInput('');
    setIsLoading(true);

    try {
      const botMessage = await api.sendMessage(userText, baseMessages, auth.token);
      const finalMessages = [...baseMessages, botMessage];
      setMessages(finalMessages);

      // If there is no active thread yet, create one now so it appears in the sidebar.
      if (!activeThreadId) {
        const newThreadId = uuidv4();
        const baseTitle =
          userText.length > 30 ? userText.slice(0, 27).trimEnd() + '...' : userText;

        const newThread: ChatThread = {
          id: newThreadId,
          title: baseTitle || 'New chat',
          createdAt: new Date(),
          messages: finalMessages,
        };

        setChatThreads((prev) => [newThread, ...prev]);
        setActiveThreadId(newThreadId);
        return;
      }

      // Update active thread with new messages and auto-title
      if (activeThreadId) {
        setChatThreads((prev) =>
          prev.map((thread) => {
            if (thread.id !== activeThreadId) return thread;

            let newTitle = thread.title;
            if (thread.messages.length === 0) {
              const baseTitle = userText;
              newTitle =
                baseTitle.length > 30
                  ? baseTitle.slice(0, 27).trimEnd() + '...'
                  : baseTitle;
            }

            return {
              ...thread,
              title: newTitle,
              messages: finalMessages,
            };
          })
        );
      }
    } catch (error: any) {
      setMessages(prev => [...prev, {
        id: uuidv4(),
        role: 'bot',
        content: error.message,
        timestamp: new Date(),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewThread = () => {
    const welcomeMessage: Message = {
      id: 'welcome-' + uuidv4(),
      role: 'bot',
      content:
        "Hello. I'm MindfulBot, your companion for emotional support and wellness. How are you feeling today?",
      timestamp: new Date(),
    };

    const newThread: ChatThread = {
      id: uuidv4(),
      title: 'New chat',
      createdAt: new Date(),
      messages: [welcomeMessage],
    };

    setChatThreads((prev) => [newThread, ...prev]);
    setActiveThreadId(newThread.id);
    setMessages(newThread.messages);
  };

  const handleSelectThread = (id: string) => {
    setActiveThreadId(id);
    const thread = chatThreads.find((t) => t.id === id);
    if (thread) {
      setMessages(thread.messages);
    }
  };

  const handleDeleteThread = (id: string) => {
    setChatThreads((prev) => prev.filter((t) => t.id !== id));
    if (id === activeThreadId) {
      const remaining = chatThreads.filter((t) => t.id !== id);
      setActiveThreadId(remaining[0]?.id ?? null);
      setMessages(
        remaining[0]?.messages ?? [
          {
            id: 'welcome',
            role: 'bot',
            content:
              "Hello. I'm MindfulBot, your companion for emotional support and wellness. How are you feeling today?",
            timestamp: new Date(),
          },
        ]
      );
    }
  };

  if (auth.view === 'login' || auth.view === 'signup') {
    return (
      <AuthForms 
        view={auth.view as 'login' | 'signup'} 
        setView={(view) => setAuth(prev => ({ ...prev, view }))}
        onSuccess={handleAuthSuccess}
      />
    );
  }

  return (
    <div className="flex flex-col h-screen max-h-screen bg-emerald-50 text-slate-900">
      <Disclaimer />
      <header className="px-6 py-4 bg-white shadow-sm flex items-center justify-between z-10">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-100">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-800 leading-tight">MindfulBot</h1>
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="text-[10px] text-slate-500 uppercase tracking-widest font-semibold">
                {auth.user?.name || 'Active Support'}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-1 md:space-x-3">
          <button onClick={() => setView('chat')} className={`flex items-center space-x-2 px-3 py-2 text-sm font-bold rounded-xl transition-all ${auth.view === 'chat' ? 'text-emerald-700 bg-emerald-50' : 'text-slate-400 hover:text-emerald-600'}`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
            <span className="hidden md:inline">Chat</span>
          </button>
          <button onClick={() => setView('journal')} className={`flex items-center space-x-2 px-3 py-2 text-sm font-bold rounded-xl transition-all ${auth.view === 'journal' ? 'text-emerald-700 bg-emerald-50' : 'text-slate-400 hover:text-emerald-600'}`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
            <span className="hidden md:inline">Journal</span>
          </button>
          <button onClick={() => setView('dashboard')} className={`flex items-center space-x-2 px-3 py-2 text-sm font-bold rounded-xl transition-all ${auth.view === 'dashboard' ? 'text-emerald-700 bg-emerald-50' : 'text-slate-400 hover:text-emerald-600'}`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
            <span className="hidden md:inline">Insights</span>
          </button>
          <button onClick={() => setAuth(prev => ({...prev, view: 'docs' as any}))} className={`flex items-center space-x-2 px-3 py-2 text-sm font-bold rounded-xl transition-all ${auth.view === 'docs' as any ? 'text-emerald-700 bg-emerald-50' : 'text-slate-400 hover:text-emerald-600'}`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            <span className="hidden lg:inline">Docs</span>
          </button>
          <div className="h-6 w-[1px] bg-slate-100 hidden md:block" />
          <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-red-500 transition-colors" title="Logout">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          </button>
        </div>
      </header>
      <div className="flex-1 overflow-hidden relative">
        {auth.view === 'chat' && (
          <div className="flex h-full bg-emerald-50">
            <ChatSidebar
              threads={chatThreads}
              activeThreadId={activeThreadId}
              onNewChat={handleNewThread}
              onSelectThread={handleSelectThread}
              onDeleteThread={handleDeleteThread}
            />
            <div className="flex flex-col flex-1">
              <main
                ref={scrollRef}
                className="flex-1 overflow-y-auto px-4 py-6 custom-scrollbar space-y-2 max-w-4xl mx-auto w-full"
              >
                {messages.map((msg) => (
                  <MessageBubble key={msg.id} message={msg} />
                ))}
                {isLoading && (
                  <div className="flex justify-start animate-pulse">
                    <div className="bg-white border border-slate-100 rounded-2xl px-5 py-3 shadow-sm rounded-tl-none flex space-x-1.5 items-center">
                      <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                      <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                    </div>
                  </div>
                )}
              </main>
              <footer className="bg-white border-t border-slate-100 p-4 md:p-6">
                <form
                  onSubmit={handleSend}
                  className="max-w-4xl mx-auto flex items-center space-x-3 bg-slate-50 border border-slate-200 rounded-2xl p-1 shadow-inner"
                >
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Share what's on your mind..."
                    className="flex-1 bg-transparent border-none focus:ring-0 px-4 py-3 text-sm text-slate-700 placeholder:text-slate-400"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className={`p-3 rounded-xl transition-all ${
                      !input.trim() || isLoading
                        ? 'text-slate-300 bg-slate-100 cursor-not-allowed'
                        : 'text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-200'
                    }`}
                  >
                    <svg
                      className="w-5 h-5 transform rotate-90"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                    </svg>
                  </button>
                </form>
              </footer>
            </div>
          </div>
        )}
        {auth.view === 'dashboard' && (() => {
          const oneWeekAgo = new Date();
          oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

          // Combine messages from all chat threads for the last 7 days.
          const allThreadMessages = chatThreads.flatMap((t) => t.messages);
          const sourceMessages =
            allThreadMessages.length > 0 ? allThreadMessages : messages;

          const weeklyMessages = sourceMessages.filter(
            (m) => m.timestamp && new Date(m.timestamp) >= oneWeekAgo
          );

          return (
            <MoodDashboard
              messages={weeklyMessages}
              onBack={() => setView('chat')}
            />
          );
        })()}
        {auth.view === 'journal' && <JournalView entries={journalEntries} onSave={handleSaveJournal} onBack={() => setView('chat')} />}
        {(auth.view as any) === 'docs' && <DocumentationView onBack={() => setView('chat')} />}
      </div>
    </div>
  );
};

export default App;
