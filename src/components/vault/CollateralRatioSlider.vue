<template>
  <div align-center justify-center column>
    <base-information-item
      class="py-3"
      :label="info.label"
      :value="info.value"
      :hint="info.hint"
      :value-color="info.valueColor"
      :learn-more="info.learnMore"
      :show-change="false"
    />

    <base-risk-slider
      :progress="meta.progress"
      :color="meta.color"
      :min-ratio="meta.minimumRatio"
      :disabled="meta.disabled"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import BaseRiskSlider from "@/components/base/RiskSlider.vue";
import { LINKS } from "~/constants";

@Component({
  components: {
    BaseRiskSlider,
  },
})
export default class CollateralRatioSlider extends Vue {
  @Prop() collateralId!: string;

  @Prop() ratio!: number;

  @Prop() risk!: Utils.VaultRiskLevelMeta;

  get meta() {
    const { toPercent, isValid } = this.$utils.number;
    const getters = this.$store.getters as Getter.GettersTree;

    const { minimumRatio, minimumRatioText } = getters.getMarketFields(
      this.collateralId
    );

    let disabled = false;
    let ratioText = toPercent({ n: this.ratio, dp: 1 });
    if (!isValid(this.ratio) || this.ratio === 0) {
      disabled = true;
      ratioText = "-";
    }

    // calculate progress
    const maxRatio = minimumRatio * (25 / 12);
    let progress = 100;
    if (this.ratio > minimumRatio) {
      progress = (this.ratio - minimumRatio) / (maxRatio - minimumRatio);
    }
    if (this.ratio <= minimumRatio) {
      progress = 0;
    }
    let color = this.risk?.color;
    if (this.ratio === 0) {
      disabled = true;
      color = "risk_low";
    }

    return {
      minimumRatio,
      minimumRatioText,
      ratioText,
      disabled,
      color,
      progress,
    };
  }

  get info() {
    return {
      label: this.$t("common.collateralization-ratio"), // deposit * price / mint
      value: this.meta.ratioText,
      valueColor: this.risk.color,
      hint: this.$t("tooltip.liquidation", {
        ratio: this.meta.minimumRatioText,
      }),
      learnMore: LINKS["vault.liquidation"],
    };
  }
}
</script>
