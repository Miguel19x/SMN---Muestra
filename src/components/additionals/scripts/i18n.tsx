import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { ReactNode } from 'react';
import type { Language, TranslationKey } from '../../type/types';
import es from '../i18n/es.json';
import en from '../i18n/en.json';

interface Translations {
  [key: string]: string;
}

const translations: Record<Language, Translations> = { es, en };

interface LanguageContextType {
  currentLang: Language;
  setLanguage: (lang: Language) => void;
  translate: (key: TranslationKey, vars?: Record<string, string | number>) => string;
  forceUpdate: () => void;
}

const LanguageContext = createContext<LanguageContextType>({
  currentLang: 'es',
  setLanguage: () => { },
  translate: (key) => key,
  forceUpdate: () => { },
});

export const useLanguage = () => useContext(LanguageContext);

interface LanguageProviderProps {
  children: ReactNode;
}

let currentLanguage: Language = 'es';

function isValidLanguage(lang: string): lang is Language {
  return lang === 'es' || lang === 'en';
}

export const setLanguage = (lang: Language) => {
  if (isValidLanguage(lang)) {
    currentLanguage = lang;
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang);
      document.documentElement.lang = lang;
      document.cookie = `NEXT_LOCALE=${lang}; path=/; max-age=31536000; SameSite=Strict; Secure`;
      updateTranslations(lang);
    }
  } else {
    console.error(`Invalid language: ${lang}`);
  }
};

export const getCurrentLang = (): Language => currentLanguage;

// Helper to read cookie value
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? match[2] : null;
}

// Get the persisted language (prioritizes cookie for SSR consistency, then localStorage)
function getPersistedLanguage(): Language {
  if (typeof window === 'undefined') return 'es';

  // Cookie is set by the server and client, so it's the most reliable source
  const cookieLang = getCookie('NEXT_LOCALE');
  if (cookieLang && isValidLanguage(cookieLang)) return cookieLang;

  // Fallback to localStorage
  const storedLang = localStorage.getItem('language');
  if (storedLang && isValidLanguage(storedLang)) return storedLang as Language;

  // Fallback to HTML lang attribute (set by server)
  const htmlLang = document.documentElement.lang;
  if (htmlLang && isValidLanguage(htmlLang)) return htmlLang as Language;

  return 'es';
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  // Initialize with 'es' to match server-side default for hydration
  const [currentLang, setCurrentLang] = useState<Language>('es');
  const [isHydrated, setIsHydrated] = useState(false);

  // Sync with persisted language after hydration to avoid SSR mismatch
  useEffect(() => {
    const persistedLang = getPersistedLanguage();
    if (persistedLang !== currentLang) {
      setCurrentLang(persistedLang);
    }
    setIsHydrated(true);

    // Also listen for Astro page navigation to re-sync language
    const handleAstroPageLoad = () => {
      const newLang = getPersistedLanguage();
      setCurrentLang(newLang);
    };

    document.addEventListener('astro:page-load', handleAstroPageLoad);

    return () => {
      document.removeEventListener('astro:page-load', handleAstroPageLoad);
    };
  }, []);

  useEffect(() => {
    const handleLanguageChange = (event: CustomEvent<{ language: Language }>) => {
      setCurrentLang(event.detail.language);
    };

    window.addEventListener('languagechange', handleLanguageChange as EventListener);

    return () => {
      window.removeEventListener('languagechange', handleLanguageChange as EventListener);
    };
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && isHydrated) {
      localStorage.setItem('language', currentLang);
      document.documentElement.lang = currentLang;
      document.cookie = `NEXT_LOCALE=${currentLang}; path=/; max-age=31536000; SameSite=Strict; Secure`;
      updateTranslations(currentLang);

      // Update the global variable for non-React code
      currentLanguage = currentLang;
    }
  }, [currentLang, isHydrated]);

  const setLanguageCallback = useCallback((lang: Language) => {
    if (isValidLanguage(lang)) {
      setCurrentLang(lang);
    } else {
      console.error(`Invalid language: ${lang}`);
    }
  }, []);

  const translateCallback = useCallback((key: TranslationKey, vars?: Record<string, string | number>) =>
    translateWithVars(key, currentLang, vars),
    [currentLang]);

  const forceUpdateCallback = useCallback(() => {
    // Force re-render by dispatching language change event
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('languagechange', { detail: { language: currentLang } }));
    }
  }, [currentLang]);

  const contextValue = useMemo<LanguageContextType>(() => ({
    currentLang,
    setLanguage: setLanguageCallback,
    translate: translateCallback,
    forceUpdate: forceUpdateCallback,
  }), [currentLang, setLanguageCallback, translateCallback, forceUpdateCallback]);

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}

export function translate(key: TranslationKey, lang: Language): string {
  return translations[lang][key] || key;
}

export function translateWithVars(key: TranslationKey, lang: Language, vars?: Record<string, string | number>): string {
  let translation = translations[lang][key] || key;
  if (vars) {
    Object.entries(vars).forEach(([varKey, varValue]) => {
      translation = translation.replace(new RegExp(`\\{${varKey}\\}`, 'g'), String(varValue));
    });
  }
  return translation;
}

export function updateTranslations(lang: Language) {
  if (typeof document !== 'undefined') {
    // Handle regular text translations (safe)
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(element => {
      const key = element.getAttribute('data-i18n');
      if (key && key in translations[lang]) {
        element.textContent = translate(key as TranslationKey, lang);
      }
    });

    // Handle HTML translations (only for controlled content from our translation files)
    const htmlElements = document.querySelectorAll('[data-i18n-html]');
    htmlElements.forEach(element => {
      const key = element.getAttribute('data-i18n-html');
      if (key && key in translations[lang]) {
        // Using innerHTML here is safe because:
        // 1. Content comes from our controlled translation files (not user input)
        // 2. We own and review all content in es.json and en.json
        element.innerHTML = translate(key as TranslationKey, lang);
      }
    });

    const attributeElements = document.querySelectorAll('[data-i18n-attr]');
    attributeElements.forEach(element => {
      const attr = element.getAttribute('data-i18n-attr');
      const key = element.getAttribute('data-i18n');
      if (attr && key && key in translations[lang]) {
        element.setAttribute(attr, translate(key as TranslationKey, lang));
      }
    });
  }
}

export async function loadLanguage(lang: string): Promise<void> {
  if (!isValidLanguage(lang) || translations[lang]) return;

  try {
    const module = await import(`../i18n/${lang}.json`);
    translations[lang] = module.default;
  } catch (error) {
    console.error(`Failed to load language: ${lang}`, error);
  }
}

export function initializeLanguage() {
  if (typeof window !== 'undefined') {
    const savedLang = localStorage.getItem('language') as Language;
    const htmlLang = document.documentElement.lang as Language;
    const defaultLang = 'es';

    const initialLang = savedLang || htmlLang || defaultLang;

    if (isValidLanguage(initialLang)) {
      setLanguage(initialLang);
      updateTranslations(initialLang);
    }

    const languageSelect = document.getElementById('language-select') as HTMLSelectElement | null;
    if (languageSelect) {
      languageSelect.value = initialLang;

      languageSelect.addEventListener('change', async (event) => {
        const target = event.target as HTMLSelectElement;
        const newLang = target.value as Language;

        if (isValidLanguage(newLang)) {
          await loadLanguage(newLang);
          setLanguage(newLang);
          window.dispatchEvent(new CustomEvent('languagechange', { detail: { language: newLang } }));
        }
      });
    }
  }
}

interface TransProps {
  i18nKey: TranslationKey;
  vars?: Record<string, string | number>;
}

export function Trans({ i18nKey, vars }: TransProps) {
  const { translate } = useLanguage();
  return <>{translate(i18nKey, vars)}</>;
}

export function useTranslation() {
  const { translate, currentLang, forceUpdate } = useLanguage();
  return { t: translate, lang: currentLang, forceUpdate };
}