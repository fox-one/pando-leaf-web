import { Plugin } from "@nuxt/types";
import createHttpService from "~/services/create";
import utils from "@/utils";
import { CONFIG } from "~/constants";
import Fennec from "~/utils/fennec";
import Vue from "vue";
import { PandoSeedMethods } from "@foxone/pandoseed/types/utils/plugin";
import PandoSeed from "@foxone/pandoseed";

declare module "vue/types/vue" {
  interface Vue {
    $utils: typeof utils;
    $http: ReturnType<typeof createHttpService>;
    $icons: typeof utils.icons;
    $fennec: Fennec;
  }
}

declare module "@nuxt/types" {
  interface NuxtAppOptions {
    $utils: typeof utils;
    $http: ReturnType<typeof createHttpService>;
    $icons: typeof utils.icons;
    $fennec: Fennec;
    $pandoseed: PandoSeedMethods;
  }
}

declare module "vuex/types/index" {
  interface Store<S> {
    $utils: typeof utils;
    $http: ReturnType<typeof createHttpService>;
    $icons: typeof utils.icons;
    $fennec: Fennec;
  }
}

const plugin: Plugin = ({ app }, inject) => {
  Vue.use(PandoSeed.plugin, app.vuetify);
  inject("http", createHttpService(app, CONFIG.API_BASE));
  inject("utils", utils);
  inject("icons", utils.icons);

  inject("fennec", new Fennec(app));
};

export default plugin;
