import React, { useEffect, useState } from 'react';
import logo from '../assets/logo.png';

interface SplashScreenProps {
  onFinished: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinished }) => {
  const [fadeClass, setFadeClass] = useState('opacity-100');
  const [scaleClass, setScaleClass] = useState('scale-90 opacity-0');

  useEffect(() => {
    // Animate logo scale-in and fade-in shortly after mounting
    const scaleTimeout = setTimeout(() => {
      setScaleClass('scale-100 opacity-100');
    }, 100);

    // Start fading out the entire screen after 2.3 seconds
    const fadeTimeout = setTimeout(() => {
      setFadeClass('opacity-0 pointer-events-none');
    }, 2300);

    // Call onFinished to load the main app after the fade transition ends (2.8 seconds total)
    const finishedTimeout = setTimeout(() => {
      onFinished();
    }, 2800);

    return () => {
      clearTimeout(scaleTimeout);
      clearTimeout(fadeTimeout);
      clearTimeout(finishedTimeout);
    };
  }, [onFinished]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center text-white transition-opacity duration-500 ease-in-out ${fadeClass}`}
      style={{
        background: 'linear-gradient(135deg, #042f2c 0%, #0bb583 100%)',
      }}
    >
      <div className="flex flex-col items-center space-y-6">
        {/* Animated App Logo Wrapper */}
        <div
          className={`relative flex items-center justify-center w-36 h-36 md:w-44 md:h-44 bg-white rounded-[32px] p-4 shadow-2xl transition-all duration-700 ease-out ${scaleClass}`}
        >
          <img
            src={logo}
            alt="CareMind Logo"
            className="w-full h-full object-contain rounded-[24px] animate-pulse"
          />
        </div>

        {/* App Title */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-wide text-white drop-shadow-md">
            CareMind
          </h1>
          <div className="h-[2px] w-12 bg-amber-400 mx-auto rounded-full"></div>
          <p className="text-sm md:text-base font-sans tracking-widest text-emerald-100 uppercase opacity-90">
            AI Dementia Companion
          </p>
        </div>
      </div>

      {/* Loading Bar at Bottom */}
      <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 w-48 bg-emerald-950/60 h-1.5 rounded-full overflow-hidden">
        <div className="h-full bg-amber-400 rounded-full animate-loading-bar" style={{ width: '0%' }}></div>
      </div>
    </div>
  );
};
