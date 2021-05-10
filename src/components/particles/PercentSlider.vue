<template>
  <v-slider
    v-model="value"
    :tick-labels="ticksLabels"
    ticks="always"
    :tick-size="16"
    track-color="#c4c4c4"
    background-color="transparent"
    color="primary"
    thumb-color="primary"
    step="1"
    class="percent-slider"
    :min="0"
    :max="100"
  ></v-slider>
</template>

<script lang="ts" scoped>
import { Vue, Component, PropSync } from "vue-property-decorator";

@Component
export default class PercentSlider extends Vue {
  @PropSync("percent") value;

  get ticksLabels() {
    return Array.apply(null, { length: 101 } as any).map((v, k) => {
      if (k % 20 === 0 && k !== 100) {
        return `${k}%`;
      }
      return "";
    });
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
        text-align: center;
        transform: translate(calc(-50% + 8px), 8px) !important;
      }
    }
    .v-slider__tick:nth-of-type(21),
    :nth-of-type(41),
    :nth-of-type(61),
    :nth-of-type(81) {
      opacity: 1;
      width: 16px !important;
      height: 16px !important;
      border-radius: 100%;
      background-color: #c4c4c4;
      top: calc(50% - 8px) !important;
    }
    .v-slider__tick--filled {
      background-color: var(--v-primary-base) !important;
    }
  }
}
</style>
