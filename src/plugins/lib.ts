import Vue from "vue";
import UIKit from "@foxone/uikit";

import PandoUI from "@foxone/pando-ui";
import PandoSeed from "@foxone/pandoseed";
import PandoLots from "@foxone/pando-lots-vue";

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

import infiniteScroll from "vue-infinite-scroll";

import "@foxone/uikit/build/index.min.css";
import "@foxone/pando-ui/build/index.css";
import "@foxone/pando-lots-vue/lib/index.css";

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
  Vue.use(PandoUI, app.vuetify);
  Vue.use(PandoLots);
  Vue.use(PandoSeed.plugin, app.vuetify);
  Vue.use(infiniteScroll);
  //   Vue.use(FinanceUI);
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
