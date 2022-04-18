<template>
  <div class="chart-panel pa-4">
    <div class="chart-type">
      <type-select :types="types" :value.sync="bindType" />
    </div>
    <div class="chart-title mb-10">
      <chart-title :title="title" :subtitle="subtitle" :hint="hint" />
    </div>
    <div class="chart">
      <slot name="chart" />
    </div>
    <div class="chart-duration">
      <duration-select :value.sync="bindDuration" />
    </div>

    <div class="chart-action">
      <slot name="foot" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, PropSync } from "vue-property-decorator";
import TypeSelect from "./TypeSelect.vue";
import DurationSelect from "./DurationSelect.vue";
import ChartTitle from "./ChartTitle.vue";

@Component({
  inheritAttrs: false,
  components: {
    TypeSelect,
    DurationSelect,
    ChartTitle,
  },
})
class ChartLayout extends Vue {
  @Prop() types;

  @Prop() title;

  @Prop() subtitle;

  @Prop() hint;

  @PropSync("type") bindType;

  @PropSync("duration") bindDuration;
}
export default ChartLayout;
</script>

<style lang="scss" scoped>
.chart-panel {
  background: var(--v-third-base);
  border-radius: 8px;

  .chart {
    height: 195px;
    margin: 0 -16px;
  }
}
</style>
