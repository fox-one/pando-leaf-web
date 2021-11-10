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
export default class extends Vue {
  @Prop() vault!: API.Vault;

  @Prop() amount!: string;

  get meta() {
    const { format, toPercent, isValid } = this.$utils.number;
    const getters = this.$store.getters as Getter.GettersTree;

    const {
      collateral,
      collateralSymbol,
      collateralAmount,
      debtSymbol,
      liquidationRatio,
      liquidationPriceText,
      debtAmount,
      ratio,
      ratioText,
      nextPrice,
      stabilityFeeText,
    } = getters.getVaultFields(this.vault?.id);

    const {
      minimumRatio,
      minimumRatioText,
      collateralPrice,
    } = getters.getMarketFields(this.vault?.collateral_id);

    const risk = this.$utils.collateral.getRiskLevelMeta(ratio, minimumRatio);

    const diffAmount = +this.amount;
    let changedPrice =
      ((debtAmount - diffAmount) * liquidationRatio) / collateralAmount;
    let changedRatio =
      debtAmount &&
      (collateralAmount * collateralPrice) / (debtAmount - diffAmount);
    const changedRisk = this.$utils.collateral.getRiskLevelMeta(
      changedRatio,
      minimumRatio
    );
    let changedAmount = debtAmount - diffAmount;

    if (changedRatio < 0) changedRatio = 0;
    if (changedPrice < 0) changedPrice = 0;
    if (changedAmount < 0) changedAmount = 0;

    let changedPriceText = format({ n: changedPrice });
    if (!isValid(changedPrice) || changedPrice === 0) {
      changedPriceText = "N/A";
    }

    let changedRatioText = toPercent({ n: changedRatio, dp: 1 });
    if (!isValid(changedRatio) || changedRatio === 0) {
      changedRatioText = "N/A";
    }

    return {
      liquidationPriceText,
      ratio,
      ratioText,
      currentPrice: format({ n: collateral?.price ?? 0 }),
      minimumRatio: minimumRatioText,
      stabilityFeeText,
      collateralSymbol,
      debtSymbol,
      risk,
      debtAmount: format({ n: debtAmount }),
      changedPrice,
      changedPriceText,
      changedRatio,
      changedRatioText,
      changedRisk,
      nextPrice,
      changedAmount: format({ n: changedAmount }),
    };
  }

  get infos() {
    const { isValidOracle } = this.$utils.oracle;
    return [
      {
        label: this.$t("form.info.collateralization-ratio"), // deposit * price / mint
        value: this.meta.ratioText,
        valueColor: this.meta.risk.color,
        hint: this.$t("form.tooltip.collateralization-ratio"),
        changedValue: this.meta.changedRatio,
        changedValueColor: this.meta.changedRisk.color,
        showChange: this.meta.ratio !== this.meta.changedRatio,
      },
      {
        label: this.$t("form.info.minimum-ratio"),
        value: this.meta.minimumRatio,
        hint: this.$t("form.tooltip.minimum-ratio"),
      },
      {
        label: this.$t("form.info.liquidation-price"), // mint * mat / deposit
        value: this.meta.liquidationPriceText,
        valueUnit: `${this.meta.debtSymbol}`,
        hint: this.$t("form.tooltip.liquidation-price"),
        changedValue: this.meta.changedPriceText,
        showChange:
          this.meta.liquidationPriceText !== this.meta.changedPriceText,
      },
      {
        label: this.$t("form.info.current-symbol-price", {
          symbol: `${this.meta.collateralSymbol}/${this.meta.debtSymbol}`,
        }),
        value: this.meta.currentPrice,
        valueUnit: `${this.meta.debtSymbol}`,
        showChange: isValidOracle(this.meta.nextPrice),
        changedValue: this.meta.nextPrice?.price,
      },
      {
        label: this.$t("form.info.symbol-debt", {
          symbol: this.meta.debtSymbol,
        }), // line- debt
        value: this.meta.debtAmount,
        valueUnit: this.meta.debtSymbol,
        changedValue: this.meta.changedAmount,
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
