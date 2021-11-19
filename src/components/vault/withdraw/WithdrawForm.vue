<template>
  <div class="ma-0 pa-4 pb-8">
    <withdraw-form-input
      ref="form-input"
      :vault="vault"
      :rules="rules"
      :amount.sync="bindAmount"
      :placeholder="$t('form.mint-amount')"
    />

    <v-layout class="mt-2 text-1" justify-space-between>
      <div class="greyscale_3--text">
        {{ $t("form.withdraw-ratio") }}
      </div>

      <div class="greyscale_1--text font-weight-bold">
        {{ meta.progressText }}
      </div>
    </v-layout>

    <f-slider
      class="mt-4"
      :value="meta.progress"
      @change="handleSliderChange"
    />

    <withdraw-action
      :vault="vault"
      :amount="bindAmount"
      :disabled="validate.disabled"
      @success="handleSuccess"
    />
  </div>
</template>

<script lang="ts" scoped>
import { Vue, Component, Prop, PropSync, Ref } from "vue-property-decorator";
import WithdrawFormInput from "./WithdrawFormInput.vue";
import BaseRiskSlider from "@/components/base/RiskSlider.vue";
import WithdrawAction from "./WithdrawAction.vue";
import { toPercent } from "@foxone/utils/number";
import BigNumber from "bignumber.js";
import { RISK } from "~/enums";

@Component({
  components: {
    WithdrawFormInput,
    BaseRiskSlider,
    WithdrawAction,
  },
})
export default class extends Vue {
  @Prop() vault!: API.Vault;

  @PropSync("amount") bindAmount!: string;

  @Ref("form-input") formInput!: WithdrawFormInput;

  showTip = false;

  get meta() {
    const getters = this.$store.getters as Getter.GettersTree;

    const {
      avaliableWithdraw,
      collateralSymbol,
      collateralAmount,
      debtAmount,
      liquidationRatio,
      price,
    } = getters.getVaultFields(this.vault?.id ?? "");

    const progress = (100 * +this.bindAmount) / avaliableWithdraw;
    const progressText = toPercent({ n: progress / 100 });

    const ratio = ((collateralAmount - +this.bindAmount) * price) / debtAmount;
    const risk = this.$utils.vault.getRiskLevelMeta(ratio, liquidationRatio);
    return {
      risk,
      liquidationRatio,
      ratio,
      collateralSymbol,
      avaliableWithdraw,
      progress,
      progressText,
    };
  }

  get validateRules() {
    return [
      (v: string) => !!v || this.$t("common.amount-required"),
      (v: string) => +v > 0 || this.$t("common.amount-invalid"),
      (v: string) =>
        +v <= this.meta.avaliableWithdraw || this.$t("common.amount-invalid"),
      (v: string) => {
        if (this.meta.ratio < this.meta.liquidationRatio) {
          return this.$t("validate.below-liquidation-rate");
        }
        return true;
      },
    ];
  }

  get rules() {
    return this.validateRules.concat([
      (v: string) => {
        if (this.meta.risk.value === RISK.HIGH) {
          return this.$t("validate.high-risk-withdraw", {
            symbol: this.meta.collateralSymbol,
          });
        }
        return true;
      },
      (v: string) =>
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
    this.formInput.getForm().reset();
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
    return { disabled: false };
  }
}
</script>
