// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import es from './locales/es/translation.json';
import eu from './locales/eu/translation.json';

i18n
  .use(LanguageDetector) // detecta idioma del navegador
  .use(initReactI18next)
  .init({
    resources: {
      es: { translation: es },
      eu: { translation: eu },
    },
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
