// Pure TypeScript file without JSX for use in Astro script tags
import type { Language, TranslationKey } from '../../type/types';
import es from '../i18n/es.json';
import en from '../i18n/en.json';

interface Translations {
    [key: string]: string;
}

const translations: Record<Language, Translations> = { es, en };

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

export function translate(key: TranslationKey, lang: Language): string {
    return translations[lang][key] || key;
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

            // Always dispatch the language change event to sync React components
            // Use a small timeout to ensure React components have mounted
            setTimeout(() => {
                window.dispatchEvent(new CustomEvent('languagechange', { detail: { language: initialLang } }));
            }, 0);
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
