import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, Plus, Mic, BookOpen, Calendar } from 'lucide-react';

export const MemoryJournalView: React.FC = () => {
  const { state, addMemory } = useApp();
  const [newContent, setNewContent] = useState('');
  const [newType, setNewType] = useState<'wish' | 'thought' | 'voice' | 'garden' | 'family'>('thought');
  const [showAddModal, setShowAddModal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;
    addMemory({
      type: newType,
      content: newContent.trim(),
    });
    setNewContent('');
    setShowAddModal(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8 pb-24">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-700 to-indigo-800 text-white rounded-3xl p-8 sm:p-10 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-3">
          <span className="bg-white/20 text-purple-50 px-4 py-1.5 rounded-full text-sm font-medium">
            💭 Cherished Moments
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold">My Memories & Journal</h1>
          <p className="text-xl text-purple-100 max-w-lg">
            A beautiful timeline of your wishes, thoughts, garden blooms, and family moments.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-6 py-4 bg-white text-purple-900 rounded-2xl font-bold text-lg shadow-lg hover:bg-purple-50 transition-all flex items-center space-x-2 shrink-0"
        >
          <Plus className="w-5 h-5" />
          <span>Add Memory</span>
        </button>
      </div>

      {/* Add Memory Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border-2 border-purple-200 max-w-lg w-full rounded-3xl p-8 shadow-2xl space-y-6">
            <h3 className="text-2xl font-serif font-bold text-purple-950">Record a New Memory</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-stone-700 font-semibold mb-2">Memory Type</label>
                <select
                  value={newType}
                  onChange={(e: any) => setNewType(e.target.value)}
                  className="w-full p-3.5 border border-stone-300 rounded-2xl text-lg text-stone-800 bg-white"
                >
                  <option value="thought">💭 Thought / Reflection</option>
                  <option value="wish">🌟 Personal Wish</option>
                  <option value="family">❤️ Family Moment</option>
                  <option value="garden">🌱 Garden Blooming</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-2">Your Words</label>
                <textarea
                  rows={4}
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  placeholder="What would you like to remember today?"
                  className="w-full p-4 border border-stone-300 rounded-2xl text-lg text-stone-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3.5 bg-stone-100 text-stone-700 rounded-2xl font-bold hover:bg-stone-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3.5 bg-purple-700 text-white rounded-2xl font-bold hover:bg-purple-800 shadow-md"
                >
                  Save Memory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className="space-y-4">
        {state.memories.map((mem) => (
          <div
            key={mem.id}
            className="bg-white border-2 border-purple-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-3 hover:border-purple-300 transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="bg-purple-50 text-purple-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                {mem.type}
              </span>
              <span className="text-sm text-stone-400 flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{mem.date}</span>
              </span>
            </div>
            <p className="text-xl font-serif text-stone-800 leading-relaxed">
              "{mem.content}"
            </p>
          </div>
        ))}
      </div>

    </div>
  );
};
