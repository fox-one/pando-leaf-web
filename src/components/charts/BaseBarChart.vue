<template>
  <base-chart
    ref="chart"
    v-click-outside="handleClickOutSide"
    :option="option"
    v-bind="$attrs"
    @after-init="handleAfterInit"
  />
</template>

<script lang="ts">
import {
  Component,
  Prop,
  PropSync,
  Vue,
  Ref,
  Watch,
} from "vue-property-decorator";
import BaseChart from "@/components/charts/BaseChart.vue";
import { getBaseOption } from "@/components/charts/BaseChart.vue";

import type { EChartsOption } from "echarts";

@Component({
  components: {
    BaseChart,
  },
})
class BaseBarChart extends Vue {
  @Prop() data!: [string, number][];

  @Prop() colors;

  @PropSync("point") bindPoint;

  @Ref("chart") chart;

  get option(): EChartsOption {
    return {
      ...getBaseOption(this, this.data, this.colors),
      grid: [{ top: 20, bottom: 40, left: 16, right: 16 }],
      series: [{ type: "bar" }],
    };
  }

  @Watch("data")
  handleDataChange() {
    this.chart?.setOption({ dataset: { source: this.data } });
    this.bindPoint = null;
  }

  handleAfterInit(chart) {
    chart.on("highlight", (params) => {
      const point = this.data[params.batch?.[0]?.dataIndex];

      point && this.handleSetVisualMap(chart, point);
    });
  }

  handleResetVisualMap() {
    this.bindPoint = null;

    this.chart?.setOption({
      visualMap: {
        id: "1",
        show: false,
        pieces: [{ gt: 0, colorAlpha: 1 }],
      },
    });

    this.chart?.instance?.dispatchAction({
      type: "unselect",
      seriesIndex: 0,
    });
  }

  handleSetVisualMap(chart, point) {
    this.bindPoint = point;

    chart?.setOption({
      visualMap: {
        id: "1",
        type: "piecewise",
        dimension: 0,
        show: false,
        pieces: [
          { gt: point[0], colorAlpha: 0.2 },
          { value: point[0], colorAlpha: 1 },
          { gt: 0, lt: point[0], colorAlpha: 0.2 },
        ],
      },
    });
  }

  handleClickOutSide() {
    this.handleResetVisualMap();
  }
}
export default BaseBarChart;
</script>
