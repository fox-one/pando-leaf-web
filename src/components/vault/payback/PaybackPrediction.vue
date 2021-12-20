<template>
  <base-information-item-list :informations="infos" />
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { LINKS } from "~/constants";

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
      price,
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
      debtAmount - diffAmount &&
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

    const isValidPrice =
      price !== nextPrice?.price && this.$utils.oracle.isValidOracle(nextPrice);
    const nextPriceTime = isValidPrice
      ? this.$utils.time.format(nextPrice?.time)
      : "-";

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
      nextPriceTime,
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
        label: this.$t("common.collateralization-ratio"), // deposit * price / mint
        value: this.meta.ratioText,
        valueColor: this.meta.risk.color,
        hint: this.$t("tooltip.collateralization-ratio"),
        learnMore: LINKS["vault.liquidation"],
        changedValue: this.meta.changedRatio,
        changedValueColor: this.meta.changedRisk.color,
        showChange: this.meta.ratio !== this.meta.changedRatio,
      },
      {
        label: this.$t("common.minimum-ratio"),
        value: this.meta.minimumRatio,
        hint: this.$t("tooltip.minimum-ratio"),
        learnMore: LINKS["vault.liquidation-ratio"],
      },
      {
        label: this.$t("common.liquidation-price"), // mint * mat / deposit
        value: this.meta.liquidationPriceText,
        valueUnit: `${this.meta.debtSymbol}`,
        hint: this.$t("tooltip.liquidation-price"),
        learnMore: LINKS["vault.liquidation"],
        changedValue: this.meta.changedPriceText,
        showChange:
          this.meta.liquidationPriceText !== this.meta.changedPriceText,
      },
      {
        label: this.$t("common.current-symbol-price", {
          symbol: `${this.meta.collateralSymbol}/${this.meta.debtSymbol}`,
        }),
        hint: isValidOracle(this.meta.nextPrice)
          ? this.$t("tooltip.next-price", {
              time: this.meta.nextPriceTime,
            })
          : null,
        learnMore: LINKS["vault.price-oracles"],
        value: this.meta.currentPrice,
        valueUnit: `${this.meta.debtSymbol}`,
        showChange: isValidOracle(this.meta.nextPrice),
        changedValue: this.meta.nextPrice?.price,
      },
      {
        label: this.$t("common.outstanding-symbol-debt", {
          symbol: this.meta.debtSymbol,
        }), // line- debt
        value: this.meta.debtAmount,
        valueUnit: this.meta.debtSymbol,
        changedValue: this.meta.changedAmount,
      },
      {
        label: this.$t("common.stability-fee"),
        value: this.meta.stabilityFeeText,
        hint: this.$t("tooltip.stability-fee"),
      },
    ];
  }
}
</script>
