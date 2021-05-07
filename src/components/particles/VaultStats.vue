<template>
  <v-layout column class="f-bg-greyscale-7">
    <div v-if="gridTitle" class="mx-4 mt-4 mb-2 f-title-3 f-greyscale-1">
      {{ gridTitle }}
    </div>
    <f-info-grid :window-size="2">
      <value-changed-info-grid-item
        v-for="(item, ix) in infos"
        :key="ix"
        :index="ix"
        :title="item.title"
        :value="item.value"
        :value-unit="item.valueUnit"
        :value-color="item.valueColor"
        :value-custom-color="item.valueCustomColor"
        :showChange="item.showChange"
        :changed-value="item.changedValue"
        :changed-value-color="item.changedValueColor"
        :disable-changed-icon="item.disableChangedIcon"
        :hint="item.hint"
      ></value-changed-info-grid-item>
    </f-info-grid>
  </v-layout>
</template>

<script lang="ts" scoped>
import { Vue, Component, Prop, Ref } from "vue-property-decorator";
import { Getter } from "vuex-class";
import { ICollateral, IVault } from "~/services/types/vo";
import { VatAction } from "~/types";
import ValueChangedInfoGridItem from "~/components/particles/ValueChangedInfoGridItem.vue";
import BigNumber from "bignumber.js";
import { debounce } from "~/utils/helper";

@Component({
  components: {
    ValueChangedInfoGridItem,
  },
})
export default class VaultStats extends Vue {
  @Getter("global/getAssetById") getAssetById;
  @Getter("global/getWalletAssetById") getWalletAssetById;
  @Prop() vault!: IVault;
  @Prop() collateral!: ICollateral;
  @Prop({ type: String, default: undefined }) title!: string;
  @Prop() amount!: string;
  @Prop() type!: VatAction;
  @Prop({ type: Boolean, default: true }) showDebt;
  @Prop({ type: Boolean, default: false }) showPenalty;

  get gridTitle() {
    if (this.title !== undefined) {
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

  get showChange() {
    return (
      this.$utils.number.isValid(Number(this.amount)) &&
      Number(this.amount) !== 0
    );
  }

  get showDebtChange() {
    return (
      this.type === VatAction.VatPayback || this.type === VatAction.VatGenerate
    );
  }

  get meta() {
    const debtAmount =
      Number(this.vault?.art || "0") * Number(this.collateral?.rate || "1");
    const collateralAmount = Number(this.vault?.ink);
    const collateralizationRatio =
      (collateralAmount * Number(this.collateral?.price)) / debtAmount;
    const collateralizationRatioText = this.$utils.number.toFixed(
      collateralizationRatio * 100,
      4
    );
    const liquidationRatio = Number(this.collateral?.mat);
    const liquidationPrice = (debtAmount * liquidationRatio) / collateralAmount;
    const liquidationPenalty = this.$utils.number.toFixed(
      (Number(this.collateral?.chop) - 1) * 100,
      4
    );
    const stabilityFee = this.$utils.number.toFixed(
      (Number(this.collateral?.duty) - 1) * 100,
      4
    );
    let changedPrice;
    let changedRatio;
    let changedRisk;
    let changedAmount;
    if (this.showChange) {
      const diffAmount = Number(this.amount);
      switch (this.type) {
        case VatAction.VatDeposit:
          changedPrice =
            (debtAmount * liquidationRatio) / (collateralAmount + diffAmount);
          changedRatio =
            ((collateralAmount + diffAmount) * Number(this.collateral?.price)) /
            debtAmount;
          changedRisk = this.$utils.helper.risk(
            changedRatio,
            this.collateral.mat
          );
          break;
        case VatAction.VatWithdraw:
          changedPrice =
            (debtAmount * liquidationRatio) / (collateralAmount - diffAmount);
          changedRatio =
            ((collateralAmount - diffAmount) * Number(this.collateral?.price)) /
            debtAmount;
          changedRisk = this.$utils.helper.risk(
            changedRatio,
            this.collateral.mat
          );
          break;
        case VatAction.VatGenerate:
          changedPrice =
            ((debtAmount + diffAmount) * liquidationRatio) / collateralAmount;
          changedRatio =
            (collateralAmount * Number(this.collateral?.price)) /
            (debtAmount + diffAmount);
          changedRisk = this.$utils.helper.risk(
            changedRatio,
            this.collateral.mat
          );
          changedAmount = debtAmount + diffAmount;
          break;
        case VatAction.VatPayback:
          changedPrice =
            ((debtAmount - diffAmount) * liquidationRatio) / collateralAmount;
          changedRatio =
            (collateralAmount * Number(this.collateral?.price)) /
            (debtAmount - diffAmount);
          changedRisk = this.$utils.helper.risk(
            changedRatio,
            this.collateral.mat
          );
          changedAmount = debtAmount - diffAmount;
          if (changedAmount < 0) changedAmount = 0;
          break;
        default:
          break;
      }
    }

    return {
      debtAmount,
      liquidationPrice: this.$utils.number.toPrecision(liquidationPrice),
      collateralizationRatio,
      collateralizationRatioText,
      liquidationPenalty,
      stabilityFee,
      changedPrice: this.$utils.number.isValid(changedPrice)
        ? this.$utils.number.toPrecision(changedPrice)
        : "0",
      changedRatio:
        changedRatio < 0 || !this.$utils.number.isValid(changedRatio)
          ? "N/A"
          : this.$utils.number.toFixed(changedRatio * 100, 4),
      changedRisk,
      changedAmount,
    };
  }

  updateInfoGrid = () => {
    console.log("onResize");
    const fInfoGrid = document.getElementsByClassName("f-info-grid");
    const fInner = document.getElementsByClassName("f-info-grid-inner");
    const gridWidth = fInfoGrid[0].clientWidth;
    fInner[0].setAttribute(
      "style",
      `transform: translateX(0vw); width: ${gridWidth}px;`
    );
    const items = document.getElementsByClassName("f-info-grid-item");
    let itemWidth = gridWidth / 2;
    if (gridWidth >= 768) itemWidth = gridWidth * 0.3;
    if (gridWidth >= 1200) itemWidth = gridWidth / 4;
    for (let index = 0; index < items.length; index++) {
      const element = items[index];
      element.setAttribute("style", `width:${itemWidth}px`);
    }
  };

  resizeEventListener = debounce(this.updateInfoGrid, 200);

  mounted() {
    this.updateInfoGrid();
    window.addEventListener("resize", this.resizeEventListener);
  }

  beforeDestroy() {
    window.removeEventListener("resize", this.resizeEventListener);
  }

  get infos() {
    const infos = [
      {
        title: this.$t("form.info.liquidation-price"), // debt * ratio / collateral
        value: this.meta.liquidationPrice,
        valueUnit: this.debtAsset?.symbol,
        hint: this.$t("form.tooltip.liquidation-price"),
        changedValue: this.meta.changedPrice,
        changedValueColor: this.meta.changedRisk,
        showChange: this.showChange,
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
        hint: this.$t("form.tooltip.collateralization-ratio"),
        changedValue: this.meta.changedRatio,
        changedValueColor: this.meta.changedRisk,
        showChange: this.showChange,
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
          4
        ),
        valueUnit: "%",
        hint: this.$t("form.tooltip.minimum-ratio"),
      },
    ] as any[];
    if (this.showDebt) {
      infos.push({
        // title: this.$t("form.info.liquidation-penalty"),
        title: this.$t("form.info.symbol-debt", {
          symbol: this.debtAsset?.symbol,
        }),
        value: this.$utils.number.toPrecision(
          this.meta.debtAmount,
          8,
          BigNumber.ROUND_UP
        ),
        valueUnit: this.debtAsset?.symbol,
        changedValue: this.$utils.number.toPrecision(
          this.meta.changedAmount,
          8,
          BigNumber.ROUND_UP
        ),
        showChange: this.showChange && this.showDebtChange,
      });
    }
    if (this.showPenalty) {
      infos.push({
        title: this.$t("form.info.liquidation-penalty"),
        value: this.meta.liquidationPenalty,
        valueUnit: "%",
      });
    }
    infos.push({
      title: this.$t("form.info.stability-fee"),
      value: this.meta.stabilityFee,
      valueUnit: "%",
      hint: this.$t("form.tooltip.stability-fee"),
    });
    return infos;
  }
}
</script>

<style></style>
