<template>
  <div>
    <div class="mt-4 mb-2 title greyscale_1--text">
      {{ $t("form.predication") }}
    </div>

    <base-information-item-list :informations="infos" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class OpenVaultPrediction extends Vue {
  @Prop() collateral!: API.Collateral;

  @Prop() depositAmount!: string;

  @Prop() debtAmount!: string;

  get meta() {
    const { format, toPercent } = this.$utils.number;
    const getters = this.$store.getters as Getter.GettersTree;
    const {
      liquidationPriceText,
      collateralizationRatio,
      collateralizationRatioText,
      maxToGenerateText,
      stabilityFeeText,
    } = getters.openVaultPrediction(
      +this.depositAmount,
      +this.debtAmount,
      this.collateral
    );

    const { debtSymbol, collateralSymbol } = getters.getMarketFields(
      this.collateral?.id
    );

    const risk = this.$utils.collateral.getRiskLevelMeta(
      collateralizationRatio,
      +this.collateral?.mat
    );

    return {
      liquidationPriceText,
      collateralizationRatio,
      collateralizationRatioText,
      maxToGenerateText,
      currentPrice: format({ n: this.collateral?.price }),
      minimumRatio: toPercent({ n: this.collateral?.mat }),
      stabilityFeeText,
      collateralSymbol,
      debtSymbol,
      risk,
    };
  }

  get infos() {
    return [
      {
        label: this.$t("form.info.liquidation-price"), // mint * mat / deposit
        value: this.meta.liquidationPriceText,
        valueUnit: `${this.meta.debtSymbol}`,
        hint: this.$t("form.tooltip.liquidation-price"),
      },
      {
        label: this.$t("form.info.current-symbol-price", {
          symbol: `${this.meta.collateralSymbol}/${this.meta.debtSymbol}`,
        }),
        value: this.meta.currentPrice,
        valueUnit: `${this.meta.debtSymbol}`,
      },
      {
        label: this.$t("form.info.collateralization-ratio"), // deposit * price / mint
        value: this.meta.collateralizationRatioText,
        valueColor: this.meta.risk.color,
        hint: this.$t("form.tooltip.collateralization-ratio"),
      },
      {
        label: this.$t("form.info.minimum-ratio"),
        value: this.meta.minimumRatio,
        hint: this.$t("form.tooltip.minimum-ratio"),
      },
      {
        label: this.$t("form.info.market-debt-ceiling"), // line- debt
        value: this.meta.maxToGenerateText,
        valueUnit: this.meta.debtSymbol,
      },
      {
        label: this.$t("form.info.stability-fee"),
        value: this.meta.stabilityFeeText,
        hint: this.$t("form.tooltip.stability-fee"),
      },
    ];
  }
}
</script>
