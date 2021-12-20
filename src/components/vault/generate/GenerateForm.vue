<template>
  <v-form ref="form" class="ma-0 pa-4" autocomplete="off">
    <base-form-input
      :amount.sync="bindDebtAmount"
      :asset="meta.debtAsset"
      :balance="meta.suggest"
      :rules="rules"
      :leftLabel="$t('common.suggest')"
      :placeholder="$t('form.mint-amount')"
    />

    <generate-action
      :vault="vault"
      :amount="bindDebtAmount"
      :disabled="validate.disabled"
      @success="handleSuccess"
    />
  </v-form>
</template>

<script lang="ts" scoped>
import { Vue, Component, Prop, PropSync, Ref } from "vue-property-decorator";
import BaseFormInput from "@/components/base/FormInput.vue";
import BaseRiskSlider from "@/components/base/RiskSlider.vue";
import GenerateAction from "./GenerateAction.vue";
import BigNumber from "bignumber.js";
import { toPercent } from "@foxone/utils/number";
import { RISK } from "~/enums";

@Component({
  components: {
    BaseFormInput,
    BaseRiskSlider,
    GenerateAction,
  },
})
export default class GenerateForm extends Vue {
  @Prop() vault!: API.Vault;

  @PropSync("debtAmount") bindDebtAmount!: string;

  @Ref("form") form!: any;

  get meta() {
    const getters = this.$store.getters as Getter.GettersTree;
    const { format } = this.$utils.number;

    const {
      liquidationPrice,
      collateral,
      ratio,
      avaliableDebt,
      debtAmount,
      debtSymbol,
      debtAsset,
      collateralAmount,
      price,
      liquidationRatio,
    } = getters.getVaultFields(this.vault?.id ?? "");
    const marketFields = getters.getMarketFields(collateral?.id ?? "");

    const inputAmount = Number(this.bindDebtAmount);

    const maxAvailable = Math.min(avaliableDebt, marketFields.maxAvailable);

    const maxAvailableText = format({
      n: maxAvailable,
      max_dp: 8,
      mode: BigNumber.ROUND_DOWN,
    });

    const dustAmount = Number(collateral?.dust);

    const totalAvailableDebt = (collateralAmount * price) / liquidationRatio;
    const suggest = format({
      n: Math.max(totalAvailableDebt * 0.6 - debtAmount, 0),
      max_dp: 8,
      mode: BigNumber.ROUND_DOWN,
    });

    const progress =
      ((debtAmount + inputAmount) / (debtAmount + avaliableDebt)) * 100;

    const newRatio =
      debtAmount + inputAmount &&
      (collateralAmount * price) / (debtAmount + inputAmount);

    const risk = this.$utils.vault.getRiskLevelMeta(newRatio, liquidationRatio);
    return {
      debtAsset,
      debtAmount,
      debtSymbol,
      ratio,
      ratioText: toPercent({ n: ratio }),
      liquidationPrice,
      liquidationRatio,
      liquidationPriceText: format({ n: liquidationPrice }),
      currentDepositPrice: format({ n: collateral?.price || "0" }),
      maxAvailable,
      maxAvailableText,
      suggest,
      progress,
      newRatio,
      risk,
      dustAmount,
      dust: collateral?.dust,
    };
  }

  handleSuccess() {
    this.form.reset();
    this.$uikit.toast.success({
      message: this.$t("common.action-success") + "",
    });
  }

  get validateRules() {
    return [
      (v: string) => !!v || this.$t("common.amount-required"),
      (v: string) => +v > 0 || this.$t("common.amount-invalid"),
      (v: string) =>
        +v < this.meta.maxAvailable ||
        this.$t("validate.max-debt", {
          amount: this.meta.maxAvailableText,
          symbol: this.meta.debtSymbol,
        }),
      (v: string) =>
        this.meta.debtAmount + +v >= this.meta.dustAmount ||
        this.meta.debtAmount + +v <= 0 ||
        this.$t("validate.remaining-dust-debt", {
          amount: this.meta.dust,
          symbol: this.meta.debtSymbol,
        }),
    ];
  }

  get rules() {
    return this.validateRules.concat([
      (v: string) => {
        if (this.meta.risk.value === RISK.HIGH) {
          if (this.meta.newRatio < this.meta.liquidationRatio) {
            return this.$t("validate.below-liquidation-rate");
          }

          return this.$t("validate.high-risk", {
            symbol: this.meta.debtSymbol,
          });
        }
        return true;
      },
      (v: string) =>
        this.meta.risk.value !== RISK.MEDIUM ||
        this.$t("validate.medium-risk", {
          symbol: this.meta.debtSymbol,
        }),
    ]);
  }

  get validate() {
    for (const rule of this.validateRules) {
      if (true !== rule(this.bindDebtAmount)) {
        return { disabled: true };
      }
    }
    return { disabled: false };
  }
}
</script>
