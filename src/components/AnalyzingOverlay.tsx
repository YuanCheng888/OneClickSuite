import React, { useState, useEffect } from 'react';
import { Loader2, WandSparkles } from 'lucide-react';
import { translations } from '../translations';
import type { AppLanguage } from '../types';

interface AnalyzingOverlayProps {
  appLanguage: AppLanguage;
}

const AnalyzingOverlay: React.FC<AnalyzingOverlayProps> = ({ appLanguage }) => {
  const [index, setIndex] = useState(0);
  const [opacity, setOpacity] = useState(1);
  const texts = translations[appLanguage].studio.analyzingSteps || [];

  useEffect(() => {
    const interval = setInterval(() => {
      // Fade out
      setOpacity(0);
      
      setTimeout(() => {
        // Change text and fade in
        setIndex((prev) => (prev + 1) % texts.length);
        setOpacity(1);
      }, 500); // Wait for fade out
      
    }, 3000); // Change every 3 seconds

    return () => clearInterval(interval);
  }, [texts.length]);

  return (
    <div className="h-full min-h-[500px] bg-white dark:bg-gray-800 rounded-[32px] border border-gray-200 dark:border-gray-700 flex flex-col items-center justify-start pt-32 p-12 text-center overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-b from-primary-50/50 to-transparent dark:from-primary-900/10 dark:to-transparent opacity-50"></div>
      
      <div className="relative z-10 flex flex-col items-center">
        <div className="w-16 h-16 bg-white dark:bg-gray-900 rounded-full flex items-center justify-center mb-8 shadow-lg shadow-primary-100 dark:shadow-none border border-primary-50 dark:border-gray-700 relative">
          <div className="absolute inset-0 rounded-full border-4 border-primary-100 dark:border-primary-900/30"></div>
          <div className="absolute inset-0 rounded-full border-4 border-primary-600 border-t-transparent animate-spin"></div>
          <WandSparkles size={24} className="text-primary-600 dark:text-primary-400 animate-wand-wave" />
        </div>
        
        <h2 className="text-2xl font-black text-gray-500 dark:text-white mb-4 tracking-tight">
          {translations[appLanguage].studio.aiThinking}
        </h2>
        
        <div className="h-8 flex items-center justify-center">
            <p 
                className="text-gray-500 dark:text-gray-400 font-medium text-sm transition-opacity duration-500"
                style={{ opacity }}
            >
                {texts[index]}
            </p>
        </div>
      </div>
    </div>
  );
};

export default AnalyzingOverlay;
