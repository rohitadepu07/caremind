import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Heart, Smile, Sparkles, CheckCircle2 } from 'lucide-react';

export const ConnectionQuestView: React.FC = () => {
  const { state, completeConnectionQuest } = useApp();
  const quest = state.connectionQuest;
  const [selectedEmotion, setSelectedEmotion] = useState<'happy' | 'calm' | 'loved' | null>(null);

  const handleComplete = (emotion: 'happy' | 'calm' | 'loved') => {
    setSelectedEmotion(emotion);
    completeConnectionQuest(emotion);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 space-y-8 pb-24">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="bg-rose-100 text-rose-900 px-4 py-1.5 rounded-full text-sm font-bold">
          ❤️ Family Connection Quest
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900">
          Heartfelt Daily Mission
        </h1>
        <p className="text-lg text-stone-600">
          Connecting with loved ones nurtures the soul and brings boundless joy.
        </p>
      </div>

      {/* Quest Card */}
      <div className="bg-gradient-to-br from-rose-50 to-pink-50 border-2 border-rose-300 rounded-3xl p-8 sm:p-10 shadow-lg space-y-8 text-center">
        <div className="w-20 h-20 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center text-4xl mx-auto shadow-inner">
          ❤️
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 leading-snug">
            "{quest.task}"
          </h2>
        </div>

        {quest.completed ? (
          <div className="bg-white/90 border border-rose-200 p-6 rounded-2xl space-y-3">
            <div className="flex items-center justify-center space-x-2 text-rose-700 font-bold text-xl">
              <CheckCircle2 className="w-7 h-7" />
              <span>Completed Today!</span>
            </div>
            <p className="text-stone-700 text-lg">
              You felt: <span className="font-bold capitalize text-rose-800">{quest.emotionalResponse}</span>
            </p>
          </div>
        ) : (
          <div className="space-y-6 pt-4 border-t border-rose-200">
            <p className="text-stone-700 font-semibold text-lg">How did completing this make you feel?</p>
            <div className="grid grid-cols-3 gap-4">
              {[
                { id: 'happy', label: '😊 Happy', bg: 'hover:bg-amber-100 border-amber-300 text-amber-900' },
                { id: 'calm', label: '😌 Calm', bg: 'hover:bg-emerald-100 border-emerald-300 text-emerald-900' },
                { id: 'loved', label: '❤️ Loved', bg: 'hover:bg-rose-100 border-rose-300 text-rose-900' },
              ].map((emo) => (
                <button
                  key={emo.id}
                  onClick={() => handleComplete(emo.id as any)}
                  className={`p-5 rounded-2xl border-2 bg-white font-bold text-lg shadow-sm transition-all ${emo.bg}`}
                >
                  {emo.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

    </div>
  );
};
