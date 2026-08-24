import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, ArrowRight, CheckCircle2, Flame, Heart, Bell, Calendar } from 'lucide-react';
import logo from '../../assets/logo.png';
import { t } from '../../translations';

interface ElderHomeProps {
  setActiveTab: (tab: string) => void;
}

export const ElderHome: React.FC<ElderHomeProps> = ({ setActiveTab }) => {
  const { state, toggleReminder } = useApp();
  const profile = state.profile;
  const lang = profile.language;

  // PWA Installation State
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // If already in standalone PWA mode, don't show install button
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstallable(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User install outcome: ${outcome}`);
    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
  const showIOSInstall = isIOS && !isStandalone;

  // Find next uncompleted reminder
  const nextReminder = state.reminders.find((r) => !r.completedToday);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 pb-24">

      {/* Greeting Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-3xl p-8 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="absolute right-[-20px] bottom-[-20px] text-9xl opacity-10 select-none">🌸</div>
        <div className="relative z-10 space-y-3">
          <span className="bg-white/20 text-emerald-50 px-4 py-1.5 rounded-full text-sm font-medium tracking-wide">
            {t('peaceful_morning', lang)}
          </span>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight">
            {t('good_morning', lang)}, {profile.name.replace('Grandma ', '')} 👋
          </h1>
          <p className="text-xl text-emerald-100 max-w-xl font-serif">
            {t('morning_quote', lang)}
          </p>
        </div>
      </div>

      {/* Streak Tracker Card 🔥 */}
      <div className="bg-white border-2 border-amber-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">🔥</span>
            <div>
              <h3 className="text-2xl font-bold font-serif text-stone-800">
                {state.streakCount} {t('day_streak', lang)}
              </h3>
              <p className="text-emerald-700 font-medium">{t('doing_wonderfully', lang)}</p>
            </div>
          </div>
          {state.streakCount >= 7 && (
            <button
              onClick={() => setActiveTab('profile')}
              className="bg-amber-100 text-amber-900 border border-amber-300 px-4 py-2 rounded-2xl text-sm font-bold hover:bg-amber-200 transition-all flex items-center space-x-2"
            >
              <span>{t('view_wish_card', lang)}</span>
            </button>
          )}
        </div>

        {/* 7-day progress row */}
        <div className="grid grid-cols-7 gap-2 pt-2 border-t border-stone-100">
          {state.streakHistory.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center space-y-1.5">
              <span className="text-xs font-bold text-stone-500">{item.day}</span>
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center text-lg font-bold shadow-sm ${item.completed
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
            {t('todays_brain_activity', lang)}
          </span>
          <span className="text-sm font-semibold text-stone-500">{t('easy_duration', lang)}</span>
        </div>

        <div className="space-y-2">
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-stone-900">
            {t('memory_match_title', lang)}
          </h2>
          <p className="text-xl text-stone-700">
            {t('memory_match_desc', lang)}
          </p>
        </div>

        <button
          onClick={() => setActiveTab('play')}
          className="w-full sm:w-auto px-8 py-4 bg-emerald-600 text-white text-xl font-bold rounded-2xl shadow-xl hover:bg-emerald-700 transition-all flex items-center justify-center space-x-3"
        >
          <span>{t('start_playing', lang)}</span>
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
                {t('todays_connection', lang)}
              </span>
              <span className="text-2xl">👨‍👩‍👧‍👦</span>
            </div>
            <h3 className="text-xl font-bold font-serif text-stone-800">
              {t('quest_task', lang)}
            </h3>
          </div>
          <button
            onClick={() => setActiveTab('home')}
            className="w-full py-3 bg-rose-600 text-white font-bold rounded-2xl hover:bg-rose-700 transition-all flex items-center justify-center space-x-2 shadow-md"
          >
            <span>{state.connectionQuest.completed ? t('completed_today', lang) : t('complete_quest', lang)}</span>
          </button>
        </div>

        {/* Next Urgent Reminder 💊 */}
        <div className="bg-white border-2 border-teal-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="bg-teal-100 text-teal-900 px-3 py-1 rounded-full text-xs font-bold">
                {t('next_reminder', lang)}
              </span>
              <span className="text-2xl">{nextReminder ? nextReminder.icon : '🌿'}</span>
            </div>
            <div>
              <h3 className="text-xl font-bold font-serif text-stone-800">
                {nextReminder ? nextReminder.title : t('all_reminders_completed', lang)}
              </h3>
              <p className="text-stone-500 font-medium text-base mt-1">
                {nextReminder ? `${t('scheduled_at', lang)} ${nextReminder.time}` : ''}
              </p>
            </div>
          </div>
          {nextReminder && (
            <button
              onClick={() => toggleReminder(nextReminder.id)}
              className="w-full py-3 bg-teal-600 text-white font-bold rounded-2xl hover:bg-teal-700 transition-all flex items-center justify-center space-x-2 shadow-md"
            >
              <span>{t('i_took_it', lang)}</span>
            </button>
          )}
        </div>

      </div>

      {/* Install App Section (PWA) */}
      {(isInstallable || showIOSInstall) && (
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6 border-2 border-emerald-500">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center p-2 shrink-0 shadow-lg">
              <img src={logo} alt="CareMind Logo" className="w-full h-full object-contain rounded-xl" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-serif">{t('install_caremind', lang)}</h3>
              <p className="text-emerald-100 text-sm max-w-md mt-1">
                {showIOSInstall
                  ? t('install_ios_desc', lang)
                  : t('install_desc', lang)}
              </p>
            </div>
          </div>
          {isInstallable && (
            <button
              onClick={handleInstallClick}
              className="w-full sm:w-auto px-6 py-3.5 bg-amber-400 text-stone-900 font-bold rounded-2xl hover:bg-amber-300 transition-all flex items-center justify-center space-x-2 shrink-0 shadow-md text-base"
            >
              <span>{t('install_btn', lang)}</span>
            </button>
          )}
        </div>
      )}

    </div>
  );
};
