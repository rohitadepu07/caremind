import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Language } from '../types';
import { Sparkles, ArrowRight, Heart, Volume2, Shield } from 'lucide-react';

export const Onboarding: React.FC = () => {
  const { state, updateProfile, speak } = useApp();
  const [step, setStep] = useState(1);
  const [nameInput, setNameInput] = useState(state.profile.name);
  const [langInput, setLangInput] = useState<Language>(state.profile.language);
  const [voicePref, setVoicePref] = useState(state.profile.voiceAssistance);

  const handleFinish = () => {
    updateProfile({
      name: nameInput.trim() || 'Grandma Lakshmi Devi',
      language: langInput,
      voiceAssistance: voicePref,
      onboarded: true,
    });
    speak(`Welcome to CareMind, ${nameInput}. Let's make today a beautiful day.`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-emerald-50 flex items-center justify-center p-4">
      <div className="bg-white border-2 border-emerald-100 max-w-xl w-full rounded-3xl shadow-2xl p-8 sm:p-10 space-y-8">

        {/* Step Indicator */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center text-white text-3xl shadow-md">
              🌸
            </div>
            <div>
              <h1 className="text-2xl font-bold font-serif text-emerald-950">CareMind Companion</h1>
              <p className="text-sm text-stone-500">Step {step} of 3</p>
            </div>
          </div>
          <div className="flex space-x-1.5">
            <div className={`w-3 h-3 rounded-full ${step >= 1 ? 'bg-emerald-600' : 'bg-stone-200'}`} />
            <div className={`w-3 h-3 rounded-full ${step >= 2 ? 'bg-emerald-600' : 'bg-stone-200'}`} />
            <div className={`w-3 h-3 rounded-full ${step >= 3 ? 'bg-emerald-600' : 'bg-stone-200'}`} />
          </div>
        </div>

        {/* Step 1: Welcome */}
        {step === 1 && (
          <div className="space-y-6 text-center py-4">
            <div className="text-6xl mb-2">🌿</div>
            <h2 className="text-3xl font-serif font-bold text-stone-800">Welcome to CareMind 🌼</h2>
            <p className="text-xl text-stone-600 leading-relaxed max-w-md mx-auto">
              Let's spend a few happy moments together every day with gentle cognitive games, loving reminders, and memories.
            </p>
            <button
              onClick={() => {
                setStep(2);
                speak("What should we call you?");
              }}
              className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold text-xl hover:bg-emerald-700 transition-all shadow-lg flex items-center justify-center space-x-3"
            >
              <span>Let's Begin</span>
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        )}

        {/* Step 2: Name & Language */}
        {step === 2 && (
          <div className="space-y-6 py-2">
            <h2 className="text-2xl font-serif font-bold text-stone-800 text-center">What should we call you?</h2>
            <div>
              <label className="block text-stone-700 font-semibold mb-2 text-lg">Your Name or Preferred Title</label>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="w-full p-4 border-2 border-stone-300 rounded-2xl text-xl text-stone-800 focus:outline-none focus:border-emerald-600"
                placeholder="e.g., Grandma Lakshmi Devi"
              />
            </div>

            <div>
              <label className="block text-stone-700 font-semibold mb-2 text-lg">Choose Your Language</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { code: 'en', label: 'English', sub: 'English' },
                  { code: 'hi', label: 'हिन्दी', sub: 'Hindi' },
                  { code: 'bn', label: 'বাংলা', sub: 'Bengali' },
                  { code: 'as', label: 'অসমীয়া', sub: 'Assamese' },
                ].map((l) => (
                  <button
                    key={l.code}
                    onClick={() => setLangInput(l.code as Language)}
                    className={`p-4 rounded-2xl border-2 text-left transition-all ${langInput === l.code
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold'
                        : 'border-stone-200 bg-stone-50 text-stone-700 hover:border-emerald-300'
                      }`}
                  >
                    <div className="text-lg font-serif">{l.label}</div>
                    <div className="text-xs text-stone-500">{l.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                setStep(3);
                speak("Almost ready!");
              }}
              className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold text-xl hover:bg-emerald-700 transition-all shadow-lg flex items-center justify-center space-x-3"
            >
              <span>Continue</span>
              <ArrowRight className="w-6 h-6" />
            </button>
          </div>
        )}

        {/* Step 3: Preferences */}
        {step === 3 && (
          <div className="space-y-6 py-2">
            <h2 className="text-2xl font-serif font-bold text-stone-800 text-center">Comfort Preferences</h2>

            <div className="bg-amber-50 p-6 rounded-2xl border border-amber-200 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Volume2 className="w-7 h-7 text-emerald-700" />
                  <div>
                    <h3 className="font-bold text-stone-800 text-lg">Voice Assistance</h3>
                    <p className="text-sm text-stone-600">Hear instructions and greetings aloud</p>
                  </div>
                </div>
                <input
                  type="checkbox"
                  checked={voicePref}
                  onChange={(e) => setVoicePref(e.target.checked)}
                  className="w-7 h-7 accent-emerald-600 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            <button
              onClick={handleFinish}
              className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold text-xl hover:bg-emerald-700 transition-all shadow-lg flex items-center justify-center space-x-3"
            >
              <span>Start My Day 🌸</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
