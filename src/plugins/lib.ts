import Vue from "vue";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/zh";
import "animate.css";
import UIKit from "@foxone/uikit";
import VeLine from "v-charts/lib/line.common";
import VeBar from "v-charts/lib/bar.common";
import VeCandle from "v-charts/lib/candle.common";
import "echarts/lib/component/markLine";

dayjs.extend(relativeTime);
Vue.use(UIKit);
Vue.component(VeLine.name, VeLine);
Vue.component(VeBar.name, VeBar);
Vue.component(VeCandle.name, VeCandle);
