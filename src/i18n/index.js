import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "./locales/en/translation.json";
import km from "./locales/km/translation.json";

const savedLanguage = localStorage.getItem("language");

i18n
  .use(initReactI18next)
  .init({
    resources: { en: { translation: en }, km: { translation: km } },
    lng: savedLanguage === "km" ? "km" : "en",
    fallbackLng: "en",
    interpolation: { escapeValue: false },
  });

i18n.on("languageChanged", (language) => {
  localStorage.setItem("language", language);
  document.documentElement.lang = language === "km" ? "km" : "en";
});

document.documentElement.lang = i18n.language === "km" ? "km" : "en";

export default i18n;
