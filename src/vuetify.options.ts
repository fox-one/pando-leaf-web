import zh from "vuetify/es5/locale/zh-Hans";
import en from "vuetify/es5/locale/en";
import ja from "vuetify/es5/locale/ja";
import enUIKit from "@foxone/uikit/src/locales/en";
import jaUIKit from "@foxone/uikit/src/locales/ja";
import zhUIKit from "@foxone/uikit/src/locales/zh-Hans";

const locales = {
  zh: { ...zh, ...zhUIKit },
  en: { ...en, ...enUIKit },
  ja: { ...ja, ...jaUIKit },
};

const icons = {
  iconfont: "mdiSvg",
  values: {
    iconListArrow: {
      component: "icon-list-arrow",
    },
  },
};

export default function ({ store }) {
  const isDark = store.state.app.settings.dark;

  return {
    icons,
    lang: { locales },
    theme: {
      dark: isDark,
      options: {
        customProperties: true,
      },
      themes: {
        light: {
          primary: "#E4AF77",
          orange: "#FFA800",
        },
        dark: {
          primary: "#E4AF77",
          orange: "#f08b04",
        },
      },
    },
  };
}
