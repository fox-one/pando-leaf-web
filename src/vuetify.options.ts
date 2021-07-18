import zh from "vuetify/es5/locale/zh-Hans";
import en from "vuetify/es5/locale/en";
import ja from "vuetify/es5/locale/ja";
import enUIKit from "@foxone/uikit/src/locales/en";
import jaUIKit from "@foxone/uikit/src/locales/ja";
import zhUIKit from "@foxone/uikit/src/locales/zh-Hans";
import { makeIconValues } from "@/components/icons";

const locales = {
  zh: { ...zh, ...zhUIKit },
  en: { ...en, ...enUIKit },
  ja: { ...ja, ...jaUIKit },
};

const icons = {
  iconfont: "mdiSvg",
  values: makeIconValues(),
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
        variations: false,
      },
      themes: {
        light: {
          primary: "#000000",
          success: "#2CC94E",
          warning: "#F58721",
          error: "#F44C4C",
          greyscale_1: "#000000",
          greyscale_2: "#494949",
          greyscale_3: "#808080",
          greyscale_4: "#CCCCCC",
          greyscale_5: "#EBEBEB",
          greyscale_6: "#F5F5F5",
          greyscale_7: "#FFFFFF",
          bright_green: "#C3FC1A",
          risk_low: "#2CC94E",
          risk_mid: "#F58721",
          risk_high: "#F44C4C",
          risk_low_bg: "#EBFCED",
          risk_mid_bg: "#FCF8F0",
          risk_high_bg: "#FBF2F2",
        },
        dark: {
          primary: "#ffffff",
          success: "#56D471",
          warning: "#FF9D3E",
          error: "#F67070",
          greyscale_1: "#FFFFFF",
          greyscale_2: "#D8D8D8",
          greyscale_3: "#9F9F9F",
          greyscale_4: "#656565",
          greyscale_5: "#3C3C3C",
          greyscale_6: "#191919",
          greyscale_7: "#000000",
          bright_green: "#CDFF38",
          risk_low: "#56D471",
          risk_mid: "#FF9D3E",
          risk_high: "#F67070",
          risk_low_bg: "#45764E",
          risk_mid_bg: "#97713A",
          risk_high_bg: "#8A4141",
        },
      },
    },
  };
}
