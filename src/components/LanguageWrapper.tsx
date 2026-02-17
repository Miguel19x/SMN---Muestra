import React from 'react';
import { LanguageProvider } from './additionals/scripts/i18n';

interface LanguageWrapperProps {
  children: React.ReactNode;
}

export default function LanguageWrapper({ children }: LanguageWrapperProps) {
  return (
    <LanguageProvider>
      {children}
    </LanguageProvider>
  );
}