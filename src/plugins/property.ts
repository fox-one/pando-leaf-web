import { Plugin } from "@nuxt/types";
import createHttpService from "~/services/http/create";
import createWsService from "~/services/socket/create";
import utils from "@/utils";
import { CONFIG, APP_TOKEN, NODE_ENV, APP_SCOPE } from "~/constants";
import Socket from "~/utils/socket";

declare module "vue/types/vue" {
  interface Vue {
    $utils: typeof utils;
    $http: ReturnType<typeof createHttpService>;
    $ws: ReturnType<typeof createWsService>;
    $socket: Socket;
    $icons: typeof utils.icons;
  }
}

declare module "@nuxt/types" {
  interface NuxtAppOptions {
    $utils: typeof utils;
    $http: ReturnType<typeof createHttpService>;
    $ws: ReturnType<typeof createWsService>;
    $socket: Socket;
    $icons: typeof utils.icons;
  }
}

declare module "vuex/types/index" {
  interface Store<S> {
    $utils: typeof utils;
    $http: ReturnType<typeof createHttpService>;
    $ws: ReturnType<typeof createWsService>;
    $socket: Socket;
    $icons: typeof utils.icons;
  }
}

const plugin: Plugin = ({ app }, inject) => {
  inject("http", createHttpService(app, CONFIG.API_BASE));
  inject("ws", createWsService(app, CONFIG.WS_BASE));
  inject("utils", utils);
  inject("icons", utils.icons);

  if (NODE_ENV === "development" && APP_TOKEN) {
    app.store?.commit("auth/SET_TOKEN", { token: APP_TOKEN, scope: APP_SCOPE });
  }
};

export default plugin;
