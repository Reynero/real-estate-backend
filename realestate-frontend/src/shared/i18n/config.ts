import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./en.json";
import es from "./es.json";

const LANGUAGE_KEY = "homefind-language";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    es: { translation: es },
  },
  lng: localStorage.getItem(LANGUAGE_KEY) ?? "en",
  fallbackLng: "en",
  interpolation: { escapeValue: false }, // React already escapes output, so no need to double-escape
});

// Keep the choice across page refreshes.
i18n.on("languageChanged", (lng) => {
  localStorage.setItem(LANGUAGE_KEY, lng);
});

export default i18n;