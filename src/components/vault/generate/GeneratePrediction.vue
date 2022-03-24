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
      ratioText,
      nextPrice,
      price,
      stabilityFeeText,
    } = getters.getVaultFields(this.vault?.id);

    const { minimumRatio, minimumRatioText, collateralPrice } =
      getters.getMarketFields(this.vault?.collateral_id);

    const risk = this.$utils.collateral.getRiskLevelMeta(ratio, minimumRatio);

    const diffAmount = +this.amount;
    const changedPrice =
      ((debtAmount + diffAmount) * liquidationRatio) / collateralAmount;
    let changedPriceText = format({ n: changedPrice });
    if (!isValid(changedPrice) || changedPrice === 0) {
      changedPriceText = "N/A";
    }
    const changedRatio =
      debtAmount + diffAmount &&
      (collateralAmount * collateralPrice) / (debtAmount + diffAmount);
    let changedRatioText = toPercent({ n: changedRatio, dp: 1 });
    if (!isValid(changedRatio) || changedRatio === 0) {
      changedRatioText = "N/A";
    }
    const changedRisk = this.$utils.collateral.getRiskLevelMeta(
      changedRatio,
      minimumRatio
    );
    const changedAmount = debtAmount + diffAmount;

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
      nextPrice,
      nextPriceTime,
      debtAmount: format({ n: debtAmount }),
      changedPrice,
      changedPriceText,
      changedRatio,
      changedRatioText,
      changedRisk,
      changedAmount: format({ n: changedAmount }),
    };
  }

  get infos() {
    const { isValidOracle } = this.$utils.oracle;
    const { isValid } = this.$utils.number;
    return [
      // {
      //   label: this.$t("common.collateralization-ratio"), // deposit * price / mint
      //   value: this.meta.ratioText,
      //   valueColor: this.meta.risk.color,
      //   hint: this.$t("tooltip.collateralization-ratio"),
      //   learnMore: LINKS["vault.liquidation"],
      //   changedValue: this.meta.changedRatioText,
      //   changedValueColor: this.meta.changedRisk.color,
      //   showChange: isValid(+this.amount),
      // },
      // {
      //   label: this.$t("common.minimum-ratio"),
      //   value: this.meta.minimumRatio,
      //   hint: this.$t("tooltip.minimum-ratio"),
      //   learnMore: LINKS["vault.liquidation-ratio"],
      // },
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
        label: this.$t("common.symbol-price", {
          symbol: `${this.meta.collateralSymbol}/${this.meta.debtSymbol}`,
        }),
        value: this.meta.currentPrice,
        valueUnit: `${this.meta.debtSymbol}`,
        hint: isValidOracle(this.meta.nextPrice)
          ? this.$t("tooltip.next-price", {
              time: this.meta.nextPriceTime,
            })
          : null,
        learnMore: LINKS["vault.price-oracles"],
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
