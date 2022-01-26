import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";

import type { TranslateResult } from "vue-i18n";
import dayjs from "dayjs";

export interface Page extends Vue {
  title: string;

  setLang: () => void;
  setPageConfig: () => void;
}

@Component({
  head() {
    const vm = this as Page;
    return {
      title: vm.title,
      meta: [
        {
          hid: "theme-color",
          name: "theme-color",
          content: vm.$store.state.app.settings.dark ? "#000000" : "#FFFFFF",
        },
      ],
    };
  },
  beforeRouteEnter(_to, _from, next) {
    next((vm: any) => {
      vm.setLang();
      vm.setPageConfig();
    });
  },
})
export default class PageView extends Vue {
  get title(): TranslateResult {
    return "";
  }

  get appbar(): Partial<State.AppBarState> {
    return {
      style: "nav",
    };
  }

  get bottomNav() {
    return "";
  }

  setLang() {
    const locale = this.$utils.helper.getLocale();
    this.$i18n.locale = locale;
    this.$vuetify.lang.current = locale === "zh" ? "zhHans" : locale;
    this.$vuetify.lang.current = locale;
    dayjs.locale(locale);
    document.title = this.title as string;
  }

  @Watch("appbar", { deep: true })
  setPageConfig() {
    this.$store.commit("app/SET_BOTTOM_NAV", { value: this.bottomNav });
    this.$store.commit("app/SET_APPBAR", {
      title: this.title,
      ...this.appbar,
    });

    const defaultThemeColor = this.$vuetify.theme.dark ? "#000000" : "#ffffff";
    const color = (this.appbar as any).color || defaultThemeColor;

    setTimeout(() => {
      this.$utils.mixin.setMixinTheme(color);
    }, 200);
  }
}
