import React from 'react';
import { useApp } from '../context/AppContext';
import { Heart, Sparkles, Volume2, Shield, User, Globe, Moon } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const { state, setMode, speak, setVoiceActive } = useApp();
  const isElder = state.mode === 'elder';

  const elderTabs = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'play', label: 'Play', icon: '🧠' },
    { id: 'garden', label: 'Garden', icon: '🌱' },
    { id: 'memories', label: 'Memories', icon: '💭' },
    { id: 'profile', label: 'Profile', icon: '👤' },
  ];

  const caregiverTabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'activity', label: 'Activity', icon: '📋' },
    { id: 'progress', label: 'Progress', icon: '📈' },
    { id: 'reminders', label: 'Reminders', icon: '⏰' },
    { id: 'alerts', label: 'Alerts', icon: '⚠️' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  const tabs = isElder ? elderTabs : caregiverTabs;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Companion Name */}
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center text-white text-2xl shadow-md">
              🌸
            </div>
            <div>
              <span className="text-2xl font-bold tracking-tight text-emerald-900 font-serif">
                Sneh <span className="text-sm font-sans font-normal text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full ml-1">Companion</span>
              </span>
              <p className="text-xs text-stone-500 hidden sm:block">Gentle Cognitive Care & Memories</p>
            </div>
          </div>

          {/* Center Navigation (Elder or Caregiver tabs) */}
          <nav className="hidden md:flex items-center space-x-1 bg-stone-100 p-1.5 rounded-2xl">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    speak(tab.label);
                  }}
                  className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-base font-medium transition-all ${
                    isActive
                      ? 'bg-white text-emerald-800 shadow-sm font-semibold'
                      : 'text-stone-600 hover:text-emerald-800 hover:bg-white/50'
                  }`}
                >
                  <span className="text-lg">{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Controls */}
          <div className="flex items-center space-x-3">
            
            {/* Mode Switcher */}
            <button
              onClick={() => setMode(isElder ? 'caregiver' : 'elder')}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm ${
                isElder
                  ? 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
              }`}
              title="Switch Mode"
            >
              {isElder ? (
                <>
                  <Shield className="w-4 h-4 text-amber-700" />
                  <span>Caregiver Mode</span>
                </>
              ) : (
                <>
                  <User className="w-4 h-4 text-emerald-700" />
                  <span>Elder Mode</span>
                </>
              )}
            </button>

            {/* Voice Companion Button */}
            <button
              onClick={() => setVoiceActive(true)}
              className="p-3 bg-emerald-600 text-white rounded-xl shadow-md hover:bg-emerald-700 transition-all flex items-center space-x-1"
              title="Talk to Sneh Assistant"
            >
              <Volume2 className="w-5 h-5 animate-pulse" />
              <span className="text-sm font-medium hidden lg:inline">Assistant</span>
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Bottom Bar Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-amber-200 shadow-lg py-2 px-3 flex items-center justify-around">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                speak(tab.label);
              }}
              className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-2xl transition-all ${
                isActive ? 'text-emerald-800 bg-emerald-50 font-bold shadow-sm' : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              <span className="text-2xl mb-0.5">{tab.icon}</span>
              <span className="text-xs">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
