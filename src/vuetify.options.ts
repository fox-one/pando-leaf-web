import { preset } from "@foxone/uikit";
import icons from "@/utils/icons";
import { mergeDeep } from "vuetify/lib/util/helpers";

export default function ({ store }) {
  const isDark = store.state.app.settings.dark;

  const options = {
    icons: {
      values: icons,
    },
    theme: {
      dark: isDark,
      options: {
        customProperties: true,
        variations: false,
      },
      themes: {
        light: {
          primary: "#000000",
          secondary: "#89DF0F",
          third: "#F7FDEF",
          forth: "#E3F5C8",
          fifth: "#E3F5C8",
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
          timer_tag_left_text: "#000000",
          timer_tag_left_bg: "#cbf58d",
          timer_tag_right_text: "#9FC665",
          timer_tag_right_bg: "#effbdd",
        },
        dark: {
          primary: "#ffffff",
          secondary: "#89DF0F",
          third: "#334519",
          forth: "#485F27",
          fifth: "#485F27",
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
          timer_tag_left_text: "#89DF0F",
          timer_tag_left_bg: "#334519",
          timer_tag_right_text: "#9F9F9F",
          timer_tag_right_bg: "#303030",
        },
      },
    },
  };
  return mergeDeep(preset, options);
}
