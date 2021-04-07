<template>
  <v-layout column class="f-bg-greyscale-7">
    <div class="mx-4 f-body-2 f-greyscale-3 text-center">
      {{ gridTitle }}
    </div>
    <f-info-grid :window-size="2">
      <f-info-grid-item>
        <div class="f-info-grid-item-content">
          <div
            class="f-info-grid-item-title f-greyscale-3 f-caption d-flex align-center"
          >
            {{ infos[0].title }}
          </div>
          <div
            class="flex f-info-grid-item-value-wrapper f-greyscale-1 f-body-2 d-flex"
          >
            <div class="f-info-grid-item-value">
              {{ infos[0].value }}
            </div>
            <div class="f-info-grid-item-value-unit">
              {{ infos[0].valueUnit }}
            </div>
          </div>
          <div
            v-if="showChanged"
            class="flex f-info-grid-item-value-wrapper f-greyscale-1 f-body-2 d-flex"
          >
            <v-icon size="14">{{ $icons.mdiSubdirectoryArrowRight }}</v-icon>
            <div
              :class="
                'f-info-grid-item-value ' +
                `${infos[0].changedValueColor}--text`
              "
            >
              {{ infos[0].changedValue }}
            </div>
            <div class="f-info-grid-item-value-unit">
              {{ infos[0].valueUnit }}
            </div>
          </div>
        </div>
      </f-info-grid-item>
      <f-info-grid-item>
        <div class="f-info-grid-item-content">
          <div
            class="f-info-grid-item-title f-greyscale-3 f-caption d-flex align-center"
          >
            {{ infos[1].title }}
          </div>
          <div
            class="flex f-info-grid-item-value-wrapper f-greyscale-1 f-body-2 d-flex"
          >
            <div
              :class="
                'f-info-grid-item-value ' + `${infos[1].valueColor}--text`
              "
            >
              {{ infos[1].value }}<span></span>
            </div>
            <div class="f-info-grid-item-value-unit">
              {{ infos[1].valueUnit }}
            </div>
          </div>
          <div
            v-if="showChanged"
            class="flex f-info-grid-item-value-wrapper f-greyscale-1 f-body-2 d-flex"
          >
            <v-icon size="14">{{ $icons.mdiSubdirectoryArrowRight }}</v-icon>
            <div
              :class="
                'f-info-grid-item-value ' +
                `${infos[1].changedValueColor}--text`
              "
            >
              {{ infos[1].changedValue }}<span></span>
            </div>
            <div class="f-info-grid-item-value-unit">
              {{ infos[1].valueUnit }}
            </div>
          </div>
        </div>
      </f-info-grid-item>
      <f-info-grid-item
        v-for="(item, ix) in infos.slice(2, 6)"
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
import { VatAction } from "~/types";

@Component
export default class VaultStats extends Vue {
  @Getter("global/getAssetById") getAssetById;
  @Getter("global/getWalletAssetById") getWalletAssetById;
  @Prop() vault!: IVault;
  @Prop() collateral!: ICollateral;
  @Prop() title!: string;
  @Prop() amount!: string;
  @Prop() type!: VatAction;

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

  get showChanged() {
    return (
      this.$utils.number.isValid(Number(this.amount)) &&
      Number(this.amount) !== 0
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
    if (this.showChanged) {
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
          break;
        default:
          break;
      }
    }

    return {
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
    };
  }

  get infos() {
    return [
      {
        title: this.$t("form.info.liquidation-price"), // debt * ratio / collateral
        value: this.meta.liquidationPrice,
        valueUnit: this.debtAsset?.symbol,
        changedValue: this.meta.changedPrice,
        changedValueColor: this.meta.changedRisk,
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
        changedValue: this.meta.changedRatio,
        changedValueColor: this.meta.changedRisk,
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
