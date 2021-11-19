<template>
  <div class="ma-0 pa-4 pb-8">
    <base-alert class="mb-4" close type="error" :show.sync="showTip">
      {{ $t("tooltip.payback-intro") }}
    </base-alert>

    <payback-form-input
      ref="form-input"
      :amount.sync="bindAmount"
      :shot-tip.sync="showTip"
      :rules="rules"
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
import { Vue, Component, Prop, PropSync, Ref } from "vue-property-decorator";
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

  @Ref("form-input") formInput!: PaybackFormInput;

  showTip = false;

  get meta() {
    const getters = this.$store.getters as Getter.GettersTree;
    const { format } = this.$utils.number;

    const {
      liquidationPrice,
      collateral,
      ratio,
      avaliableDebt,
      debtAsset,
      debtAmount,
      debtSymbol,
    } = getters.getVaultFields(this.vault?.id ?? "");
    const walletAsset = getters["asset/getWalletAssetById"](
      debtAsset?.id ?? ""
    );
    const marketFields = getters.getMarketFields(collateral?.id ?? "");

    const maxAvailable = format({
      // 因为不允许直接借贷到恰好爆仓 => -0.00000001
      n: Math.min(avaliableDebt, marketFields.maxAvailable) - 0.00000001,
      max_dp: 8,
      mode: BigNumber.ROUND_DOWN,
    });

    const dustAmount = Number(collateral?.dust);

    const leftDebt = debtAmount - +this.bindAmount;

    return {
      balance: walletAsset?.balance,
      ratio,
      debtAmount: format({ n: debtAmount, dp: 8, mode: BigNumber.ROUND_DOWN }),
      debtSymbol,
      ratioText: toPercent({ n: ratio }),
      liquidationPrice,
      liquidationPriceText: format({ n: liquidationPrice }),
      currentDepositPrice: format({ n: collateral?.price || "0" }),
      maxAvailable,
      leftDebt,
      dustAmount,
      dust: collateral?.dust,
    };
  }

  handleSuccess() {
    this.formInput.getForm().reset();
    this.$uikit.toast.success({
      message: this.$t("common.action-success") + "",
    });
  }

  get rules() {
    return [
      (v: string) => !!v || this.$t("common.amount-required"),
      (v: string) => +v > 0 || this.$t("common.amount-invalid"),
      (v: string) =>
        +v <= +(this.meta.balance ?? Infinity) ||
        this.$t("validate.insufficient-balance", {
          symbol: this.meta.debtSymbol,
        }),
      (v: string) =>
        this.meta.leftDebt >= this.meta.dustAmount ||
        this.meta.leftDebt <= 0 ||
        this.$t("validate.remaining-dust-debt", {
          amount: this.meta.dust,
          symbol: this.meta.debtSymbol,
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
}
</script>