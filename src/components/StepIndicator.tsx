import React from 'react';
import { translations } from '../translations';
import type { AppLanguage } from '../types';
import { Loader2, Check, Upload, WandSparkles, FileText, Image as ImageIcon, CheckCircle2 } from 'lucide-react';

interface StepIndicatorProps {
  currentStepIndex: number;
  appLanguage: AppLanguage;
  className?: string;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStepIndex, appLanguage, className = '' }) => {
  const t = translations[appLanguage].studio;
  const stepLabels = t.steps;

  // Map step index to icon
  const getStepIcon = (index: number) => {
    switch(index) {
      case 0: return Upload;
      case 1: return WandSparkles;
      case 2: return FileText;
      case 3: return ImageIcon;
      case 4: return CheckCircle2;
      default: return Check;
    }
  };

  return (
    <div className={`flex items-center justify-center w-full max-w-4xl mx-auto px-4 ${className}`}>
      <div className="flex items-center justify-between w-full relative">
        {/* Background Line */}
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 dark:bg-gray-800 -z-10 -translate-y-1/2 rounded-full" />
        
        {/* Progress Line */}
        <div 
          className="absolute top-1/2 left-0 h-0.5 bg-primary-600 dark:bg-primary-500 -z-10 -translate-y-1/2 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${((currentStepIndex - 1) / (stepLabels.length - 1)) * 100}%` }}
        />

        {stepLabels.map((label, index) => {
          const stepId = index + 1;
          const isActive = stepId === currentStepIndex;
          const isPast = stepId < currentStepIndex;
          const Icon = getStepIcon(index);
          
          // Check if this is the "Analyzing" step (index 1 corresponds to step 2)
          // or "Generating" step (index 3 corresponds to step 4)
          const isAnalyzingStep = index === 1;
          const isGeneratingStep = index === 3;
          
          // Show loading state if it's the current active step AND it's either Analyzing or Generating
          const isLoadingStep = isActive && (isAnalyzingStep || isGeneratingStep);

          return (
            <div key={stepId} className="flex flex-col items-center relative group">
              <div 
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 relative z-10 border-[3px]
                  ${isActive 
                    ? 'bg-white dark:bg-gray-900 border-primary-600 dark:border-primary-500 text-primary-600 dark:text-primary-500 shadow-[0_0_0_4px_rgba(79,70,229,0.1)] dark:shadow-[0_0_0_4px_rgba(99,102,241,0.2)] scale-110' 
                    : isPast
                      ? 'bg-primary-600 dark:bg-primary-500 border-primary-600 dark:border-primary-500 text-white'
                      : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-300 dark:text-gray-600'
                  }
                `}
              >
                {isLoadingStep ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : isPast ? (
                  <Check size={16} strokeWidth={3} />
                ) : (
                  <Icon size={16} strokeWidth={isActive ? 2.5 : 2} />
                )}
              </div>
              
              <div className={`
                absolute top-14 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-bold tracking-wide transition-all duration-300
                ${isActive 
                  ? 'text-primary-600 dark:text-primary-400 -translate-y-1' 
                  : isPast 
                    ? 'text-gray-500 dark:text-gray-400' 
                    : 'text-gray-300 dark:text-gray-600'
                }
              `}>
                {label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StepIndicator;
