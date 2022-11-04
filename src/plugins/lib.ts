import Vue from "vue";
import UIKit from "@foxone/uikit";

import PandoUI from "@foxone/pando-ui";
import PandoSeed from "@foxone/pandoseed";
import Passport from "@foxone/mixin-passport";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import duration from "dayjs/plugin/duration";
import "dayjs/locale/zh";

import { CanvasRenderer } from "echarts/renderers";
import { LineChart, BarChart } from "echarts/charts";
import {
  GridComponent,
  TooltipComponent,
  VisualMapComponent,
  LegendPlainComponent,
  AxisPointerComponent,
} from "echarts/components";
import { use } from "echarts/core";
import { CONFIG } from "@/constants";

import infiniteScroll from "vue-infinite-scroll";

import "@foxone/uikit/build/index.min.css";
import "@foxone/pando-ui/build/index.css";

import "../components/icons";

import type { Plugin } from "@nuxt/types";

dayjs.extend(relativeTime);
dayjs.extend(duration);

const plugin: Plugin = ({ app }) => {
  Vue.use(UIKit, {
    vuetify: app.vuetify,
    toast: {
      top: false,
      centered: true,
    },
    dialog: { flat: true },
    auth: {
      wallets: ["fennec", "mixin", "metamask", "walletconnect"],
      clientId: CONFIG.MIXIN_CLIENT_ID,
      scope: "PROFILE:READ ASSETS:READ",
      pkce: true,
    },
  });

  Vue.use(Passport, {
    origin: "Pando Leaf",
    config: { infuraId: "a018fa2f735a435f9a7917f0d429c61a" },
    JWTPayload: { from: "pando-leaf" },
    onDisconnect: () => {
      app.$utils.account.logout(app);
    },
  });

  Vue.use(PandoUI, app.vuetify);
  Vue.use(PandoSeed.plugin, app.vuetify);
  Vue.use(infiniteScroll);

  use([
    CanvasRenderer,
    LineChart,
    BarChart,
    GridComponent,
    TooltipComponent,
    LegendPlainComponent,
    VisualMapComponent,
    AxisPointerComponent,
  ]);
};

export default plugin;
