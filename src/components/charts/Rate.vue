<template>
  <ve-line
    :height="height"
    :grid="grid"
    :extend="extend"
    :series="series"
    :x-axis="xAxis"
    :y-axis="yAxis"
    :colors="colors"
    :tooltip="tooltip"
    :textStyle="textStyle"
    :after-set-option="handleAfterSetOption"
    class="rate-chart"
  ></ve-line>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
class RateChart extends Vue {
  @Prop() data!: API.ChartData[];

  textStyle = {
    fontFamily: `"-apple-system, BlinkMacSystemFont, SF Compact Display Medium, "PingFang SC", "Helvetica Neue", Roboto"`,
  };

  get colors() {
    return [this.$vuetify.theme.currentTheme.primary];
  }

  height = "100%";

  grid = [{ top: 10, bottom: 10, left: 0, right: 10 }];

  extend = {
    dataZoom: [
      {
        type: "inside",
      },
    ],
    legend: {
      show: false,
    },
  };

  get series() {
    return [
      {
        type: "line",
        name: "Liquidity",
        smooth: false,
        data: this.data.map((x) => x.v),
        showSymbol: false,
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: this.colors[0],
              },
              {
                offset: 1,
                color: "#FFFFFF",
              },
            ],
            global: false,
          },
        },
      },
    ];
  }

  get xAxis() {
    return {
      show: true,
      type: "category",
      data: this.data.map((x) => x.ts),
      axisTick: {
        show: false,
      },
      axisLine: {
        show: false,
      },
      axisLabel: {
        showMinLabel: false,
        formatter: (v) => {
          return this.$utils.time.format(v * 1000 + "", "MMM DD");
        },
      },
      axisPointer: {
        lineStyle: {
          type: "dotted",
        },
      },
    };
  }

  get yAxis() {
    return {
      show: true,
      // scale: true,
      position: "right",
      axisTick: {
        show: false,
      },
      axisLine: {
        show: false,
      },
      axisLabel: {
        show: true,
        showMinLabel: false,
        showMaxLabel: false,
        formatter: (value) => {
          return this.$utils.number.toPercent(value);
        },
      },
      splitLine: {
        show: false,
      },
    };
  }

  get tooltip() {
    return {
      trigger: "axis",
      axisPointer: {
        type: "line",
      },
      alwaysShowContent: true,
      backgroundColor: "rgba(245, 245, 245, 0.6)",
      borderColor: "transparent",
      transitionDuration: 0,
      textStyle: {
        color: "#000",
      },
      formatter: ([params]) => {
        const time = this.$utils.time.format(
          params.axisValue * 1000 + "",
          "MM/DD YYYY"
        );
        const value = this.$utils.number.toPercent(params.value);
        return [
          `<div class="rate-chart__tooltip">`,
          `<div class="rate-chart__tooltip-value">${value}</div>`,
          `<div class="rate-chart__tooltip-time">${time}</div>`,
          `</div>`,
        ].join("");
      },
      position: function () {
        return { top: 10, left: 10 };
      },
    };
  }

  handleAfterSetOption(chart) {
    const showDefaultTip = () =>
      chart.dispatchAction({
        type: "showTip",
        seriesIndex: 0,
        dataIndex: this.data.length - 1,
      });

    showDefaultTip();
    chart.on("globalout", () => {
      showDefaultTip();
    });
  }
}
export default RateChart;
</script>

<style lang="scss" scoped>
.rate-chart {
  z-index: 0;

  ::v-deep {
    .rate-chart__tooltip {
      .rate-chart__tooltip-value {
        color: var(--v-primary-base);
        font-size: 18px;
        margin-bottom: 4px;
      }

      .rate-chart__tooltip-time {
        color: rgba(0, 0, 0, 0.6);
        font-size: 12px;
      }
    }
  }
}
</style>
