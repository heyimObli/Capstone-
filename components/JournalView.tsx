
import React, { useState } from 'react';
import { JournalEntry } from '../types';

interface JournalViewProps {
  entries: JournalEntry[];
  onSave: (content: string) => Promise<void>;
  onBack: () => void;
}

const JournalView: React.FC<JournalViewProps> = ({ entries, onSave, onBack }) => {
  const [content, setContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!content.trim() || isSaving) return;
    setIsSaving(true);

    try {
      await onSave(content);
      setContent('');
    } catch (error) {
      console.error("Failed to save journal entry:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-emerald-50 animate-in fade-in duration-500 overflow-y-auto custom-scrollbar">
      <div className="p-6 max-w-4xl mx-auto w-full space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Mindful Journal</h2>
            <p className="text-sm text-slate-500">Pour your heart out. This is your safe space.</p>
          </div>
          <button 
            onClick={onBack}
            className="flex items-center space-x-2 px-4 py-2 bg-white text-emerald-600 font-semibold rounded-xl shadow-sm border border-emerald-100 hover:bg-emerald-50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Chat</span>
          </button>
        </div>

        {/* Entry Area */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-8 space-y-4">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest px-1">What's on your mind today?</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Start writing..."
            className="w-full h-48 bg-emerald-50/30 rounded-2xl border border-slate-100 p-4 text-slate-700 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all resize-none"
          />
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={!content.trim() || isSaving}
              className={`px-8 py-3 rounded-xl font-bold text-white transition-all flex items-center space-x-2 ${
                !content.trim() || isSaving ? 'bg-slate-300 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-200'
              }`}
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Reflecting...</span>
                </>
              ) : (
                <span>Save Entry</span>
              )}
            </button>
          </div>
        </div>

        {/* Previous Entries */}
        <div className="space-y-6 pb-12">
          <h3 className="text-lg font-bold text-slate-800">Past Reflections</h3>
          <div className="grid gap-6">
            {entries.length === 0 ? (
              <div className="bg-white/50 border border-dashed border-slate-200 rounded-3xl p-12 text-center text-slate-400">
                <p>No entries yet. Start your first journal entry above.</p>
              </div>
            ) : (
              [...entries].reverse().map((entry) => (
                <div key={entry.id} className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 md:p-8 space-y-4 animate-in slide-in-from-bottom-4 duration-500">
                  <div className="flex justify-between items-center pb-4 border-b border-slate-50">
                    <span className="text-sm font-bold text-emerald-600">
                      {new Date(entry.createdAt).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                    <span className="text-xs text-slate-400">
                      {new Date(entry.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {entry.content}
                  </div>
                  {entry.reflection && (
                    <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100/50">
                      <div className="flex items-center space-x-2 mb-2">
                        <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 11H9v-2h2v2zm0-4H9V5h2v4z" />
                        </svg>
                        <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Mindful Reflection</span>
                      </div>
                      <p className="text-sm text-slate-600 italic">
                        {entry.reflection}
                      </p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default JournalView;
