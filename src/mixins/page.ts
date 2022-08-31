import Vue from "vue";
import { Component, Watch } from "vue-property-decorator";

import type { TranslateResult } from "vue-i18n";
import dayjs from "dayjs";

export interface Page extends Vue {
  title: string;
  htmlTitle?: string;
  shortDesc?: string;
  desc?: string;
  canonicalLink?: string;
  setLang: () => void;
  setPageConfig: () => void;
}

@Component({
  head() {
    const vm = this as Page;
    const i18nHead = this.$nuxtI18nHead({ addSeoAttributes: true });
    return {
      title: `${vm.htmlTitle || vm.title} - ${vm.shortDesc}`,
      meta: [
        {
          hid: "theme-color",
          name: "theme-color",
          content: vm.$store.state.app.dark ? "#000000" : "#FFFFFF",
        },
        {
          hid: "description",
          name: "description",
          content: vm.desc,
        },
        {
          hid: "og:title",
          name: "og:title",
          title: vm.htmlTitle || vm.title,
        },
        {
          hid: "og:description",
          name: "og:description",
          content: vm.desc,
        },
        {
          hid: "twitter:title",
          name: "twitter:title",
          title: vm.htmlTitle || vm.title,
        },
        {
          hid: "twitter:description",
          name: "twitter:description",
          content: vm.desc,
        },
        ...i18nHead.meta,
      ],
      link: i18nHead.link,
    } as any;
  },
  beforeRouteEnter(_to, _from, next) {
    next((vm: any) => {
      // vm.setLang();
      vm.setPageConfig();
    });
  },
})
export default class PageView extends Vue {
  get title(): TranslateResult {
    return "Leaf";
  }

  get appbar(): Partial<State.AppBarState> {
    return {
      style: "nav",
    };
  }

  get desc() {
    return this.$t("description");
  }

  get shortDesc() {
    return this.$t("short-description");
  }

  get bottomNav() {
    return "";
  }

  get desktop() {
    return this.$vuetify.breakpoint.mdAndUp;
  }

  get canonicalLink() {
    return `${window.location.origin}${window.location.pathname}${window.location.search}`;
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
