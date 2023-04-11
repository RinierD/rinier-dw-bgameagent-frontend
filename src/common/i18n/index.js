import i18n from 'i18next';
import { SESSIONSTORAGE_LANGUAGE } from '../constants';

// npm install react-i18next i18next --save
import { initReactI18next } from 'react-i18next';

// # if you'd like to detect user language and load translation
// npm install i18next-http-backend i18next-browser-languagedetector --save

import en from './locales/en';
import ko from './locales/ko';
import ch from './locales/ch';

const selectedLanguage = sessionStorage.getItem(SESSIONSTORAGE_LANGUAGE);

i18n
  // .use(Backend) get resource from back-end
  .use(initReactI18next) // passes i18n down to react-i18next
  .init(
    {
      /** the translations
      (tip move them in a JSON file and import them,
      or even better, manage them via a UI: https://react.i18next.com/guides/multiple-translation-files#manage-your-translations-with-a-management-gui)
      for all options read: https://www.i18next.com/overview/configuration-options */
      resources: {
        한국어: ko,
        English: en,
        中文: ch,
      },
      lng: selectedLanguage, // if you're using a language detector, do not define the lng option
      fallbackLng: selectedLanguage,
      ns: ['page'],
      /** ns:['pageKo','pageEn','pageCn'], ns needs when you manage namespace for label, button, menu and ETC */
      interpolation: {
        escapeValue: false,
      },
    },
    function (err) {
      if (err) console.error(err);
    }
  );

export default i18n;
