<template>
  <v-layout column class="f-bg-greyscale-7">
    <div v-if="gridTitle" class="mx-4 mt-4 mb-2 title f-greyscale-1">
      {{ gridTitle }}
    </div>
    <div>
      <div
        class="mx-4 f-body-2"
        v-for="(item, ix) in infos"
        :key="ix"
        :index="ix"
      >
        <v-layout style="height: 65.4px" align-center>
          <div class="f-greyscale-3">{{ item.title }}</div>
          <v-btn
            v-if="item.hint"
            icon
            x-small
            :ripple="false"
            color="f-greyscale-3"
            @click="openHint(item.hint)"
          >
            <v-icon size="14">$iconQuestion</v-icon>
          </v-btn>
          <v-spacer />
          <div class="f-greyscale-1">
            <span
              :class="
                'f-info-grid-item-value ' +
                (item.valueColor ? `${item.valueColor}--text` : '')
              "
              >{{ item.value }}</span
            >
            <span v-if="!item.showChange">{{ item.valueUnit }}</span>
          </div>
          <v-icon class="mx-2" v-if="item.showChange" size="14">
            $iconPointerRight
          </v-icon>
          <div class="f-greyscale-1" v-if="item.showChange">
            <span
              :class="
                'f-info-grid-item-value ' +
                (item.changedValueColor
                  ? `${item.changedValueColor}--text`
                  : '')
              "
              >{{ item.changedValue }}</span
            >
            <span>{{ item.valueUnit }}</span>
          </div>
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

  get gridTitle() {
    if (this.title !== undefined) {
      return this.title;
    } else {
      return this.$t("form.info.vault-stats-title");
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

  get isValidOracle() {
    const next = this.$utils.time.oracleNext(this.gemOracle, this.daiOracle);
    return next && next.peek_at && dayjs(next.peek_at).isAfter(Date.now());
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
        title: this.$t("form.info.current-price"),
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
