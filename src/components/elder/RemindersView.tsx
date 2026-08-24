import React from 'react';
import { useApp } from '../../context/AppContext';
import { Bell, CheckCircle2, Clock, Plus } from 'lucide-react';

export const RemindersView: React.FC = () => {
  const { state, toggleReminder } = useApp();

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8 pb-24">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-cyan-700 text-white rounded-3xl p-8 sm:p-10 shadow-xl space-y-3">
        <span className="bg-white/20 text-teal-50 px-4 py-1.5 rounded-full text-sm font-medium">
          ⏰ Daily Routine & Health
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold">Gentle Reminders</h1>
        <p className="text-xl text-teal-100 max-w-xl">
          Stay refreshed and healthy with timely reminders for your medicines, hydration, and meals.
        </p>
      </div>

      {/* Reminders List */}
      <div className="space-y-4">
        {state.reminders.map((r) => (
          <div
            key={r.id}
            className={`border-2 rounded-3xl p-6 sm:p-8 shadow-sm transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 ${
              r.completedToday
                ? 'bg-emerald-50/60 border-emerald-200'
                : 'bg-white border-stone-200 hover:border-teal-300'
            }`}
          >
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-stone-100 rounded-2xl flex items-center justify-center text-3xl shadow-inner shrink-0">
                {r.icon}
              </div>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold uppercase tracking-wider bg-teal-100 text-teal-900 px-2.5 py-0.5 rounded-md">
                    {r.type}
                  </span>
                  <span className="text-sm font-semibold text-stone-500 flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{r.time}</span>
                  </span>
                </div>
                <h3 className={`text-2xl font-bold font-serif ${r.completedToday ? 'line-through text-stone-400' : 'text-stone-900'}`}>
                  {r.title}
                </h3>
                {r.notes && <p className="text-stone-600 text-sm">{r.notes}</p>}
              </div>
            </div>

            <button
              onClick={() => toggleReminder(r.id)}
              className={`w-full sm:w-auto px-6 py-4 rounded-2xl font-bold text-lg shadow-md transition-all flex items-center justify-center space-x-2 shrink-0 ${
                r.completedToday
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'bg-teal-600 text-white hover:bg-teal-700'
              }`}
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>{r.completedToday ? 'Completed ✓' : 'I Took It ✓'}</span>
            </button>
          </div>
        ))}
      </div>

    </div>
  );
};
