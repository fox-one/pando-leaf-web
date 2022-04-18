<template>
  <div class="chart-wrap" :class="{ 'chart-wrap--loading': loading }">
    <div ref="root" class="chart"></div>
    <f-loading v-if="loading" loading class="chart-loading" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Ref } from "vue-property-decorator";
import * as echarts from "echarts";

import type { ECharts, EChartsOption } from "echarts";

export function getBaseOption(vm, data, colors): EChartsOption {
  return {
    color: colors,
    dataset: { source: data },
    textStyle: { fontFamily: "Inter" },
    grid: [{ top: 20, bottom: 40, left: 10, right: 10 }],
    xAxis: {
      show: true,
      type: "time",
      axisTick: { show: false },
      axisLine: { show: false },
      axisLabel: {
        inside: false,
        hideOverlap: true,
        showMinLabel: false,
        margin: 16,
        color: () => {
          const isDark = vm.$vuetify.theme.dark;

          return isDark ? "rgba(255, 255, 255, 0.4)" : "rgba(0, 0, 0, 0.4)";
        },
        rich: {},
        formatter: {
          year: "{yyyy}",
          month: "{MMM}",
          day: "{d}",
          hour: "{HH}:{mm}",
          minute: "{HH}:{mm}",
          second: "{HH}:{mm}:{ss}",
          millisecond: "{hh}:{mm}:{ss} {SSS}",
          none: "{yyyy}-{MM}-{dd} {hh}:{mm}:{ss} {SSS}",
        } as any,
      },
      axisPointer: {
        show: true,
        snap: true,
        label: {
          show: false,
          margin: -160,
          color: colors[0],
          fontWeight: 600,
          backgroundColor: "transparent",
          formatter: (params) => {
            return vm.$utils.time.format(params.value, "MMM DD YYYY");
          },
        },
        lineStyle: {
          color: "transparent",
          type: [2, 4],
          dashOffset: 2,
        },
      },
    },
    yAxis: { show: false, scale: true },
  };
}

@Component
class Chart extends Vue {
  @Prop() option;

  @Prop({ type: Boolean, default: false }) loading;

  @Ref("root") root;

  instance: ECharts | null = null;

  mounted() {
    this.instance = echarts.init(this.root);
    this.$emit("after-init", this.instance);
    window.addEventListener("resize", this.resize);

    this.setOption(this.option);
  }

  beforeDestroy() {
    window.removeEventListener("resize", this.resize);
  }

  setOption(option) {
    if (!this.instance) {
      console.warn("no instance found");
      return;
    }

    this.instance.setOption(option);
    this.$emit("after-set-option", this.instance);
  }

  resize() {
    this.instance?.resize();
  }
}
export default Chart;
</script>

<style lang="scss" scoped>
.chart-wrap,
.chart {
  height: 100%;
  width: 100%;
}

.chart-wrap {
  position: relative;

  &--loading {
    .chart {
      opacity: 0.2;
    }
  }
}

.chart-loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
