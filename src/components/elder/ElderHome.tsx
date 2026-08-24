import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, ArrowRight, CheckCircle2, Flame, Heart, Bell, Calendar } from 'lucide-react';

interface ElderHomeProps {
  setActiveTab: (tab: string) => void;
}

export const ElderHome: React.FC<ElderHomeProps> = ({ setActiveTab }) => {
  const { state, toggleReminder } = useApp();
  const profile = state.profile;

  // Find next uncompleted reminder
  const nextReminder = state.reminders.find((r) => !r.completedToday);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 pb-24">
      
      {/* Greeting Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-3xl p-8 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="absolute right-[-20px] bottom-[-20px] text-9xl opacity-10 select-none">🌸</div>
        <div className="relative z-10 space-y-3">
          <span className="bg-white/20 text-emerald-50 px-4 py-1.5 rounded-full text-sm font-medium tracking-wide">
            ☀️ Peaceful Morning
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight">
            Good Morning, {profile.name.replace('Grandma ', '')} 👋
          </h1>
          <p className="text-xl text-emerald-100 max-w-xl font-serif">
            Let's make today a beautiful, peaceful day full of joyful moments.
          </p>
        </div>
      </div>

      {/* Streak Tracker Card 🔥 */}
      <div className="bg-white border-2 border-amber-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">🔥</span>
            <div>
              <h3 className="text-2xl font-bold font-serif text-stone-800">{state.streakCount} Day Streak</h3>
              <p className="text-emerald-700 font-medium">You're doing wonderfully!</p>
            </div>
          </div>
          {state.streakCount >= 7 && (
            <button
              onClick={() => setActiveTab('profile')}
              className="bg-amber-100 text-amber-900 border border-amber-300 px-4 py-2 rounded-2xl text-sm font-bold hover:bg-amber-200 transition-all flex items-center space-x-2"
            >
              <span>🌟 View Wish Card</span>
            </button>
          )}
        </div>

        {/* 7-day progress row */}
        <div className="grid grid-cols-7 gap-2 pt-2 border-t border-stone-100">
          {state.streakHistory.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center space-y-1.5">
              <span className="text-xs font-bold text-stone-500">{item.day}</span>
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center text-lg font-bold shadow-sm ${
                  item.completed
                    ? 'bg-emerald-600 text-white'
                    : 'bg-stone-100 text-stone-400 border border-stone-200'
                }`}
              >
                {item.completed ? '✓' : '○'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Primary Card: Today's Activity */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 rounded-3xl p-8 sm:p-10 shadow-lg space-y-6">
        <div className="flex items-center justify-between">
          <span className="bg-amber-200/80 text-amber-900 px-4 py-1.5 rounded-full font-bold text-sm">
            🧠 Today's Brain Activity
          </span>
          <span className="text-sm font-semibold text-stone-500">5 minutes · Easy</span>
        </div>

        <div className="space-y-2">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900">
            Memory Match & Object Quiz
          </h2>
          <p className="text-xl text-stone-700">
            Exercise your wonderful mind with familiar household and regional items.
          </p>
        </div>

        <button
          onClick={() => setActiveTab('play')}
          className="w-full sm:w-auto px-8 py-4 bg-emerald-600 text-white text-xl font-bold rounded-2xl shadow-xl hover:bg-emerald-700 transition-all flex items-center justify-center space-x-3"
        >
          <span>Start Playing</span>
          <ArrowRight className="w-6 h-6" />
        </button>
      </div>

      {/* Grid: Family Connection & Quick Reminders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Family Connection Quest Card ❤️ */}
        <div className="bg-white border-2 border-rose-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="bg-rose-100 text-rose-900 px-3 py-1 rounded-full text-xs font-bold">
                ❤️ Today's Connection
              </span>
              <span className="text-2xl">👨‍👩‍👧‍👦</span>
            </div>
            <h3 className="text-xl font-bold font-serif text-stone-800">
              {state.connectionQuest.task}
            </h3>
          </div>
          <button
            onClick={() => setActiveTab('home')}
            className="w-full py-3 bg-rose-600 text-white font-bold rounded-2xl hover:bg-rose-700 transition-all flex items-center justify-center space-x-2 shadow-md"
          >
            <span>{state.connectionQuest.completed ? 'Completed Today ✓' : 'Complete Quest ❤️'}</span>
          </button>
        </div>

        {/* Next Urgent Reminder 💊 */}
        <div className="bg-white border-2 border-teal-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="bg-teal-100 text-teal-900 px-3 py-1 rounded-full text-xs font-bold">
                ⏰ Next Reminder
              </span>
              <span className="text-2xl">{nextReminder ? nextReminder.icon : '🌿'}</span>
            </div>
            <div>
              <h3 className="text-xl font-bold font-serif text-stone-800">
                {nextReminder ? nextReminder.title : 'All daily reminders completed!'}
              </h3>
              <p className="text-stone-500 font-medium text-base mt-1">
                {nextReminder ? `Scheduled at ${nextReminder.time}` : 'Wonderful routine today.'}
              </p>
            </div>
          </div>
          {nextReminder && (
            <button
              onClick={() => toggleReminder(nextReminder.id)}
              className="w-full py-3 bg-teal-600 text-white font-bold rounded-2xl hover:bg-teal-700 transition-all flex items-center justify-center space-x-2 shadow-md"
            >
              <span>I Took It ✓</span>
            </button>
          )}
        </div>

      </div>

    </div>
  );
};
