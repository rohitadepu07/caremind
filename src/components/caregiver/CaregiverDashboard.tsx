import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Reminder } from '../../types';
import { Shield, Bell, AlertTriangle, TrendingUp, Calendar, CheckCircle2, Plus, Trash2, Activity, Heart } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, CartesianGrid } from 'recharts';

interface CaregiverDashboardProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const CaregiverDashboard: React.FC<CaregiverDashboardProps> = ({ activeTab, setActiveTab }) => {
  const { state, addReminder, deleteReminder, dismissAlert } = useApp();
  const [newTitle, setNewTitle] = useState('');
  const [newTime, setNewTime] = useState('09:00 AM');
  const [newType, setNewType] = useState<Reminder['type']>('medicine');
  const [newNotes, setNewNotes] = useState('');
  const [showAddReminder, setShowAddReminder] = useState(false);

  const performanceData = [
    { day: 'Mon', score: 85, attention: 90 },
    { day: 'Tue', score: 88, attention: 85 },
    { day: 'Wed', score: 92, attention: 95 },
    { day: 'Thu', score: 90, attention: 88 },
    { day: 'Fri', score: 95, attention: 92 },
    { day: 'Sat', score: 89, attention: 86 },
    { day: 'Sun', score: 94, attention: 90 },
  ];

  const handleAddReminderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    addReminder({
      title: newTitle.trim(),
      time: newTime,
      type: newType,
      icon: newType === 'medicine' ? '💊' : newType === 'hydration' ? '🥥' : '🌿',
      notes: newNotes.trim(),
    });
    setNewTitle('');
    setNewNotes('');
    setShowAddReminder(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 pb-24">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-stone-900 to-emerald-950 text-white rounded-3xl p-8 sm:p-10 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-3">
          <span className="bg-emerald-500/20 text-emerald-300 px-4 py-1.5 rounded-full text-sm font-medium border border-emerald-500/30">
            🛡️ Caregiver & Family Dashboard
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold">
            Monitoring {state.profile.name}
          </h1>
          <p className="text-xl text-stone-300">
            Real-time engagement, cognitive progress, and routine wellness tracking.
          </p>
        </div>
        <div className="flex items-center space-x-3 bg-white/10 px-6 py-4 rounded-2xl backdrop-blur-md">
          <div className="text-3xl">🔥</div>
          <div>
            <div className="text-2xl font-bold">{state.streakCount} Days</div>
            <div className="text-xs text-emerald-300">Active Streak</div>
          </div>
        </div>
      </div>

      {/* Sub Navigation for Caregiver Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-stone-200 pb-4">
        {[
          { id: 'overview', label: 'Overview', icon: '📊' },
          { id: 'activity', label: 'Activity History', icon: '📋' },
          { id: 'progress', label: 'Cognitive Analytics', icon: '📈' },
          { id: 'reminders', label: 'Manage Reminders', icon: '⏰' },
          { id: 'alerts', label: 'Alerts', icon: '⚠️' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-5 py-3 rounded-2xl font-bold text-base transition-all ${
              activeTab === tab.id
                ? 'bg-emerald-700 text-white shadow-md'
                : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* OVERVIEW TAB */}
      {(activeTab === 'overview' || activeTab === 'settings') && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm space-y-2">
            <span className="text-xs font-bold text-stone-400 uppercase">Today's Cognitive Activity</span>
            <div className="text-2xl font-serif font-bold text-emerald-800">
              {state.gameHistory.length > 0 ? state.gameHistory[0].gameName : 'Pending'}
            </div>
            <p className="text-sm text-stone-500">Completed successfully today</p>
          </div>

          <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm space-y-2">
            <span className="text-xs font-bold text-stone-400 uppercase">Reminders Confirmed</span>
            <div className="text-2xl font-serif font-bold text-teal-800">
              {state.reminders.filter((r) => r.completedToday).length} / {state.reminders.length}
            </div>
            <p className="text-sm text-stone-500">All morning routines on track</p>
          </div>

          <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm space-y-2">
            <span className="text-xs font-bold text-stone-400 uppercase">Memory Garden Health</span>
            <div className="text-2xl font-serif font-bold text-amber-800">
              {state.gardenPlants.length} Blooming Plants 🌱
            </div>
            <p className="text-sm text-stone-500">Consistent engagement detected</p>
          </div>
        </div>
      )}

      {/* PROGRESS / ANALYTICS TAB */}
      {activeTab === 'progress' && (
        <div className="bg-white border border-stone-200 rounded-3xl p-8 shadow-sm space-y-8">
          <div>
            <h3 className="text-2xl font-serif font-bold text-stone-900">Weekly Cognitive & Attention Performance</h3>
            <p className="text-stone-500">Performance trends over the last 7 days.</p>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" stroke="#888" />
                <YAxis stroke="#888" domain={[60, 100]} />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="#059669" strokeWidth={3} name="Memory Score" />
                <Line type="monotone" dataKey="attention" stroke="#d97706" strokeWidth={3} name="Attention Score" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* ACTIVITY HISTORY TAB */}
      {activeTab === 'activity' && (
        <div className="bg-white border border-stone-200 rounded-3xl p-8 shadow-sm space-y-6">
          <h3 className="text-2xl font-serif font-bold text-stone-900">Recent Game & Activity History</h3>
          <div className="space-y-4">
            {state.gameHistory.map((g, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-stone-50 rounded-2xl border border-stone-100">
                <div className="space-y-1">
                  <div className="font-bold text-stone-800 text-lg">{g.gameName}</div>
                  <div className="text-xs text-stone-500">{g.timestamp} · Difficulty: {g.difficulty}</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-emerald-700">Score: {g.score}/{g.maxScore}</div>
                  <div className="text-xs text-stone-400">Duration: {g.timeSpentSeconds}s</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* REMINDERS MANAGEMENT TAB */}
      {activeTab === 'reminders' && (
        <div className="bg-white border border-stone-200 rounded-3xl p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-serif font-bold text-stone-900">Manage Patient Reminders</h3>
            <button
              onClick={() => setShowAddReminder(true)}
              className="px-5 py-3 bg-emerald-700 text-white rounded-2xl font-bold hover:bg-emerald-800 flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Add Reminder</span>
            </button>
          </div>

          {showAddReminder && (
            <form onSubmit={handleAddReminderSubmit} className="bg-emerald-50 border border-emerald-200 p-6 rounded-3xl space-y-4">
              <h4 className="font-bold text-emerald-950 text-xl font-serif">Create New Reminder</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Title</label>
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. Afternoon Blood Pressure Tablet"
                    className="w-full p-3 border rounded-xl bg-white"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Time</label>
                  <input
                    type="text"
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    placeholder="02:00 PM"
                    className="w-full p-3 border rounded-xl bg-white"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Type</label>
                  <select
                    value={newType}
                    onChange={(e: any) => setNewType(e.target.value)}
                    className="w-full p-3 border rounded-xl bg-white"
                  >
                    <option value="medicine">Medicine</option>
                    <option value="hydration">Hydration</option>
                    <option value="meal">Meal</option>
                    <option value="activity">Activity</option>
                  </select>
                </div>
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Notes</label>
                  <input
                    type="text"
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    placeholder="Take with warm water"
                    className="w-full p-3 border rounded-xl bg-white"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddReminder(false)}
                  className="px-5 py-2.5 bg-stone-200 text-stone-700 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-emerald-700 text-white rounded-xl font-bold shadow-md"
                >
                  Save Reminder
                </button>
              </div>
            </form>
          )}

          <div className="space-y-4">
            {state.reminders.map((r) => (
              <div key={r.id} className="flex items-center justify-between p-4 bg-stone-50 rounded-2xl border border-stone-200">
                <div className="flex items-center space-x-4">
                  <span className="text-3xl">{r.icon}</span>
                  <div>
                    <h4 className="font-bold text-stone-900 text-lg">{r.title}</h4>
                    <p className="text-sm text-stone-500">{r.time} · {r.type} {r.notes ? `· ${r.notes}` : ''}</p>
                  </div>
                </div>
                <button
                  onClick={() => deleteReminder(r.id)}
                  className="text-rose-600 hover:text-rose-800 p-2 rounded-xl hover:bg-rose-50"
                  title="Delete Reminder"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ALERTS TAB */}
      {activeTab === 'alerts' && (
        <div className="bg-white border border-stone-200 rounded-3xl p-8 shadow-sm space-y-6">
          <h3 className="text-2xl font-serif font-bold text-stone-900">Caregiver Alerts & Notifications</h3>
          <div className="space-y-4">
            {state.alerts.map((alt) => (
              <div
                key={alt.id}
                className={`p-5 rounded-2xl border flex items-center justify-between ${
                  alt.level === 'warning'
                    ? 'bg-amber-50 border-amber-200 text-amber-900'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{alt.level === 'warning' ? '⚠️' : 'ℹ️'}</span>
                  <div>
                    <div className="font-bold text-lg">{alt.message}</div>
                    <div className="text-xs opacity-75">{alt.timestamp}</div>
                  </div>
                </div>
                {!alt.acknowledged && (
                  <button
                    onClick={() => dismissAlert(alt.id)}
                    className="px-4 py-2 bg-white rounded-xl text-sm font-bold shadow-sm hover:bg-stone-100"
                  >
                    Acknowledge
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
