<template>
  <div class="ma-0 pa-4 pb-8">
    <base-form-input
      ref="form-input"
      :amount.sync="bindAmount"
      :asset="meta.collateralAsset"
      :rules="rules"
      :placeholder="$t('form.deposit-amount')"
    />

    <deposit-action
      :vault="vault"
      :amount="bindAmount"
      @success="handleSuccess"
    />
  </div>
</template>

<script lang="ts" scoped>
import { Vue, Component, Prop, PropSync, Ref } from "vue-property-decorator";
import BaseFormInput from "@/components/base/FormInput.vue";
import BaseRiskSlider from "@/components/base/RiskSlider.vue";
import DepositAction from "./DepositAction.vue";
import { toPercent } from "@foxone/utils/number";

@Component({
  components: {
    BaseFormInput,
    BaseRiskSlider,
    DepositAction,
  },
})
export default class extends Vue {
  @Prop() vault!: API.Vault;

  @PropSync("amount") bindAmount!: string;

  @Ref("form-input") formInput!: BaseFormInput;

  get meta() {
    const getters = this.$store.getters as Getter.GettersTree;
    const { format } = this.$utils.number;

    const {
      collateralAsset,
      liquidationPrice,
      collateral,
      collateralSymbol,
      ratio,
    } = getters.getVaultFields(this.vault?.id ?? "");
    const walletAsset = getters["asset/getWalletAssetById"](
      collateralAsset?.id ?? ""
    );

    return {
      balance: walletAsset?.balance,
      collateralAsset,
      collateralSymbol,
      ratio,
      ratioText: toPercent({ n: ratio }),
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
    for (const rule of this.rules) {
      if (true !== rule(this.bindAmount)) {
        return { disabled: true };
      }
    }
    return { disabled: false };
  }

  handleSuccess() {
    this.formInput.getForm().reset();
    this.$uikit.toast.success({
      message: this.$t("common.action-success") + "",
    });
  }
}
</script>