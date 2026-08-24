/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
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

function MainContent() {
  const { state } = useApp();
  const [activeTab, setActiveTab] = useState('home');

  if (!state.profile.onboarded) {
    return <Onboarding />;
  }

  const isElder = state.mode === 'elder';

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900 selection:bg-emerald-200">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

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
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
