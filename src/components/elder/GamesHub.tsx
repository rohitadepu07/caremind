import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, ArrowRight, RotateCcw, CheckCircle2 } from 'lucide-react';
import { t } from '../../translations';

interface GamesHubProps {
  onBackToHome: () => void;
}

export const GamesHub: React.FC<GamesHubProps> = ({ onBackToHome }) => {
  const { state, completeActivity, speak } = useApp();
  const lang = state.profile.language;
  const [activeGame, setActiveGame] = useState<string | null>(null);

  // Memory Match game state
  const [matchCards, setMatchCards] = useState([
    { id: 1, name: '🍎', matched: false },
    { id: 2, name: '🥭', matched: false },
    { id: 3, name: '🐘', matched: false },
    { id: 4, name: '🫖', matched: false },
    { id: 5, name: '🍎', matched: false },
    { id: 6, name: '🥭', matched: false },
    { id: 7, name: '🐘', matched: false },
    { id: 8, name: '🫖', matched: false },
  ].sort(() => Math.random() - 0.5));
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [gameWon, setGameWon] = useState(false);
  const [startTime, setStartTime] = useState<number>(Date.now());

  // Object recognition game state
  const [objectQuestion, setObjectQuestion] = useState({
    title: 'What is this traditional Indian vessel used for boiling water or tea?',
    options: ['Kettle / Samovar', 'Bucket', 'Cooking Pot', 'Plate'],
    correct: 'Kettle / Samovar',
    emoji: '🫖',
    answered: false,
    correctChosen: false,
  });

  // Pattern recognition game state
  const [patternState, setPatternState] = useState({
    sequence: ['🔴', '🔵', '🔴', '🔵'],
    options: ['🔴', '🔵', '🟡', '🟢'],
    correct: '🔴',
    answered: false,
    correctChosen: false,
  });

  const startMiniGame = (gameId: string) => {
    setActiveGame(gameId);
    setStartTime(Date.now());
    speak(`Starting ${gameId === 'match' ? 'Memory Match' : gameId === 'object' ? 'Object Recognition' : 'Pattern Recognition'}`);
  };

  const handleCardClick = (index: number) => {
    if (matchCards[index].matched || flippedIndices.includes(index) || flippedIndices.length >= 2) return;

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      const [firstIdx, secondIdx] = newFlipped;
      if (matchCards[firstIdx].name === matchCards[secondIdx].name) {
        // Match found
        setTimeout(() => {
          setMatchCards((prev) =>
            prev.map((c, i) => (i === firstIdx || i === secondIdx ? { ...c, matched: true } : c))
          );
          setFlippedIndices([]);
          const allMatched = matchCards.every((c, i) => i === firstIdx || i === secondIdx || c.matched);
          if (allMatched || matchCards.filter((c) => c.matched).length >= 6) {
            setGameWon(true);
            const timeSpent = Math.floor((Date.now() - startTime) / 1000);
            completeActivity('Memory Match', 5, 5, timeSpent);
          }
        }, 500);
      } else {
        setTimeout(() => {
          setFlippedIndices([]);
        }, 1000);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 pb-24">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-emerald-700 text-white rounded-3xl p-8 sm:p-10 shadow-xl space-y-3">
        <span className="bg-white/20 text-teal-50 px-4 py-1.5 rounded-full text-sm font-medium">
          {t('cognitive_play_label', lang)}
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold">{t('games_hub_title', lang)}</h1>
        <p className="text-xl text-teal-100 max-w-xl">
          {t('games_hub_subtitle', lang)}
        </p>
      </div>

      {!activeGame ? (
        /* Game Selection Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Game 1: Memory Match */}
          <div
            onClick={() => startMiniGame('match')}
            className="bg-white border-2 border-teal-200 rounded-3xl p-8 shadow-sm hover:shadow-lg hover:border-teal-400 transition-all cursor-pointer flex flex-col justify-between space-y-6 group"
          >
            <div className="space-y-3">
              <div className="w-16 h-16 bg-teal-50 text-teal-700 rounded-2xl flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform">
                🎴
              </div>
              <h3 className="text-2xl font-bold font-serif text-stone-800">Memory Match</h3>
              <p className="text-stone-600 text-lg">
                Match pairs of familiar fruits, animals, and household objects.
              </p>
            </div>
            <div className="flex items-center justify-between text-teal-700 font-bold text-lg">
              <span>5 mins · Easy</span>
              <span className="flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                <span>Play Now</span>
                <ArrowRight className="w-5 h-5" />
              </span>
            </div>
          </div>

          {/* Game 2: Object Recognition */}
          <div
            onClick={() => startMiniGame('object')}
            className="bg-white border-2 border-emerald-200 rounded-3xl p-8 shadow-sm hover:shadow-lg hover:border-emerald-400 transition-all cursor-pointer flex flex-col justify-between space-y-6 group"
          >
            <div className="space-y-3">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-700 rounded-2xl flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform">
                👀
              </div>
              <h3 className="text-2xl font-bold font-serif text-stone-800">Object & Routine Recognition</h3>
              <p className="text-stone-600 text-lg">
                Identify traditional items and familiar daily routines.
              </p>
            </div>
            <div className="flex items-center justify-between text-emerald-700 font-bold text-lg">
              <span>3 mins · Comfortable</span>
              <span className="flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                <span>Play Now</span>
                <ArrowRight className="w-5 h-5" />
              </span>
            </div>
          </div>

          {/* Game 3: Pattern Recognition */}
          <div
            onClick={() => startMiniGame('pattern')}
            className="bg-white border-2 border-amber-200 rounded-3xl p-8 shadow-sm hover:shadow-lg hover:border-amber-400 transition-all cursor-pointer flex flex-col justify-between space-y-6 group"
          >
            <div className="space-y-3">
              <div className="w-16 h-16 bg-amber-50 text-amber-700 rounded-2xl flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform">
                🔷
              </div>
              <h3 className="text-2xl font-bold font-serif text-stone-800">Pattern Sequence</h3>
              <p className="text-stone-600 text-lg">
                Find the next item in simple calming color sequences.
              </p>
            </div>
            <div className="flex items-center justify-between text-amber-700 font-bold text-lg">
              <span>3 mins · Gentle</span>
              <span className="flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                <span>Play Now</span>
                <ArrowRight className="w-5 h-5" />
              </span>
            </div>
          </div>

          {/* Game 4: Daily Routine Recall */}
          <div
            onClick={() => startMiniGame('routine')}
            className="bg-white border-2 border-indigo-200 rounded-3xl p-8 shadow-sm hover:shadow-lg hover:border-indigo-400 transition-all cursor-pointer flex flex-col justify-between space-y-6 group"
          >
            <div className="space-y-3">
              <div className="w-16 h-16 bg-indigo-50 text-indigo-700 rounded-2xl flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform">
                📅
              </div>
              <h3 className="text-2xl font-bold font-serif text-stone-800">Routine Recall</h3>
              <p className="text-stone-600 text-lg">
                Answer friendly questions about daily habits and breakfast routines.
              </p>
            </div>
            <div className="flex items-center justify-between text-indigo-700 font-bold text-lg">
              <span>4 mins · Comfortable</span>
              <span className="flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                <span>Play Now</span>
                <ArrowRight className="w-5 h-5" />
              </span>
            </div>
          </div>

        </div>
      ) : (
        /* Active Game Container */
        <div className="bg-white border-2 border-teal-300 rounded-3xl p-8 sm:p-10 shadow-xl space-y-8">
          
          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveGame(null)}
              className="text-stone-600 hover:text-stone-900 font-semibold px-4 py-2 bg-stone-100 rounded-xl"
            >
              ← Back to Games
            </button>
            <span className="bg-amber-100 text-amber-900 px-4 py-1.5 rounded-full font-bold text-sm">
              ✨ Personalized Difficulty: {state.difficultyLevel}
            </span>
          </div>

          {/* Memory Match Game Play */}
          {activeGame === 'match' && (
            <div className="space-y-6 text-center">
              <h2 className="text-2xl font-serif font-bold text-stone-800">Match the Pairs</h2>
              <p className="text-stone-600">Tap cards to flip them and find matching pairs.</p>

              {gameWon ? (
                <div className="bg-emerald-50 border-2 border-emerald-300 p-8 rounded-3xl space-y-4">
                  <div className="text-6xl">🎉</div>
                  <h3 className="text-3xl font-bold font-serif text-emerald-900">Wonderful Work!</h3>
                  <p className="text-stone-700 text-xl">You matched all the pairs successfully and your garden bloomed!</p>
                  <button
                    onClick={() => setActiveGame(null)}
                    className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-bold text-lg hover:bg-emerald-700 shadow-lg"
                  >
                    Return to Games
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-4 max-w-lg mx-auto">
                  {matchCards.map((card, idx) => {
                    const isFlipped = flippedIndices.includes(idx) || card.matched;
                    return (
                      <button
                        key={idx}
                        onClick={() => handleCardClick(idx)}
                        className={`h-24 rounded-2xl text-4xl flex items-center justify-center border-2 transition-all shadow-md ${
                          isFlipped
                            ? 'bg-amber-50 border-amber-300'
                            : 'bg-teal-700 border-teal-800 text-white hover:bg-teal-600'
                        }`}
                      >
                        {isFlipped ? card.name : '❓'}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Object Recognition Game Play */}
          {activeGame === 'object' && (
            <div className="space-y-6 max-w-xl mx-auto text-center">
              <div className="text-8xl p-6 bg-emerald-50 rounded-3xl w-fit mx-auto border border-emerald-200">
                {objectQuestion.emoji}
              </div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-800">
                {objectQuestion.title}
              </h2>

              {objectQuestion.answered ? (
                <div className="bg-emerald-50 border-2 border-emerald-300 p-6 rounded-3xl space-y-4">
                  <div className="flex items-center justify-center space-x-2 text-emerald-800 font-bold text-2xl">
                    <CheckCircle2 className="w-8 h-8" />
                    <span>Correct! Wonderful identification!</span>
                  </div>
                  <button
                    onClick={() => {
                      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
                      completeActivity('Object Recognition', 4, 4, timeSpent);
                      setActiveGame(null);
                    }}
                    className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-bold text-lg hover:bg-emerald-700 shadow-lg"
                  >
                    Continue & Grow Garden 🌸
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {objectQuestion.options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        if (opt === objectQuestion.correct) {
                          setObjectQuestion((prev) => ({ ...prev, answered: true, correctChosen: true }));
                          speak("Wonderful! That is correct.");
                        } else {
                          speak("That's okay, try another choice!");
                        }
                      }}
                      className="p-5 bg-stone-50 border-2 border-stone-200 rounded-2xl text-xl font-bold text-stone-800 hover:bg-emerald-50 hover:border-emerald-500 transition-all shadow-sm"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Pattern Recognition Game Play */}
          {activeGame === 'pattern' && (
            <div className="space-y-6 max-w-xl mx-auto text-center">
              <h2 className="text-2xl font-serif font-bold text-stone-800">What comes next in the sequence?</h2>
              <div className="flex items-center justify-center space-x-4 text-5xl py-6 bg-amber-50 rounded-3xl border border-amber-200">
                {patternState.sequence.map((item, idx) => (
                  <span key={idx}>{item}</span>
                ))}
                <span className="text-teal-600 font-bold animate-pulse">❓</span>
              </div>

              {patternState.answered ? (
                <div className="bg-emerald-50 border-2 border-emerald-300 p-6 rounded-3xl space-y-4">
                  <div className="flex items-center justify-center space-x-2 text-emerald-800 font-bold text-2xl">
                    <CheckCircle2 className="w-8 h-8" />
                    <span>Brilliant! Pattern recognized!</span>
                  </div>
                  <button
                    onClick={() => {
                      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
                      completeActivity('Pattern Recognition', 3, 3, timeSpent);
                      setActiveGame(null);
                    }}
                    className="px-8 py-4 bg-emerald-600 text-white rounded-2xl font-bold text-lg hover:bg-emerald-700 shadow-lg"
                  >
                    Continue & Grow Garden 🌸
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-4 gap-4">
                  {patternState.options.map((opt, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        if (opt === patternState.correct) {
                          setPatternState((prev) => ({ ...prev, answered: true, correctChosen: true }));
                          speak("Spot on!");
                        } else {
                          speak("Give it another try!");
                        }
                      }}
                      className="h-20 bg-stone-50 border-2 border-stone-200 rounded-2xl text-4xl hover:bg-amber-50 hover:border-amber-400 transition-all shadow-sm flex items-center justify-center"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Routine Recall Game Play */}
          {activeGame === 'routine' && (
            <div className="space-y-6 max-w-xl mx-auto text-center">
              <div className="text-7xl p-4">🌅</div>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-800">
                What do you usually enjoy doing right after breakfast?
              </h2>

              <div className="grid grid-cols-1 gap-4">
                {[
                  'Drinking warm cardamom tea & listening to morning birds',
                  'Checking garden flowers and watering plants',
                  'Strolling gently in the verandah',
                ].map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      speak("Wonderful routine memory!");
                      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
                      completeActivity('Routine Recall', 4, 4, timeSpent);
                      setActiveGame(null);
                    }}
                    className="p-5 bg-stone-50 border-2 border-stone-200 rounded-2xl text-lg font-bold text-stone-800 hover:bg-indigo-50 hover:border-indigo-500 transition-all shadow-sm"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
