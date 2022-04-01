<template>
  <v-form ref="form" class="ma-0 pa-4" autocomplete="off">
    <base-form-input
      :amount.sync="bindAmount"
      :asset="meta.collateralAsset"
      :rules="rules"
      :fillable="false"
      :placeholder="$t('form.withdraw-amount')"
    />

    <v-layout class="slider-text mt-5" align-center justify-space-between>
      <div class="greyscale_3--text">
        {{ $t("common.collateral") }}
      </div>

      <div class="greyscale_1--text">
        {{ meta.collateralAmount }}
      </div>
    </v-layout>

    <v-layout class="slider-text mt-3" align-center justify-space-between>
      <div class="greyscale_3--text">
        {{ $t("form.withdraw-ratio") }}
      </div>

      <f-slider
        class="flex-grow-1 mx-2"
        :value="meta.progress"
        hide-details
        @change="handleSliderChange"
      />

      <div class="greyscale_1--text">
        {{ meta.progressText }}
      </div>
    </v-layout>

    <f-divider class="mt-5" />

    <collateral-ratio-slider
      :collateral-id="meta.collateralId"
      :ratio="meta.changedRatio"
      :risk="meta.changedRisk"
    />

    <f-divider class="mt-5" />

    <withdraw-action
      :vault="vault"
      :amount="bindAmount"
      :disabled="validate.disabled"
      @success="handleSuccess"
    />
  </v-form>
</template>

<script lang="ts" scoped>
import { Vue, Component, Prop, PropSync, Ref } from "vue-property-decorator";
import BaseRiskSlider from "@/components/base/RiskSlider.vue";
import WithdrawAction from "./WithdrawAction.vue";
import CollateralRatioSlider from "./../CollateralRatioSlider.vue";
import { toPercent } from "@foxone/utils/number";
import BigNumber from "bignumber.js";
import { RISK } from "~/enums";

@Component({
  components: {
    BaseRiskSlider,
    WithdrawAction,
    CollateralRatioSlider,
  },
})
export default class extends Vue {
  @Prop() vault!: API.Vault;

  @PropSync("amount") bindAmount!: string;

  @Ref("form") form!: any;

  showTip = false;

  get meta() {
    const getters = this.$store.getters as Getter.GettersTree;

    const {
      collateralAsset,
      avaliableWithdraw,
      collateralSymbol,
      collateralAmount,
      debtAmount,
      liquidationRatio,
      price,
    } = getters.getVaultFields(this.vault?.id ?? "");

    const { minimumRatio, collateralPrice } = getters.getMarketFields(
      this.vault?.collateral_id
    );

    const progress = (100 * +this.bindAmount) / avaliableWithdraw;
    const progressText = toPercent({ n: progress / 100 });

    const ratio = ((collateralAmount - +this.bindAmount) * price) / debtAmount;
    const risk = this.$utils.vault.getRiskLevelMeta(ratio, liquidationRatio);

    const diffAmount = +this.bindAmount;
    const changedRatio =
      debtAmount &&
      ((collateralAmount - diffAmount) * collateralPrice) / debtAmount;

    const changedRisk = this.$utils.collateral.getRiskLevelMeta(
      changedRatio,
      minimumRatio
    );

    return {
      collateralId: this.vault?.collateral_id ?? "",
      risk,
      liquidationRatio,
      ratio,
      collateralAsset,
      collateralSymbol,
      collateralAmount,
      avaliableWithdraw,
      progress,
      progressText,
      changedRatio,
      changedRisk,
    };
  }

  get validateRules() {
    return [
      (v: string) => !!v || this.$t("common.amount-required"),
      (v: string) => +v > 0 || this.$t("common.amount-invalid"),
      (v: string) =>
        +v <= this.meta.avaliableWithdraw || this.$t("common.amount-invalid"),
      () => {
        if (this.meta.ratio < this.meta.liquidationRatio) {
          return this.$t("validate.below-liquidation-rate");
        }
        return true;
      },
    ];
  }

  get rules() {
    return this.validateRules.concat([
      () => {
        if (this.meta.risk.value === RISK.HIGH) {
          return this.$t("validate.high-risk-withdraw", {
            symbol: this.meta.collateralSymbol,
          });
        }
        return true;
      },
      () =>
        this.meta.risk.value !== RISK.MEDIUM ||
        this.$t("validate.medium-risk-withdraw", {
          symbol: this.meta.collateralSymbol,
        }),
    ]);
  }

  handleSliderChange(value: string) {
    const newAmount = new BigNumber(value)
      .div(100)
      .times(this.meta.avaliableWithdraw)
      .decimalPlaces(8)
      .toFixed(8);

    this.bindAmount = newAmount;
  }

  handleSuccess() {
    this.form.reset();
    this.$uikit.toast.success({
      message: this.$t("common.action-success") + "",
    });
  }

  get validate() {
    for (const rule of this.validateRules) {
      if (true !== rule(this.bindAmount)) {
        return { disabled: true };
      }
    }
    if (this.meta.changedRisk.value === RISK.HIGH) {
      return { disabled: true };
    }
    return { disabled: false };
  }
}
</script>
<style lang="scss" scoped>
.slider-text {
  font-weight: 500;
  font-size: 13px;
  line-height: 16px;
}
</style>
