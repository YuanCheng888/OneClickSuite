import React from 'react';
import { WandSparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { APP_NAME } from '../constants';

interface LoadingScreenProps {
  transparent?: boolean;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ transparent = false }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ 
        duration: 0.2,
        ease: "easeOut" 
      }}
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center backdrop-blur-md ${
        transparent 
          ? 'bg-white/10 dark:bg-black/20 supports-[backdrop-filter]:bg-white/10' 
          : 'bg-white dark:bg-gray-900'
      }`}
    >
      <div className="relative">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.2 }}
          className="relative z-10"
        >
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center shadow-2xl shadow-indigo-500/30">
            <WandSparkles size={40} className="text-white animate-pulse" />
          </div>
          
          {/* Decorative glow */}
          <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-40 -z-10 animate-pulse" />
        </motion.div>
      </div>

      <motion.div 
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.2, delay: 0.05 }}
        className="mt-8 flex flex-col items-center gap-3"
      >
        <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-indigo-800 to-gray-900 dark:from-white dark:via-indigo-200 dark:to-white">
          {APP_NAME}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium tracking-wide uppercase text-[10px]">
          Initializing Creative Engine...
        </p>
      </motion.div>
    </motion.div>
  );
};

export default LoadingScreen;
