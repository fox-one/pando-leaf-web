<template>
  <div class="greyscale_3--text f-caption">
    <span>{{ meta.tip }}</span>
    <span class="font-weight-bold ml-1" :style="meta.color">
      {{ meta.riskText }}{{ meta.highlight }}
    </span>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class extends Vue {
  @Prop() progress!: number;

  get meta() {
    const {
      number: { toPercent, isValid },
      vault: { getRiskLevelMetaByPercent },
    } = this.$utils;

    let riskProgress = this.progress;
    if (!isValid(riskProgress) || riskProgress <= 0) {
      riskProgress = 0;
    }
    const risk = getRiskLevelMetaByPercent(100 / riskProgress);

    const riskLevelText = this.$t(`form.hint.risk-level-${risk.value}`);
    let color = `color: var(--v-${risk.color}-base)`;
    return {
      color,
      riskText: toPercent({ n: riskProgress / 100 }),
      tip: this.$t("form.hint.generate-ration"),
      highlight: this.$t("form.hint.risk-level", {
        level: riskLevelText,
      }),
    };
  }
}
</script>
<style lang="scss" scoped></style>
