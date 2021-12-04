import { Plugin } from "@nuxt/types";
import createHttpService from "~/services/create";
import utils from "@/utils";
import { CONFIG } from "~/constants";
import Fennec from "@foxone/fennec-dapp";
import type { PandoSeedMethods } from "@foxone/pandoseed/types/utils/plugin";

declare module "vue/types/vue" {
  interface Vue {
    $utils: typeof utils;
    $http: ReturnType<typeof createHttpService>;
    $icons: typeof utils.icons;
    $fennec: Fennec;
    $pandoseed: PandoSeedMethods;
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
    $pandoseed: PandoSeedMethods;
  }
}

const plugin: Plugin = ({ app }, inject) => {
  inject("http", createHttpService(app, CONFIG.API_BASE));
  inject("utils", utils);
  inject("icons", utils.icons);
  inject("fennec", new Fennec());
};

export default plugin;
