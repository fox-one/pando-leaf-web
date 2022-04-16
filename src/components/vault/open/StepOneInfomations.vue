<template>
  <div>
    <base-information-item-list :informations="infos" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { LINKS } from "~/constants";

@Component
export default class StepOneInfomations extends Vue {
  @Prop() collateral!: API.Collateral;

  @Prop() depositAmount!: string;

  get meta() {
    const { format, toPercent } = this.$utils.number;
    const getters = this.$store.getters as Getter.GettersTree;
    const { maxToGenerateText, stabilityFeeText, liquidationPriceText } =
      getters.openVaultPrediction(+this.depositAmount, 0, this.collateral);

    const {
      debtSymbol,
      collateralSymbol,
      nextPrice,
      collateralPrice,
      minimumRatioText,
    } = getters.getMarketFields(this.collateral?.id);

    const isValidPrice =
      collateralPrice !== nextPrice?.price &&
      this.$utils.oracle.isValidOracle(nextPrice);
    const nextPriceTime = isValidPrice
      ? this.$utils.time.format(nextPrice?.time)
      : "-";

    return {
      minimumRatioText,
      maxToGenerateText,
      liquidationPriceText,
      nextPrice,
      nextPriceTime,
      currentPrice: format({ n: this.collateral?.price }),
      minimumRatio: toPercent({ n: this.collateral?.mat }),
      stabilityFeeText,
      collateralSymbol,
      debtSymbol,
    };
  }

  get infos() {
    const { isValidOracle } = this.$utils.oracle;
    return [
      {
        label: this.$t("common.current-symbol-price", {
          symbol: `${this.meta.collateralSymbol}`,
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
        label: this.$t("common.liquidation-price"), // mint * mat / deposit
        value: this.meta.liquidationPriceText,
        valueUnit: `${this.meta.debtSymbol}`,
        hint: this.$t("tooltip.liquidation-price"),
        learnMore: LINKS["vault.liquidation"],
      },
      {
        label: this.$t("common.minimum-ratio"),
        value: this.meta.minimumRatioText,
        hint: this.$t("tooltip.minimum-ratio"),
        learnMore: LINKS["vault.liquidation-ratio"],
      },
      {
        label: this.$t("form.market-debt-ceiling"), // line- debt
        value: this.meta.maxToGenerateText,
        valueUnit: this.meta.debtSymbol,
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
