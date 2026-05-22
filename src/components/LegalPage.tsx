import React, { useEffect } from 'react';
import { translations } from '../translations';
import type { AppLanguage } from '../types';

interface LegalPageProps {
  type: 'privacyPolicy' | 'termsOfService' | 'aboutUs';
  appLanguage: AppLanguage;
}

const LegalPage: React.FC<LegalPageProps> = ({ type, appLanguage }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [type]);

  const content = (translations[appLanguage] as any).legalPages[type];

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 mb-8">
        {content.title}
      </h1>
      <div 
        className="prose prose-lg dark:prose-invert max-w-none text-gray-600 dark:text-gray-300 space-y-4"
        dangerouslySetInnerHTML={{ __html: content.content }}
      />
    </div>
  );
};

export default LegalPage;
