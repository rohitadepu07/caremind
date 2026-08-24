import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Volume2, Shield, User } from 'lucide-react';
import logo from '../assets/logo.png';
import { t } from '../translations';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

function useIsDesktop() {
  const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= 1024);
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener('change', handler);
    setIsDesktop(mq.matches);
    return () => mq.removeEventListener('change', handler);
  }, []);
  return isDesktop;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const { state, setMode, speak, setVoiceActive, updateProfile } = useApp();
  const isElder = state.mode === 'elder';
  const isDesktop = useIsDesktop();
  const lang = state.profile.language;

  const elderTabs = [
    { id: 'home', label: t('home', lang), icon: '🏠' },
    { id: 'play', label: t('play', lang), icon: '🧠' },
    { id: 'garden', label: t('garden', lang), icon: '🌱' },
    { id: 'memories', label: t('memories', lang), icon: '💭' },
    { id: 'profile', label: t('profile', lang), icon: '👤' },
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

  const handleTabClick = (tab: { id: string; label: string }) => {
    setActiveTab(tab.id);
    speak(tab.label);
  };

  return (
    <>
      {/* ── Top Header: Logo + Controls (always visible) ── */}
      <header
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 40,
          backgroundColor: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid #fde68a',
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
        }}
      >
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 72 }}>

            {/* Logo */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <img
                src={logo}
                alt="CareMind Logo"
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 14,
                  objectFit: 'cover',
                  boxShadow: '0 2px 6px rgba(16,185,129,0.2)',
                }}
              />
              <span style={{ fontSize: 24, fontWeight: 800, color: '#064e3b', fontFamily: 'serif', letterSpacing: '0.3px' }}>
                {t('app_name', lang)}
              </span>
            </div>

            {/* Desktop: Nav Tabs in top bar */}
            {isDesktop && (
              <nav style={{
                display: 'flex', alignItems: 'center', gap: 4,
                backgroundColor: '#f5f5f4', padding: '6px',
                borderRadius: 16,
              }}>
                {tabs.map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleTabClick(tab)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 8,
                        padding: '8px 16px', borderRadius: 12,
                        fontSize: 15, fontWeight: isActive ? 600 : 500,
                        border: 'none', cursor: 'pointer',
                        transition: 'all 0.2s',
                        backgroundColor: isActive ? '#ffffff' : 'transparent',
                        color: isActive ? '#065f46' : '#57534e',
                        boxShadow: isActive ? '0 1px 4px rgba(0,0,0,0.1)' : 'none',
                      }}
                    >
                      <span style={{ fontSize: 18 }}>{tab.icon}</span>
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            )}

            {/* Right Controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {/* Language Selector */}
              <select
                value={state.profile.language}
                onChange={(e) => {
                  const selectedLang = e.target.value;
                  updateProfile({ language: selectedLang as any });
                  const langNames: Record<string, string> = {
                    en: 'English',
                    hi: 'Hindi',
                    bn: 'Bengali',
                    as: 'Assamese',
                  };
                  speak(`Language changed to ${langNames[selectedLang]}`);
                }}
                style={{
                  padding: '8px 6px',
                  borderRadius: 12,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: '1px solid #fcd34d',
                  backgroundColor: '#fffbeb',
                  color: '#92400e',
                  outline: 'none',
                  transition: 'all 0.2s',
                }}
                title="Change Language"
              >
                <option value="en">🌐 EN</option>
                <option value="hi">🇮🇳 HI</option>
                <option value="as">🌾 AS (NER)</option>
                <option value="bn">🌊 BN (NER)</option>
              </select>

              {/* Mode Switcher */}
              <button
                onClick={() => setMode(isElder ? 'caregiver' : 'elder')}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '8px 10px', borderRadius: 12,
                  fontSize: 13, fontWeight: 600, cursor: 'pointer',
                  border: isElder ? '1px solid #fcd34d' : '1px solid #6ee7b7',
                  backgroundColor: isElder ? '#fffbeb' : '#ecfdf5',
                  color: isElder ? '#92400e' : '#065f46',
                  transition: 'all 0.2s',
                }}
                title="Switch Mode"
              >
                {isElder ? <Shield size={15} color="#b45309" /> : <User size={15} color="#065f46" />}
                <span className="hidden sm:inline">
                  {isElder ? t('caregiver', lang) : t('elder', lang)}
                </span>
              </button>

              {/* Voice Button - Desktop Only */}
              {isDesktop && (
                <button
                  onClick={() => setVoiceActive(true)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '9px 12px', borderRadius: 12,
                    backgroundColor: '#059669', color: '#ffffff',
                    border: 'none', cursor: 'pointer',
                    fontSize: 14, fontWeight: 500,
                    boxShadow: '0 2px 8px rgba(5,150,105,0.4)',
                    transition: 'all 0.2s',
                  }}
                  title="Talk to CareMind Assistant"
                >
                  <Volume2 size={18} />
                  <span>{t('assistant', lang)}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ── Bottom Nav Bar: Mobile + Tablet only ── */}
      {!isDesktop && (
        <nav
          style={{
            position: 'fixed',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 50,
            backgroundColor: 'rgba(255,255,255,0.97)',
            backdropFilter: 'blur(16px)',
            borderTop: '1px solid #fde68a',
            boxShadow: '0 -4px 20px rgba(0,0,0,0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-around',
            paddingTop: 8,
            paddingBottom: 'max(8px, env(safe-area-inset-bottom))',
          }}
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabClick(tab)}
                style={{
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  padding: '6px 12px', borderRadius: 16,
                  border: 'none', cursor: 'pointer',
                  backgroundColor: isActive ? '#ecfdf5' : 'transparent',
                  transition: 'all 0.2s',
                  minWidth: 56,
                }}
              >
                <span style={{
                  fontSize: 26,
                  filter: isActive ? 'none' : 'grayscale(30%)',
                  transform: isActive ? 'scale(1.15)' : 'scale(1)',
                  transition: 'transform 0.2s',
                  marginBottom: 2,
                }}>{tab.icon}</span>
                <span style={{
                  fontSize: 11, fontWeight: isActive ? 700 : 500,
                  color: isActive ? '#065f46' : '#78716c',
                  letterSpacing: 0.2,
                }}>{tab.label}</span>
                {isActive && (
                  <span style={{
                    width: 4, height: 4, borderRadius: '50%',
                    backgroundColor: '#059669',
                    marginTop: 3,
                  }} />
                )}
              </button>
            );
          })}
        </nav>
      )}
    </>
  );
};
