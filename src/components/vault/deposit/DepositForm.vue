<template>
  <v-form ref="form" class="ma-0 pa-4" autocomplete="off">
    <base-form-input
      :amount.sync="bindAmount"
      :asset="meta.collateralAsset"
      :rules="rules"
      :placeholder="$t('form.deposit-amount')"
    />

    <collateral-ratio-slider
      :collateral-id="meta.collateralId"
      :ratio="meta.changedRatio"
      :risk="meta.changedRisk"
    />

    <f-divider class="mt-5" />

    <deposit-action
      :vault="vault"
      :amount="bindAmount"
      :disabled="validate.disabled"
      @success="handleSuccess"
    />
  </v-form>
</template>

<script lang="ts" scoped>
import { Vue, Component, Prop, PropSync, Ref } from "vue-property-decorator";
import BaseFormInput from "@/components/base/FormInput.vue";
import BaseRiskSlider from "@/components/base/RiskSlider.vue";
import CollateralRatioSlider from "@/components/vault/CollateralRatioSlider.vue";
import DepositAction from "@/components/vault/deposit/DepositAction.vue";

@Component({
  components: {
    BaseFormInput,
    BaseRiskSlider,
    DepositAction,
    CollateralRatioSlider,
  },
})
export default class extends Vue {
  @Prop() vault!: API.Vault;

  @PropSync("amount") bindAmount!: string;

  @Ref("form") form!: any;

  get meta() {
    const getters = this.$store.getters as Getter.GettersTree;
    const { format, toPercent } = this.$utils.number;

    const {
      collateralAsset,
      liquidationPrice,
      collateral,
      collateralSymbol,
      debtAmount,
      collateralAmount,
      ratio,
    } = getters.getVaultFields(this.vault?.id ?? "");

    const { minimumRatio, collateralPrice } = getters.getMarketFields(
      this.vault?.collateral_id
    );

    const walletAsset = getters["asset/getWalletAssetById"](
      collateralAsset?.id ?? ""
    );

    const diffAmount = +this.bindAmount;
    const changedRatio =
      debtAmount &&
      ((collateralAmount + diffAmount) * collateralPrice) / debtAmount;

    const changedRisk = this.$utils.collateral.getRiskLevelMeta(
      changedRatio,
      minimumRatio
    );

    return {
      collateralId: this.vault?.collateral_id ?? "",
      balance: walletAsset?.balance,
      collateralAsset,
      collateralSymbol,
      ratio,
      ratioText: toPercent({ n: ratio }),
      changedRisk,
      changedRatio,
      liquidationPrice,
      liquidationPriceText: format({ n: liquidationPrice }),
      currentDepositPrice: format({ n: collateral?.price || "0" }),
    };
  }

  get rules() {
    return [
      (v: string) => !!v || this.$t("common.amount-required"),
      (v: string) => +v > 0 || this.$t("common.amount-invalid"),
      (v: string) =>
        +v <= +(this.meta.balance ?? Infinity) ||
        this.$t("validate.insufficient-balance", {
          symbol: this.meta.collateralSymbol,
        }),
    ];
  }

  get validate() {
    const isValid = this.$utils.number.isValid;
    if (this.bindAmount === "" || !isValid(+this.bindAmount)) {
      return {
        disabled: true,
      };
    }
    for (const rule of this.rules) {
      if (true !== rule(this.bindAmount)) {
        return { disabled: true };
      }
    }
    return { disabled: false };
  }

  handleSuccess() {
    this.form.reset();
    this.$uikit.toast.success({
      message: this.$t("common.action-success") + "",
    });
  }
}
</script>
