import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Volume2, X, Sparkles, Send, Mic, Heart } from 'lucide-react';

export const VoiceAssistant: React.FC = () => {
  const { state, setVoiceActive, speak, askAI } = useApp();
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatLog, setChatLog] = useState<{ sender: 'ai' | 'user'; text: string }[]>([
    {
      sender: 'ai',
      text: `Good day, ${state.profile.name}! I am Sneh, your companion. Would you like to play today's gentle memory game or listen to a soothing reminder?`,
    },
  ]);

  if (!state.isVoiceActive) {
    return (
      <button
        onClick={() => {
          setVoiceActive(true);
          speak('Hello! I am here with you. How are you feeling today?');
        }}
        className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white p-4 rounded-full shadow-2xl hover:bg-emerald-700 transition-all flex items-center space-x-2 border-2 border-white"
        title="Open Sneh Voice Companion"
      >
        <span className="text-2xl animate-bounce">🌸</span>
        <span className="font-bold text-lg hidden sm:inline">Talk to Sneh</span>
      </button>
    );
  }

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim()) return;

    const userText = inputMessage;
    setInputMessage('');
    setChatLog((prev) => [...prev, { sender: 'user', text: userText }]);
    setLoading(true);

    const aiReply = await askAI(userText);
    setChatLog((prev) => [...prev, { sender: 'ai', text: aiReply }]);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-amber-50/95 border-2 border-emerald-200 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="bg-emerald-700 text-white p-5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-3xl">
              🌸
            </div>
            <div>
              <h3 className="text-2xl font-bold font-serif">Sneh Voice Companion</h3>
              <p className="text-emerald-100 text-sm">Always here to listen and encourage</p>
            </div>
          </div>
          <button
            onClick={() => setVoiceActive(false)}
            className="text-white/80 hover:text-white p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-all"
            title="Close Assistant"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {chatLog.map((msg, idx) => (
            <div
              key={idx}
              className={`flex items-start space-x-3 ${
                msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
              }`}
            >
              <div
                className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xl shrink-0 ${
                  msg.sender === 'user' ? 'bg-amber-600 text-white' : 'bg-emerald-600 text-white'
                }`}
              >
                {msg.sender === 'user' ? '👤' : '🌸'}
              </div>
              <div
                className={`p-4 rounded-2xl max-w-[80%]:text-lg shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-amber-600 text-white rounded-tr-none'
                    : 'bg-white text-stone-800 border border-emerald-100 rounded-tl-none text-xl font-serif'
                }`}
              >
                <p>{msg.text}</p>
                {msg.sender === 'ai' && (
                  <button
                    onClick={() => speak(msg.text)}
                    className="mt-2 text-xs text-emerald-600 hover:text-emerald-800 flex items-center space-x-1 font-sans font-semibold bg-emerald-50 px-2.5 py-1 rounded-lg w-fit"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Read Aloud</span>
                  </button>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white flex items-center justify-center text-xl">
                🌸
              </div>
              <div className="bg-white p-4 rounded-2xl border border-emerald-100 text-stone-500 animate-pulse">
                Sneh is thinking gently...
              </div>
            </div>
          )}
        </div>

        {/* Quick Suggestion Pills */}
        <div className="px-6 py-2 bg-amber-100/50 flex flex-wrap gap-2 border-t border-amber-200">
          <button
            onClick={() => {
              setInputMessage("What is today's memory game?");
            }}
            className="bg-white text-amber-900 border border-amber-300 px-3 py-1.5 rounded-xl text-sm font-medium hover:bg-amber-50 transition-all"
          >
            🧠 Game guidance
          </button>
          <button
            onClick={() => {
              setInputMessage("Tell me a comforting thought.");
            }}
            className="bg-white text-amber-900 border border-amber-300 px-3 py-1.5 rounded-xl text-sm font-medium hover:bg-amber-50 transition-all"
          >
            💬 Comforting thought
          </button>
          <button
            onClick={() => {
              setInputMessage("What medicines do I have today?");
            }}
            className="bg-white text-amber-900 border border-amber-300 px-3 py-1.5 rounded-xl text-sm font-medium hover:bg-amber-50 transition-all"
          >
            💊 Medicine reminders
          </button>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSend} className="p-4 bg-white border-t border-stone-200 flex items-center space-x-3">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type or ask Sneh anything..."
            className="flex-1 bg-stone-100 border border-stone-300 rounded-2xl px-4 py-3 text-lg text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            type="submit"
            disabled={loading || !inputMessage.trim()}
            className="bg-emerald-600 text-white p-3.5 rounded-2xl hover:bg-emerald-700 transition-all disabled:opacity-50"
          >
            <Send className="w-6 h-6" />
          </button>
        </form>

      </div>
    </div>
  );
};
