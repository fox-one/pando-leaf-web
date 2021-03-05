import Vue from "vue";
import { Component } from "vue-property-decorator";
import { Mutation } from "vuex-class";

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

  get title() {
    return "";
  }

  get appbar() {
    return {};
  }

  get bottomNav() {
    return "";
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
