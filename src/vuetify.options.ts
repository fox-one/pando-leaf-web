import zh from "vuetify/es5/locale/zh-Hans";
import en from "vuetify/es5/locale/en";
import ja from "vuetify/es5/locale/ja";
import enUIKit from "@foxone/uikit/src/locales/en-US.json";
import jaUIKit from "@foxone/uikit/src/locales/ja-JP.json";
import zhUIKit from "@foxone/uikit/src/locales/zh-TW.json";
import { makeIconValues } from "@/components/icons";
import UIKit from "@foxone/uikit";
import icons from "@/utils/icons";

import { mergeDeep } from "vuetify/lib/util/helpers";

const locales = {
  zh: { ...zh, ...zhUIKit },
  en: { ...en, ...enUIKit },
  ja: { ...ja, ...jaUIKit },
};

export default function ({ store }) {
  const isDark = store.state.app.settings.dark;

  const options = {
    icons: {
      iconfont: "mdiSvg",
      values: {
        ...icons,
        ...makeIconValues(),
      },
    },
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
          bright_green: "#C3FC1A",
          leading: "#c8f58d",
          risk_low: "#2CC94E",
          risk_mid: "#F58721",
          risk_high: "#F44C4C",
          risk_low_bg: "#EBFCED",
          risk_mid_bg: "#FCF8F0",
          risk_high_bg: "#FBF2F2",
          risk_low_subtitle: "#8AA58D",
          risk_mid_subtitle: "#B1A792",
          risk_high_subtitle: "#AF9494",
        },
        dark: {
          primary: "#ffffff",
          success: "#56D471",
          warning: "#FF9D3E",
          error: "#F67070",
          bright_green: "#CDFF38",
          leading: "#c8f58d",
          risk_low: "#56D471",
          risk_mid: "#FF9D3E",
          risk_high: "#F67070",
          risk_low_bg: "#1B4324",
          risk_mid_bg: "#5C3A13",
          risk_high_bg: "#4A2222",
          risk_low_subtitle: "#72947a",
          risk_mid_subtitle: "#9c856b",
          risk_high_subtitle: "#996c6c",
          risk_low_bg_action: "#2A6437",
          risk_mid_bg_action: "#815727",
          risk_high_bg_action: "#7D4040",
        },
      },
    },
  };
  return mergeDeep(UIKit.preset, options);
}
