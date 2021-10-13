import Vue from "vue";
import UIKit from "@foxone/uikit";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import duration from "dayjs/plugin/duration";
import "dayjs/locale/zh";

import PandoSeed from "@foxone/pandoseed";
// import FinanceUI from "@foxone/finance-ui";
import VeLine from "v-charts/lib/line.common";
import VeBar from "v-charts/lib/bar.common";
import VeCandle from "v-charts/lib/candle.common";
import "echarts/lib/component/markLine";

import infiniteScroll from "vue-infinite-scroll";
// import "@foxone/finance-ui/es/index.css";
import "@/components";

import "@foxone/uikit/build/index.min.css";

import type { Plugin } from "@nuxt/types";

dayjs.extend(relativeTime);
dayjs.extend(duration);

const plugin: Plugin = ({ app }) => {
  Vue.use(UIKit);
  Vue.use(UIKit.Toast, app.vuetify, {
    top: false,
    centered: true,
  });
  Vue.use(UIKit.Dialog, app.vuetify, { flat: true });
  Vue.use(PandoSeed.plugin, app.vuetify);
  Vue.use(infiniteScroll);
  //   Vue.use(FinanceUI);
  Vue.component(VeLine.name, VeLine);
  Vue.component(VeBar.name, VeBar);
  Vue.component(VeCandle.name, VeCandle);
};

export default plugin;
