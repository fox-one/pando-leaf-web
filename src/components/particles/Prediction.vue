<template>
  <v-layout column class="f-bg-greyscale-7">
    <div v-if="gridTitle" class="mx-4 mt-4 mb-2 title f-greyscale-1">
      {{ gridTitle }}
    </div>
    <div>
      <div
        class="mx-4 f-body-2"
        v-for="(item, ix) in outData ? outData : infos"
        :key="ix"
        :index="ix"
      >
        <v-layout class="py-6" column>
          <v-layout align-center>
            <div class="f-greyscale-3">{{ item.title }}</div>
            <base-tooltip :hint="item.hint"></base-tooltip>
            <v-spacer />
            <div :class="item.showChange ? 'f-greyscale-3' : 'f-greyscale-1'">
              <span :class="item.valueColor ? `f-${item.valueColor}` : ''">{{
                item.value
              }}</span>
              <span :class="item.valueColor ? `f-${item.valueColor}` : ''">{{
                item.valueUnit
              }}</span>
            </div>
          </v-layout>
          <v-layout
            class="mt-3"
            v-if="item.showChange"
            justify-end
            align-center
          >
            <v-icon class="mx-2" v-if="item.showChange" size="14">
              $iconPointerRight
            </v-icon>
            <div class="f-greyscale-1" v-if="item.showChange">
              <span
                :class="`${
                  item.changedValueColor ? `f-${item.changedValueColor}` : ''
                }`"
                >{{ item.changedValue }}</span
              >
              <span>{{ item.valueUnit }}</span>
            </div>
          </v-layout>
        </v-layout>
        <div class="divider" />
      </div>
    </div>
  </v-layout>
</template>

<script lang="ts" scoped>
import { Vue, Component, Prop } from "vue-property-decorator";
import { Getter } from "vuex-class";
import { ICollateral, IOracle, IVault } from "~/services/types/vo";
import { VatAction } from "~/types";
import BigNumber from "bignumber.js";
import IconPointerRight from "@/components/icons/PointerRight.vue";
import dayjs from "dayjs";

@Component({
  components: {
    IconPointerRight,
  },
})
export default class Prediction extends Vue {
  @Getter("global/getAssetById") getAssetById;
  @Getter("global/getWalletAssetById") getWalletAssetById;
  @Getter("oracle/findByAssetId") getOracleByAssetId!: (id) => IOracle;
  @Prop() vault!: IVault;
  @Prop() collateral!: ICollateral;
  @Prop({ type: String, default: undefined }) title!: string;
  @Prop() amount!: string;
  @Prop() type!: VatAction;
  @Prop({ type: Boolean, default: true }) showDebt;
  @Prop({ type: Boolean, default: false }) showPenalty;
  @Prop({ default: null }) outData!: any[];

  get gridTitle() {
    if (this.title !== undefined) {
      return this.title;
    } else {
      return this.$t("form.predication");
    }
  }

  get gemOracle() {
    return this.getOracleByAssetId(this.collateral?.gem);
  }

  get daiOracle() {
    return this.getOracleByAssetId(this.collateral?.dai);
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
      1
    );
    const liquidationRatio = Number(this.collateral?.mat);
    const liquidationPrice = (debtAmount * liquidationRatio) / collateralAmount;
    const liquidationPenalty = this.$utils.number.toFixed(
      (Number(this.collateral?.chop) - 1) * 100,
      1
    );
    const stabilityFee = this.$utils.number.toFixed(
      (Number(this.collateral?.duty) - 1) * 100,
      1
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
      liquidationPrice: this.$utils.number.toPrecision(liquidationPrice || "-"),
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
          : this.$utils.number.toFixed(changedRatio * 100, 1),
      changedRisk,
      changedAmount,
    };
  }

  get isValidOracle() {
    const next = this.$utils.time.oracleNext(this.gemOracle, this.daiOracle);
    return next && next.peek_at && dayjs(next.peek_at).isAfter(Date.now());
  }

  get infos() {
    const infos = [
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
        title: this.$t("form.info.minimum-ratio"),
        value: this.$utils.number.toFixed(
          Number(this.collateral?.mat) * 100,
          1
        ),
        valueUnit: "%",
        hint: this.$t("form.tooltip.minimum-ratio"),
      },
      {
        title: this.$t("form.info.liquidation-price"), // debt * ratio / collateral
        value: this.meta.liquidationPrice,
        valueUnit: this.debtAsset?.symbol,
        hint: this.$t("form.tooltip.liquidation-price"),
        changedValue: this.meta.changedPrice,
        showChange: this.showChange,
      },
      {
        title: this.$t("form.info.current-price", {
          symbol: `${this.collateralAsset?.symbol}/${this.debtAsset?.symbol}`,
        }),
        value: this.collateral?.price,
        valueUnit: this.debtAsset?.symbol,
        changedValue:
          this.$utils.time.oracleNext(this.gemOracle, this.daiOracle)?.price ||
          "",
        showChange: this.isValidOracle,
        hint: this.isValidOracle
          ? this.$t("form.info.oracle-price", {
              time: this.$utils.time.format(
                this.$utils.time.oracleNext(this.gemOracle, this.daiOracle)
                  ?.peek_at
              ),
            })
          : null,
      },
    ] as any[];
    if (this.showDebt) {
      infos.unshift({
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

<style scoped lang="scss">
.title {
  font-weight: 600;
  font-size: 18px;
}
.divider {
  height: 0.5px;
  background: #000000;
  opacity: 0.1;
}
</style>
