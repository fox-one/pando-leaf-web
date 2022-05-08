<template>
  <div>
    <v-flex class="progress">
      <v-progress-linear
        :value="meta.progress"
        height="4"
        :color="color"
        background-color="greyscale_6"
      ></v-progress-linear>

      <div class="progress-dot high-medium"></div>

      <div class="progress-dot medium-low"></div>
    </v-flex>

    <div class="py-2 relative">
      <span class="label liquidate-high">{{ meta.liquidationPercent }}</span>
      <span class="label high-medium">{{ meta.highRiskPercent }}</span>
      <span class="label medium-low">{{ meta.mediumRiskPercent }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class extends Vue {
  @Prop() progress!: number;

  @Prop() color!: string;

  @Prop() minRatio!: number;

  @Prop() disabled!: boolean;

  get meta() {
    const toPercent = this.$utils.number.toPercent;
    let progress = this.progress * 100;

    if (progress <= 1) {
      progress = 1;
    }

    if (this.disabled) {
      progress = 0;
    }

    return {
      progress,
      liquidationPercent: toPercent({ n: this.minRatio, dp: 1 }),
      highRiskPercent: toPercent({ n: this.minRatio * 1.25, dp: 1 }),
      mediumRiskPercent: toPercent({ n: (this.minRatio * 5) / 3, dp: 1 }),
    };
  }
}
</script>
<style lang="scss" scoped>
.progress {
  position: relative;

  .progress-dot {
    position: absolute;
    z-index: 3;
    background-color: var(--v-greyscale_7-base);
    color: var(--v-greyscale_7-base);
    top: 0px;
    height: 4px;
    width: 4px;
    transition: all 0.5s ease 0s;

    &.high-medium {
      left: calc(3 / 13 * 100%);
    }

    &.medium-low {
      left: calc(8 / 13 * 100%);
    }
  }
}
.relative {
  position: relative;

  .label {
    position: absolute;
    z-index: 3;
    font-size: 12px;
    line-height: 15px;
    color: var(--v-greyscale_4-base);

    &.liquidate-high {
      left: 0px;
    }

    &.high-medium {
      left: calc(3 / 13 * 100%);
    }

    &.medium-low {
      left: calc(8 / 13 * 100%);
    }
  }
}
</style>
