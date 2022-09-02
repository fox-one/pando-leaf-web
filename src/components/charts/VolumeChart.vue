<template>
  <base-bar-chart
    :data="chartData"
    :point.sync="point"
    v-bind="$attrs"
    v-on="$listeners"
  />
</template>

<script lang="ts">
import dayjs from "dayjs";
import { Component, Prop, PropSync, Vue, Watch } from "vue-property-decorator";
import BaseBarChart from "@/components/charts/BaseBarChart.vue";

@Component({
  components: {
    BaseBarChart,
  },
})
class VolumeChart extends Vue {
  @Prop() data!: API.StatsResponse[];

  @Prop() type!: API.ChartType;

  @PropSync("current") bindCurrent;

  point = null;

  @Watch("data", { immediate: true })
  @Watch("point", { immediate: true })
  handlePointChange() {
    const current = this.point || this.chartData[this.chartData.length - 1];

    this.bindCurrent = current;
  }

  @Watch("type")
  handleTypeChange() {
    this.handlePointChange();
  }

  get chartData() {
    if (this.type === "supply") {
      return this.data.map((x) => [dayjs(x.date).unix() * 1000, x.dai_value]);
    }
    return this.data.map((x) => [dayjs(x.date).unix() * 1000, x.gem_value]);
  }
}
export default VolumeChart;
</script>
