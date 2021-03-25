<template>
  <v-layout column class="f-bg-greyscale-7">
    <div class="mx-4 f-body-2 f-greyscale-3 text-center">
      {{ gridTitle }}
    </div>
    <f-info-grid :window-size="2">
      <f-info-grid-item
        v-for="(item, ix) in infos"
        :key="ix"
        :index="ix"
        :title="item.title"
        :value="item.value"
        :value-unit="item.valueUnit"
        :value-color="item.valueColor"
        :value-custom-color="item.valueCustomColor"
        :hint="item.hint"
      ></f-info-grid-item>
    </f-info-grid>
  </v-layout>
</template>

<script lang="ts" scoped>
import { Vue, Component, Prop } from "vue-property-decorator";
import { Getter } from "vuex-class";
import { ICollateral, IVault } from "~/services/types/vo";

@Component
export default class VaultStats extends Vue {
  @Getter("global/getAssetById") getAssetById;
  @Getter("global/getWalletAssetById") getWalletAssetById;
  @Prop() vault!: IVault;
  @Prop() collateral!: ICollateral;
  @Prop() title!: string;

  get gridTitle() {
    if (this.title !== null && this.title !== undefined) {
      return this.title;
    } else {
      return this.$t("form.info.vault-stats-title");
    }
  }

  get collateralAsset() {
    return this.getAssetById(this.collateral?.gem);
  }

  get debtAsset() {
    return this.getAssetById(this.collateral?.dai);
  }

  get meta() {
    const debtAmount =
      Number(this.vault?.art || "0") * Number(this.collateral?.rate || "1");
    const collateralAmount = Number(this.vault?.ink);
    const collateralizationRatio =
      (collateralAmount * Number(this.collateral?.price)) / debtAmount;
    const collateralizationRatioText = this.$utils.number.toFixed(
      collateralizationRatio * 100,
      2
    );
    const liquidationRatio = Number(this.collateral?.mat);
    const liquidationPrice = (debtAmount * liquidationRatio) / collateralAmount;
    const liquidationPenalty = this.$utils.number.toFixed(
      (Number(this.collateral?.chop) - 1) * 100,
      2
    );
    const stabilityFee = this.$utils.number.toFixed(
      (Number(this.collateral?.duty) - 1) * 100,
      2
    );
    return {
      liquidationPrice: this.$utils.number.toPrecision(liquidationPrice),
      collateralizationRatio,
      collateralizationRatioText,
      liquidationPenalty,
      stabilityFee,
    };
  }

  get infos() {
    return [
      {
        title: this.$t("form.info.liquidation-price"), // debt * ratio / collateral
        value: this.meta.liquidationPrice,
        valueUnit: this.debtAsset?.symbol,
      },
      {
        title: this.$t("form.info.collateralization-ratio"), //
        value: this.$utils.number.isValid(this.meta.collateralizationRatio)
          ? this.meta.collateralizationRatioText
          : "N/A",
        valueUnit: this.$utils.number.isValid(this.meta.collateralizationRatio)
          ? `%`
          : "",
        valueColor: this.$utils.helper.risk(
          this.meta.collateralizationRatio,
          this.collateral.mat
        ),
      },
      {
        title: this.$t("form.info.current-price"),
        value: this.collateral?.price,
        valueUnit: this.debtAsset?.symbol,
      },
      {
        title: this.$t("form.info.minimum-ratio"),
        value: this.$utils.number.toFixed(
          Number(this.collateral?.mat) * 100,
          2
        ),
        valueUnit: "%",
        //        hint: "Some description about profit.",
      },
      {
        title: this.$t("form.info.liquidation-penalty"),
        value: this.meta.liquidationPenalty,
        valueUnit: "%",
      },
      {
        title: this.$t("form.info.stability-fee"),
        value: this.meta.stabilityFee,
        valueUnit: "%",
      },
    ];
  }
}
</script>

<style></style>
