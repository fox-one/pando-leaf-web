import Vue from "vue";
import { Component } from "vue-property-decorator";
import { Action, Getter, Mutation, State } from "vuex-class";

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
  @Mutation("app/SET_APPBAR") setAppbar;

  @Mutation("app/SET_BOTTOM_NAV") setBottomNav;

  @Action("oracle/sync") syncOracles;

  @Action("auth/getMe") getMe;

  @State((state) => state.auth.id) user_id;

  @Getter("auth/isLogged") isLogged;

  @Getter("auth/canReadAsset") canReadAsset;

  get title() {
    return "";
  }

  get appbar() {
    return {};
  }

  get bottomNav() {
    return "";
  }

  mounted() {
    this.syncOracles();
    setTimeout(() => {
      if (this.isLogged && !this.user_id) {
        this.getMe();
      }
    }, 200);
  }

  setLang() {
    const locale = this.$utils.helper.getLocale();
    this.$i18n.locale = locale;
    this.$vuetify.lang.current = locale;
    document.title = this.title;
  }

  setPageConfig() {
    this.setBottomNav(this.bottomNav);
    this.setAppbar({ title: this.title, ...this.appbar });
    setTimeout(() => {
      this.$utils.helper.loadMixinTheme();
    }, 50);
  }
}
