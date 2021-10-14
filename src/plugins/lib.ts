import Vue from "vue";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import duration from "dayjs/plugin/duration";
import "dayjs/locale/zh";
import "animate.css";
import UIKit from "@foxone/uikit";
import FinanceUI from "@foxone/finance-ui";
import VeLine from "v-charts/lib/line.common";
import VeBar from "v-charts/lib/bar.common";
import VeCandle from "v-charts/lib/candle.common";
import "echarts/lib/component/markLine";
import infiniteScroll from "vue-infinite-scroll";
import "@foxone/finance-ui/es/index.css";
import { Plugin } from "@nuxt/types";

const plugin: Plugin = ({ app }) => {
  dayjs.extend(relativeTime);
  dayjs.extend(duration);
  Vue.use(infiniteScroll);
  Vue.use(UIKit);
  Vue.use(FinanceUI);
  Vue.component(VeLine.name, VeLine);
  Vue.component(VeBar.name, VeBar);
  Vue.component(VeCandle.name, VeCandle);
};

export default plugin;
