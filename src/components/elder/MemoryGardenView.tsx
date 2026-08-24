import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GardenPlant } from '../../types';
import { Sparkles, Heart, Info, X } from 'lucide-react';

export const MemoryGardenView: React.FC = () => {
  const { state } = useApp();
  const [selectedPlant, setSelectedPlant] = useState<GardenPlant | null>(null);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8 pb-24">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-700 to-teal-800 text-white rounded-3xl p-8 sm:p-10 shadow-xl space-y-3">
        <span className="bg-white/20 text-emerald-50 px-4 py-1.5 rounded-full text-sm font-medium">
          🌱 Your Personal Growth
        </span>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold">Memory Garden</h1>
        <p className="text-xl text-emerald-100 max-w-xl">
          Every completed activity and happy thought helps your garden bloom into a beautiful Memory Tree. Tap any plant to view its memory.
        </p>
      </div>

      {/* Garden Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {state.gardenPlants.map((plant) => (
          <div
            key={plant.id}
            onClick={() => setSelectedPlant(plant)}
            className="bg-white border-2 border-emerald-200 rounded-3xl p-6 shadow-sm hover:shadow-md hover:border-emerald-400 transition-all cursor-pointer flex flex-col items-center text-center space-y-4 group relative overflow-hidden"
          >
            <div className="absolute top-3 right-3 bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-full text-xs font-bold">
              {plant.stage.toUpperCase()}
            </div>
            
            <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center text-5xl group-hover:scale-110 transition-transform shadow-inner">
              {plant.icon}
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-bold font-serif text-stone-800">{plant.name}</h3>
              <p className="text-sm text-stone-500">Planted: {plant.plantedDate}</p>
            </div>

            <p className="text-stone-600 text-sm line-clamp-2 bg-stone-50 p-3 rounded-2xl w-full">
              "{plant.memory}"
            </p>
          </div>
        ))}

        {/* Locked / Future Tree Slot */}
        <div className="bg-stone-50 border-2 border-dashed border-stone-300 rounded-3xl p-6 flex flex-col items-center text-center justify-center space-y-3 min-h-[220px]">
          <div className="text-4xl opacity-50">🌳</div>
          <h3 className="text-lg font-bold text-stone-600">Memory Tree Blooming Soon</h3>
          <p className="text-xs text-stone-400">Complete more daily activities to grow your tree!</p>
        </div>
      </div>

      {/* Plant Memory Modal */}
      {selectedPlant && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border-2 border-emerald-300 max-w-md w-full rounded-3xl p-8 shadow-2xl space-y-6 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <span className="text-4xl">{selectedPlant.icon}</span>
                <div>
                  <h3 className="text-2xl font-serif font-bold text-emerald-950">{selectedPlant.name}</h3>
                  <p className="text-sm text-stone-550">Planted on {selectedPlant.plantedDate}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedPlant(null)}
                className="text-stone-400 hover:text-stone-700 p-2 rounded-xl bg-stone-100"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-2xl space-y-2">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Associated Memory</span>
              <p className="text-xl font-serif text-emerald-950 leading-relaxed">
                "{selectedPlant.memory}"
              </p>
            </div>

            <button
              onClick={() => setSelectedPlant(null)}
              className="w-full py-3.5 bg-emerald-600 text-white rounded-2xl font-bold text-lg hover:bg-emerald-700 transition-all shadow-md"
            >
              Close Memory
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
