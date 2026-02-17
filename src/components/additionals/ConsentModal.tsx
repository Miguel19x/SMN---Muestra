import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { LanguageProvider, useLanguage } from './scripts/i18n';

function ConsentModalContent() {
  const [isOpen, setIsOpen] = useState(false);
  const { translate } = useLanguage();

  useEffect(() => {
    const hasConsented = Cookies.get('userConsent');
    if (!hasConsented) {
      setIsOpen(true);
    }
  }, []);

  const handleAccept = () => {
    Cookies.set('userConsent', 'true');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-bold mb-5 text-center text-gray-600 dark:text-gray-300">{translate('Subtitle-4')}</h2>
        <p className="mb-5 text-sm text-justify text-gray-600 dark:text-gray-300">
          {translate('Paragraph-5')}
        </p>
        <button
          onClick={handleAccept}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
        >
          {translate('B-Accept')}
        </button>
      </div>
    </div>
  );
}

export default function ConsentModal() {
  return (
    <LanguageProvider>
      <ConsentModalContent />
    </LanguageProvider>
  );
}