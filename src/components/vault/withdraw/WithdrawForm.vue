<template>
  <div class="ma-0 pa-4 pb-8">
    <withdraw-form-input
      :vault="vault"
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
import { Vue, Component, Prop, PropSync, Watch } from "vue-property-decorator";
import WithdrawFormInput from "./WithdrawFormInput.vue";
import BaseRiskSlider from "@/components/base/RiskSlider.vue";
import WithdrawAction from "./WithdrawAction.vue";
import { toPercent } from "@foxone/utils/number";
import BigNumber from "bignumber.js";

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

  showTip = false;

  get meta() {
    const getters = this.$store.getters as Getter.GettersTree;

    const { avaliableWithdraw } = getters.getVaultFields(this.vault?.id ?? "");

    const progress = (100 * +this.bindAmount) / avaliableWithdraw;
    const progressText = toPercent({ n: progress / 100 });
    return {
      avaliableWithdraw,
      progress,
      progressText,
    };
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
