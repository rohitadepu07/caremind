import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, User, Globe, Volume2, Shield, Star, Check } from 'lucide-react';

export const ProfileView: React.FC = () => {
  const { state, updateProfile, saveWishCard, resetOnboarding } = useApp();
  const profile = state.profile;
  const [wishInput, setWishInput] = useState(state.wishCardContent);
  const [savedWish, setSavedWish] = useState(false);

  const handleSaveWish = (e: React.FormEvent) => {
    e.preventDefault();
    if (!wishInput.trim()) return;
    saveWishCard(wishInput.trim());
    setSavedWish(true);
    setTimeout(() => setSavedWish(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8 pb-24">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-700 text-white rounded-3xl p-8 sm:p-10 shadow-xl space-y-3">
        <span className="bg-white/20 text-amber-50 px-4 py-1.5 rounded-full text-sm font-medium">
          👤 Patient Profile
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold">{profile.name}</h1>
        <p className="text-xl text-amber-100">
          {profile.age} years old · {profile.location}
        </p>
      </div>

      {/* 🌟 My Wish Card (Unlocked at 7-day streak or always available for demo/exploration) */}
      <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-300 rounded-3xl p-8 sm:p-10 shadow-lg space-y-6">
        <div className="flex items-center space-x-3">
          <span className="text-4xl">🌟</span>
          <div>
            <h2 className="text-2xl font-serif font-bold text-amber-950">My Wish Card</h2>
            <p className="text-amber-900 text-sm">Write a wish, thought, or personal goal to keep close to your heart.</p>
          </div>
        </div>

        <form onSubmit={handleSaveWish} className="space-y-4">
          <textarea
            rows={4}
            value={wishInput}
            onChange={(e) => setWishInput(e.target.value)}
            placeholder="What would you like to remember or wish for today?"
            className="w-full p-4 border border-amber-300 rounded-2xl text-lg text-stone-800 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-inner"
          />

          <div className="flex items-center justify-between">
            {savedWish && (
              <span className="text-emerald-700 font-bold flex items-center space-x-1">
                <Check className="w-5 h-5" />
                <span>Saved to your Memory Journal!</span>
              </span>
            )}
            <button
              type="submit"
              className="px-8 py-4 bg-amber-700 text-white rounded-2xl font-bold text-lg hover:bg-amber-800 shadow-md ml-auto flex items-center space-x-2"
            >
              <span>Save Wish Card ✨</span>
            </button>
          </div>
        </form>
      </div>

      {/* Preferences Card */}
      <div className="bg-white border-2 border-stone-200 rounded-3xl p-8 shadow-sm space-y-6">
        <h3 className="text-2xl font-serif font-bold text-stone-900">Companion Settings</h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-stone-50 rounded-2xl">
            <div className="flex items-center space-x-3">
              <Volume2 className="w-6 h-6 text-emerald-700" />
              <div>
                <h4 className="font-bold text-stone-800 text-lg">Voice Assistance</h4>
                <p className="text-sm text-stone-500">Read instructions and buttons aloud</p>
              </div>
            </div>
            <input
              type="checkbox"
              checked={profile.voiceAssistance}
              onChange={(e) => updateProfile({ voiceAssistance: e.target.checked })}
              className="w-6 h-6 accent-emerald-600 rounded-lg cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-stone-50 rounded-2xl">
            <div className="flex items-center space-x-3">
              <Globe className="w-6 h-6 text-teal-700" />
              <div>
                <h4 className="font-bold text-stone-800 text-lg">Language</h4>
                <p className="text-sm text-stone-500">Current: {profile.language.toUpperCase()}</p>
              </div>
            </div>
            <select
              value={profile.language}
              onChange={(e: any) => updateProfile({ language: e.target.value })}
              className="p-3 bg-white border border-stone-300 rounded-xl font-bold text-stone-800"
            >
              <option value="en">English</option>
              <option value="hi">Hindi (हिन्दी)</option>
              <option value="bn">Bengali (বাংলা)</option>
              <option value="as">Assamese (অসমীয়া)</option>
            </select>
          </div>
        </div>

        <div className="pt-4 border-t border-stone-100 flex justify-between">
          <button
            onClick={() => resetOnboarding()}
            className="text-stone-500 hover:text-stone-800 font-semibold text-sm"
          >
            Re-run Welcome Onboarding
          </button>
        </div>
      </div>

    </div>
  );
};
