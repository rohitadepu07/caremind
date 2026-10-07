/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { VoiceAssistant } from './components/VoiceAssistant';
import { Onboarding } from './components/Onboarding';
import { ElderHome } from './components/elder/ElderHome';
import { MemoryGardenView } from './components/elder/MemoryGardenView';
import { ConnectionQuestView } from './components/elder/ConnectionQuestView';
import { GamesHub } from './components/elder/GamesHub';
import { RemindersView } from './components/elder/RemindersView';
import { MemoryJournalView } from './components/elder/MemoryJournalView';
import { ProfileView } from './components/elder/ProfileView';
import { CaregiverDashboard } from './components/caregiver/CaregiverDashboard';
import { SplashScreen } from './components/SplashScreen';
import { LoginPage } from './components/LoginPage';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from './lib/supabase';

function MainContent({ onSignOut, authError }: { onSignOut?: () => void; authError: string | null }) {
  const { state, dataSyncError, isDataLoading } = useApp();
  const [activeTab, setActiveTab] = useState('home');

  if (isDataLoading) {
    return <div className="flex min-h-screen items-center justify-center text-emerald-900">Loading your CareMind data…</div>;
  }

  if (!state.profile.onboarded) {
    return <Onboarding />;
  }

  const isElder = state.mode === 'elder';

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900 selection:bg-emerald-200 pb-20 lg:pb-0">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} onSignOut={onSignOut} />

      {dataSyncError && (
        <div role="status" className="mx-auto mt-3 max-w-5xl rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950">
          {dataSyncError}
        </div>
      )}
      {authError && (
        <div role="alert" className="mx-auto mt-3 max-w-5xl rounded-xl border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-950">
          {authError}
        </div>
      )}

      <main>
        {isElder ? (
          <>
            {activeTab === 'home' && <ElderHome setActiveTab={setActiveTab} />}
            {activeTab === 'play' && <GamesHub onBackToHome={() => setActiveTab('home')} />}
            {activeTab === 'garden' && <MemoryGardenView />}
            {activeTab === 'memories' && <MemoryJournalView />}
            {activeTab === 'profile' && <ProfileView />}
          </>
        ) : (
          <CaregiverDashboard activeTab={activeTab} setActiveTab={setActiveTab} />
        )}
      </main>

      <VoiceAssistant />
    </div>
  );
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [enteredApp, setEnteredApp] = useState(false);
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(Boolean(supabase));
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) return;

    let isActive = true;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session: Session | null) => {
      setAuthUser(session?.user ?? null);
      if (event === 'PASSWORD_RECOVERY') setIsPasswordRecovery(true);
      if (event === 'USER_UPDATED' || event === 'SIGNED_OUT') setIsPasswordRecovery(false);
      setAuthError(null);
      setAuthLoading(false);
    });

    void supabase.auth.getSession().then(({ data, error }) => {
      if (error) throw error;
      if (isActive) {
        setAuthUser(data.session?.user ?? null);
        setAuthLoading(false);
      }
    }).catch((error: unknown) => {
      console.error('Failed to restore Supabase session', error);
      if (isActive) {
        setAuthError('Could not restore your Supabase session. Please sign in again.');
        setAuthLoading(false);
      }
    });

    return () => {
      isActive = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    if (!supabase) {
      setEnteredApp(false);
      return;
    }
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Failed to sign out', error);
      setAuthError('Could not sign out. Please try again.');
      return;
    }
    setAuthError(null);
    setEnteredApp(false);
  };

  return (
    <AppProvider userId={authUser?.id}>
      {showSplash && <SplashScreen onFinished={() => setShowSplash(false)} />}
      {!showSplash && authLoading && <div className="flex min-h-screen items-center justify-center text-emerald-900">Checking your session…</div>}
      {!showSplash && !authLoading && isPasswordRecovery && (
        <LoginPage
          onContinueAsGuest={() => setEnteredApp(true)}
          isPasswordRecovery
          onPasswordUpdated={() => setIsPasswordRecovery(false)}
        />
      )}
      {!showSplash && !authLoading && !isPasswordRecovery && !authUser && !enteredApp && (
        <LoginPage onContinueAsGuest={() => setEnteredApp(true)} initialMessage={authError ?? undefined} />
      )}
      {!showSplash && !authLoading && !isPasswordRecovery && (authUser || enteredApp) && (
        <MainContent onSignOut={authUser ? () => void handleSignOut() : undefined} authError={authUser ? authError : null} />
      )}
    </AppProvider>
  );
}
