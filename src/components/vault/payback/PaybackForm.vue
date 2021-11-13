<template>
  <div class="ma-0 pa-4 pb-8">
    <base-alert class="mb-4" close type="error" :show.sync="showTip">
      {{ $t("tooltip.payback-intro") }}
    </base-alert>

    <payback-form-input
      :amount.sync="bindAmount"
      :shot-tip.sync="showTip"
      :vault="vault"
    />

    <payback-action
      :vault="vault"
      :amount="bindAmount"
      :disabled="validate.disabled"
      @success="handleSuccess"
    />
  </div>
</template>

<script lang="ts" scoped>
import { Vue, Component, Prop, PropSync } from "vue-property-decorator";
import PaybackFormInput from "./PaybackFormInput.vue";
import BaseRiskSlider from "@/components/base/RiskSlider.vue";
import PaybackAction from "./PaybackAction.vue";
import BigNumber from "bignumber.js";
import { toPercent } from "@foxone/utils/number";

@Component({
  components: {
    PaybackFormInput,
    BaseRiskSlider,
    PaybackAction,
  },
})
export default class PaybackForm extends Vue {
  @Prop() vault!: API.Vault;

  @PropSync("amount") bindAmount!: string;

  showTip = false;

  get meta() {
    const getters = this.$store.getters as Getter.GettersTree;
    const { format } = this.$utils.number;

    const {
      liquidationPrice,
      collateral,
      ratio,
      avaliableDebt,
      debtAmount,
    } = getters.getVaultFields(this.vault?.id ?? "");
    const marketFields = getters.getMarketFields(collateral?.id ?? "");

    const inputAmount = Number(this.bindAmount);

    const maxAvailable = format({
      // 因为不允许直接借贷到恰好爆仓 => -0.00000001
      n: Math.min(avaliableDebt, marketFields.maxAvailable) - 0.00000001,
      max_dp: 8,
      mode: BigNumber.ROUND_DOWN,
    });

    return {
      ratio,
      debtAmount: format({ n: debtAmount, dp: 8, mode: BigNumber.ROUND_DOWN }),
      ratioText: toPercent({ n: ratio }),
      liquidationPrice,
      liquidationPriceText: format({ n: liquidationPrice }),
      currentDepositPrice: format({ n: collateral?.price || "0" }),
      maxAvailable,
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
