<template>
  <v-form ref="form" autocomplete="off">
    <f-asset-amount-input
      class="no-left-padding"
      v-model="bindAmount"
      :assets="[meta.debtAsset]"
      :asset.sync="meta.debtAsset"
      :selectable="false"
      :rules="rules"
      :placeholder="meta.placeholder"
      :readonly="false"
    >
      <template #tools>
        <form-input-tools
          :left-label="$t('form.set-max')"
          :balance="meta.debtAmountText"
          @fill="handleFill"
        >
          <template #right>
            <span
              class="greyscale_1--text f-caption"
              @click="handleBalanceFill"
            >
              <span class="greysclae_3--text">
                {{ $t("common.wallet-balance") }}
              </span>
              {{ meta.balance }}
            </span>
          </template>
        </form-input-tools>
      </template>
    </f-asset-amount-input>
  </v-form>
</template>

<script lang="ts">
import { Component, Vue, Prop, PropSync, Ref } from "vue-property-decorator";
import FormInputTools from "@/components/base/FormInputTools.vue";
import BigNumber from "bignumber.js";

@Component({
  components: {
    FormInputTools,
  },
})
export default class extends Vue {
  @PropSync("amount") bindAmount;

  @PropSync("shotTip") bindShowTip!: boolean;

  @Prop() vault!: API.Vault;

  @Prop({ default: null }) messages;

  @Prop({ default: () => [] }) rules!: ((amount: string) => boolean | string)[];

  @Ref("form") form;

  get meta() {
    const { format } = this.$utils.number;
    const getters = this.$store.getters as Getter.GettersTree;
    const { debtAsset, debtSymbol, debtAmount } = getters.getVaultFields(
      this.vault?.id
    );
    const walletAsset = getters["asset/getWalletAssetById"](
      debtAsset?.id ?? ""
    );
    return {
      balance: walletAsset?.balance,
      debtAsset,
      debtAmount,
      debtSymbol,
      debtAmountText: format({
        n: debtAmount,
        dp: 4,
        mode: BigNumber.ROUND_UP,
      }),
      placeholder: this.$t("form.payback-amount"),
    };
  }

  getForm() {
    return this.form;
  }

  handleConnectWallet() {
    this.$utils.account.openAuth(this);
  }

  handleFill() {
    const { toPrecision } = this.$utils.number;
    const inputAmount = toPrecision({
      n: this.meta.debtAmount,
      dp: 4,
      mode: BigNumber.ROUND_UP,
    });

    if (this.meta.debtAmount !== 0) {
      this.bindAmount = inputAmount;
      this.bindShowTip = true;
    }
  }

  handleBalanceFill() {
    const balance = +(this.meta.balance ?? 0);

    if (balance !== 0) {
      this.bindAmount = this.meta.balance;
    }
  }
}
</script>

<style lang="scss" scoped>
.no-left-padding {
  ::v-deep {
    .v-input__append-inner {
      padding-left: 0px !important;
    }
  }
}
</style>
