import en from "./lang/en-US.json";
import zh from "./lang/zh-TW.json";
import ja from "./lang/ja-JP.json";
import de from "./lang/de-DE.json";
import es from "./lang/es-ES.json";
import fr from "./lang/fr-FR.json";
import ko from "./lang/ko-KR.json";

const addtion = {};

export function genLocales(data) {
  return { ...addtion, ...data };
}

export default {
  fallbackLocale: "en",
  messages: {
    en: genLocales(en),
    zh: genLocales(zh),
    ja: genLocales(ja),
    de: genLocales(de),
    es: genLocales(es),
    fr: genLocales(fr),
    ko: genLocales(ko),
  },
};
