<template>
  <v-slider
    v-model="value"
    :tick-labels="ticksLabels"
    ticks="always"
    :tick-size="16"
    track-color="#c4c4c4"
    background-color="transparent"
    :color="thumbColor"
    :thumb-color="thumbColor"
    step="1"
    class="percent-slider"
    :min="0"
    :max="100"
  ></v-slider>
</template>

<script lang="ts" scoped>
import { Vue, Component, PropSync, Watch } from "vue-property-decorator";

@Component
export default class RiskSlider extends Vue {
  @PropSync("percent") value;

  get ticksLabels() {
    return Array.apply(null, { length: 101 } as any).map((v, k) => {
      if (k === 60) {
        return this.$t("risk.label.60");
      }
      if (k === 80) {
        return this.$t("risk.label.80");
      }
      if (k === 100) {
        return this.$t("risk.label.100");
      }
      return "";
    });
  }

  @Watch("value")
  onValueChanged(v) {
    if (v <= 60) {
      document.body.style.setProperty("--slider-tick-color", "#00ceb7");
      return;
    }
    if (v < 80) {
      document.body.style.setProperty("--slider-tick-color", "#f7a34a");
      return;
    }
    document.body.style.setProperty("--slider-tick-color", "#e23a3a");
  }

  get thumbColor() {
    if (this.value <= 60) return "#00ceb7";
    if (this.value < 80) return "#f7a34a";
    return "#e23a3a";
  }
}
</script>

<style lang="scss" scoped>
.percent-slider {
  ::v-deep {
    .v-slider__track-container {
      height: 8px;
    }
    .v-slider__thumb {
      width: 16px;
      height: 16px;
      left: -8px;
    }
    .v-slider__tick {
      opacity: 0;
      .v-slider__tick-label {
        width: 50px;
        white-space: pre-wrap;
        text-align: center;
        transform: translate(calc(-50% + 8px), 8px) !important;
      }
    }
    .v-slider__tick:nth-of-type(61n) {
      opacity: 1;
      width: 16px !important;
      height: 16px !important;
      border-radius: 100%;
      background-color: #c4c4c4;
      top: calc(50% - 8px) !important;
    }
    .v-slider__tick:nth-of-type(81n) {
      opacity: 1;
      width: 16px !important;
      height: 16px !important;
      border-radius: 100%;
      background-color: #c4c4c4;
      top: calc(50% - 8px) !important;
      left: 1px;
    }
    .v-slider__tick:nth-of-type(101n) {
      opacity: 1;
      width: 16px !important;
      height: 16px !important;
      border-radius: 100%;
      background-color: #c4c4c4;
      top: calc(50% - 8px) !important;
    }
    .v-slider__tick--filled {
      background-color: var(--slider-tick-color) !important;
    }
  }
}
</style>
