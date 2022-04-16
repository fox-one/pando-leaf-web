<template>
  <v-form ref="form" class="ma-0 pa-4" autocomplete="off">
    <div class="text-3 mb-4 text-center greyscale_1--text">
      {{ $t("form.please-input-deposit-amount") }}
    </div>

    <step-one-form-input
      :amount.sync="bindDepositAmount"
      :asset="asset"
      :rules="rulesDeposit"
      :placeholder="$t('form.deposit-amount')"
      @select="handleCollateralSelect"
    />

    <step-one-action :disabled="validate.disabled" @next="handleNext" />
  </v-form>
</template>

<script lang="ts" scoped>
import { Vue, Component, PropSync, Ref } from "vue-property-decorator";
import StepOneAction from "./StepOneAction.vue";
import StepOneFormInput from "./StepOneFormInput.vue";
import BaseRiskSlider from "@/components/base/RiskSlider.vue";
import BigNumber from "bignumber.js";

@Component({
  components: {
    StepOneFormInput,
    BaseRiskSlider,
    StepOneAction,
  },
})
export default class StepOneForm extends Vue {
  @PropSync("collateral") bindCollateral!: API.Collateral;

  @PropSync("depositAmount") bindDepositAmount!: string;

  @Ref("form") form!: any;

  get asset() {
    const getters = this.$store.getters as Getter.GettersTree;
    return getters["asset/getAssetById"](this.bindCollateral?.gem);
  }

  get meta() {
    const getters = this.$store.getters as Getter.GettersTree;
    const { format, toPrecision } = this.$utils.number;

    const depositNum = Number(this.bindDepositAmount);

    const {
      collateralizationRatio,
      liquidationPrice,
      liquidationPriceText,
      maxAvailable,
    } = getters.openVaultPrediction(depositNum, 0, this.bindCollateral);
    const marketFields = getters.getMarketFields(this.bindCollateral?.id);

    const suggest = toPrecision({
      n: maxAvailable * 0.6,
      dp: 8,
      mode: BigNumber.ROUND_DOWN,
    });
    return {
      ...marketFields,
      collateralizationRatio,
      liquidationPrice,
      liquidationPriceText,
      currentDepositPrice: format({ n: this.bindCollateral?.price || "0" }),
      suggest,
    };
  }

  handleNext() {
    this.$emit("next");
  }

  handleCollateralSelect(collateral: API.Collateral) {
    this.bindCollateral = collateral;
  }

  // 表单校验
  get rulesDeposit() {
    return [
      (v: string) => !!v || this.$t("common.amount-required"),
      (v: string) => +v > 0 || this.$t("common.amount-invalid"),
      (v: string) =>
        (+v * +this.bindCollateral?.price) / this.meta.minimumRatio >=
          Number(this.bindCollateral?.dust) ||
        this.$t("validate.minimum-collateral", {
          amount: this.bindCollateral?.dust,
          symbol: this.meta.debtSymbol,
        }),
    ];
  }

  // 按钮是否可用
  get validate() {
    for (const rule of this.rulesDeposit) {
      if (true !== rule(this.bindDepositAmount)) {
        return { disabled: true };
      }
    }
    return { disabled: false };
  }
}
</script>
