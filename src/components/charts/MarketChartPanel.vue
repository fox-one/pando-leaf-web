<template>
  <div>
    <chart-layout
      v-if="!desktop"
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

    <v-row v-else>
      <v-col>
        <chart-layout
          :types="[types[0]]"
          :type.sync="chartTypeDesktop1"
          :duration.sync="durationDesktop1"
          :title="titlesDesktop.chart1.title"
          :subtitle="titlesDesktop.chart1.subtitle"
        >
          <template #chart>
            <component
              :is="component"
              :data="durationDataDesktop.kline1"
              :loading="loading"
              :colors="colors"
              :current.sync="currentDesktop1"
              :chart-type="chartTypeDesktop1"
              :pair="pair"
              :type="chartTypeDesktop1"
            />
          </template>
        </chart-layout>
      </v-col>
      <v-col>
        <chart-layout
          :types="[types[1]]"
          :type.sync="chartTypeDesktop2"
          :duration.sync="durationDesktop2"
          :title="titlesDesktop.chart2.title"
          :subtitle="titlesDesktop.chart2.subtitle"
        >
          <template #chart>
            <component
              :is="component"
              :data="durationDataDesktop.kline2"
              :loading="loading"
              :colors="colors"
              :current.sync="currentDesktop2"
              :chart-type="chartTypeDesktop2"
              :pair="pair"
              :type="chartTypeDesktop2"
            />
          </template>
        </chart-layout>
      </v-col>
    </v-row>
  </div>
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

  durationDesktop1: API.Duration = "week";

  durationDesktop2: API.Duration = "week";

  chartType: API.ChartType = "supply";

  chartTypeDesktop1: API.ChartType = "collaterals";

  chartTypeDesktop2: API.ChartType = "supply";

  data: any = {
    kline: [],
  };

  current = null;

  currentDesktop1 = null;

  currentDesktop2 = null;

  get desktop() {
    return this.$vuetify.breakpoint.smAndUp;
  }

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

  get durationDataDesktop() {
    const getDurationData = this.$utils.helper.getDurationData;

    return {
      kline1: getDurationData(
        this.data.kline,
        this.durationDesktop1,
        (x) => dayjs(x?.date).unix(),
        100
      ),
      kline2: getDurationData(
        this.data.kline,
        this.durationDesktop2,
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

  get titlesDesktop() {
    const time1 = this.currentDesktop1?.[0] ?? 0;
    const data1 = this.currentDesktop1?.[1] ?? 0;
    const time2 = this.currentDesktop2?.[0] ?? 0;
    const data2 = this.currentDesktop2?.[1] ?? 0;
    const h = this.$createElement;

    let chart1: any = { title: "", subtitle: "" };
    let chart2: any = { title: "", subtitle: "" };
    if (time1) {
      chart1 = {
        title: h("f-fiat-division", {
          props: {
            parts: this.$utils.currency.toFiat(this, { n: data1 }, true),
          },
        }),
        subtitle: this.$utils.time.format(time1, "MMM DD, YYYY"),
      };
    }
    if (time2) {
      chart2 = {
        title: h("f-fiat-division", {
          props: {
            parts: this.$utils.currency.toFiat(this, { n: data2 }, true),
          },
        }),
        subtitle: this.$utils.time.format(time2, "MMM DD, YYYY"),
      };
    }

    return {
      chart1,
      chart2,
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
