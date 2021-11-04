<template>
  <div class="ma-0 pa-4 pb-8">
    <base-form-input
      :amount.sync="bindAmount"
      :asset="meta.collateralAsset"
      :placeholder="$t('form.hint.deposit-amount')"
    />

    <deposit-action
      :vault="vault"
      :amount="bindAmount"
      :disabled="validate.disabled"
      @success="handleSuccess"
    />
  </div>
</template>

<script lang="ts" scoped>
import { Vue, Component, Prop, PropSync } from "vue-property-decorator";
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

  get meta() {
    const getters = this.$store.getters as Getter.GettersTree;
    const { format } = this.$utils.number;

    const {
      collateralAsset,
      liquidationPrice,
      collateral,
      ratio,
    } = getters.getVaultFields(this.vault?.id ?? "");

    return {
      collateralAsset,
      ratio,
      ratioText: toPercent({ n: ratio }),
      liquidationPrice,
      liquidationPriceText: format({ n: liquidationPrice }),
      currentDepositPrice: format({ n: collateral?.price || "0" }),
    };
  }

  handleSuccess() {
    this.bindAmount = "";
    this.$uikit.toast.success({
      message: this.$t("common.action-success") + "",
    });
  }

  get validate() {
    return { disabled: false };
  }
}
</script>
