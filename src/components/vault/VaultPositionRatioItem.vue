<template>
  <div class="ratio-item">
    <div class="column-wrapper">
      <div class="column" :style="meta.styles"></div>
      <v-img :src="meta.logo" width="24" height="24" class="logo" />
    </div>
    <div class="label">{{ meta.percentText }}</div>
    <div class="symbol label">{{ meta.symbol }}</div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import analyze from "rgbaster";

@Component
class VaultPositionRatioItem extends Vue {
  @Prop() benchmark!: number;

  @Prop() ratio!: API.CollateralRatio;

  color = "";

  get meta() {
    const toPercent = this.$utils.number.toPercent;

    const { benchmark, ratio } = this;
    const percentValue = ratio.value / benchmark;
    const percentText = toPercent({ n: percentValue });
    const height = Math.floor(114 * percentValue);
    const color = this.color || "#808080";

    return {
      height,
      percentText,
      styles: { height: `${height}px`, background: height <= 24 ? "" : color },
      symbol: ratio.asset.symbol,
      logo: ratio.asset.logo,
    };
  }

  async mounted() {
    const result = await analyze(this.ratio.asset.logo, {
      ignore: ["rgb(255,255,255)", "rgb(0,0,0)"],
      scale: 0.6,
    });
    this.color = result[0].color;
  }
}
export default VaultPositionRatioItem;
</script>

<style lang="scss" scoped>
.column-wrapper {
  height: 114px;
  width: 24px;
  border-radius: 24px;
  position: relative;
  overflow: hidden;

  .logo {
    position: absolute;
    bottom: 0;
    left: 0;
  }

  .column {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 24px;
    border-radius: 24px;
    height: 0;
    min-height: 24px;
    max-height: 144px;
    transition: background 0.2s ease, height 1s ease;
    box-shadow: 0px 8px 32px rgba(0, 0, 0, 0.16);
  }
}

.ratio-item {
  margin-right: 40px;

  &:last-child {
    margin-right: 20px;
  }

  .symbol {
    opacity: 0.4;
    white-space: nowrap;
  }

  .label {
    line-height: 15px;
    font-size: 12px;
    margin-top: 8px;
  }
}
</style>
