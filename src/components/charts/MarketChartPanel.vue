<template>
  <chart-layout
    :types="types"
    :type.sync="chartType"
    :duration.sync="duration"
    :title="titles.title"
    :subtitle="titles.subtitle"
  >
    <template #chart>
      <component
        :is="component"
        :data="chartData"
        :loading="loading"
        :colors="colors"
        :current.sync="current"
        :chart-type="chartType"
        :pair="pair"
        :type="chartType"
      />
    </template>
  </chart-layout>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import VolumeChart from "./VolumeChart.vue";
import ChartLayout from "./ChartLayout.vue";
import dayjs from "dayjs";

@Component({
  components: {
    ChartLayout,
    VolumeChart,
  },
})
class MarketChartPanel extends Vue {
  @Prop() pair;

  @Prop({ type: Boolean, default: false }) isGlobal;

  loading = false;

  duration: API.Duration = "week";

  chartType: API.ChartType = "supply";

  data: any = {
    kline: [],
  };

  current = null;

  get durationData() {
    const getDurationData = this.$utils.helper.getDurationData;

    return {
      kline: getDurationData(
        this.data.kline,
        this.duration,
        (x) => dayjs(x?.date).unix(),
        100
      ),
    };
  }

  get component() {
    return "volume-chart";
  }

  get chartData() {
    return this.durationData.kline;
  }

  get colors() {
    const primary = this.$vuetify.theme.currentTheme.secondary as string;
    const disabled = this.$vuetify.theme.currentTheme.third as string;
    const text = this.$vuetify.theme.currentTheme.greyscale_4 as string;

    return [primary, disabled, text];
  }

  get types() {
    const baseItems = [
      { text: this.$t("chart.chart-type.collaterals"), value: "collaterals" },
      { text: this.$t("chart.chart-type.supply"), value: "supply" },
    ];
    return baseItems;
  }

  get titles() {
    const time = this.current?.[0] ?? 0;
    const data = this.current?.[1] ?? 0;
    const h = this.$createElement;

    if (!time) {
      return { title: "", subtitle: "" };
    }

    return {
      title: h("f-fiat-division", {
        props: { parts: this.$utils.currency.toFiat(this, { n: data }, true) },
      }),
      subtitle: this.$utils.time.format(time, "MMM DD, YYYY"),
    };
  }

  mounted() {
    this.requestChartData();
  }

  makeStatsPayload() {
    return {
      from: this.$utils.time.getYearStart(),
      to: this.$utils.time.getToday(),
    };
  }

  async requestChartData() {
    this.loading = true;
    try {
      const params: API.StatsPayload = this.makeStatsPayload();

      const kline = await this.$http.getStats(params);

      this.data.kline = kline.stats;

      this.$emit("loaded", this.data);
    } catch (error) {
      this.$utils.helper.errorHandler(this, error);
    }
    this.loading = false;
  }
}
export default MarketChartPanel;
</script>
