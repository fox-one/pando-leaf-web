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
import { LINKS } from "~/constants";

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

    const {
      debtSymbol,
      collateralSymbol,
      nextPrice,
      collateralPrice,
    } = getters.getMarketFields(this.collateral?.id);

    const risk = this.$utils.collateral.getRiskLevelMeta(
      collateralizationRatio,
      +this.collateral?.mat
    );

    const isValidPrice =
      collateralPrice !== nextPrice?.price &&
      this.$utils.oracle.isValidOracle(nextPrice);
    const nextPriceTime = isValidPrice
      ? this.$utils.time.format(nextPrice?.time)
      : "-";

    return {
      liquidationPriceText,
      collateralizationRatio,
      collateralizationRatioText,
      maxToGenerateText,
      nextPrice,
      nextPriceTime,
      currentPrice: format({ n: this.collateral?.price }),
      minimumRatio: toPercent({ n: this.collateral?.mat }),
      stabilityFeeText,
      collateralSymbol,
      debtSymbol,
      risk,
    };
  }

  get infos() {
    const { isValidOracle } = this.$utils.oracle;
    return [
      {
        label: this.$t("common.liquidation-price"), // mint * mat / deposit
        value: this.meta.liquidationPriceText,
        valueUnit: `${this.meta.debtSymbol}`,
        hint: this.$t("tooltip.liquidation-price"),
        learnMore: LINKS["vault.liquidation"],
      },
      {
        label: this.$t("common.current-symbol-price", {
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
        label: this.$t("common.collateralization-ratio"), // deposit * price / mint
        value: this.meta.collateralizationRatioText,
        valueColor: this.meta.risk.color,
        hint: this.$t("tooltip.collateralization-ratio"),
        learnMore: LINKS["vault.liquidation"],
      },
      {
        label: this.$t("common.minimum-ratio"),
        value: this.meta.minimumRatio,
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
