<template>
  <div>
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
            <span class="greyscale_1--text f-caption">
              <span class="greysclae_3--text">
                {{ $t("common.wallet-balance") }}
              </span>
              {{ meta.balance }}
            </span>
          </template>
        </form-input-tools>
      </template>
    </f-asset-amount-input>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, PropSync } from "vue-property-decorator";
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

  get meta() {
    const { format } = this.$utils.number;
    const getters = this.$store.getters as Getter.GettersTree;
    const {
      debtAsset,
      debtSymbol,
      debtAmount,
      collateral,
    } = getters.getVaultFields(this.vault?.id);
    const walletAsset = getters["asset/getWalletAssetById"](
      debtAsset?.id ?? ""
    );

    const dustAmount = Number(collateral?.dust);

    const leftDebt = debtAmount - +this.bindAmount;

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
      leftDebt,
      dustAmount,
      dust: collateral?.dust,
    };
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
        (this.meta.leftDebt < this.meta.dustAmount && this.meta.leftDebt > 0) ||
        this.$t("validate.remaining-dust-debt", {
          amount: this.meta.dust,
          symbol: this.meta.debtSymbol,
        }),
    ];
  }

  handleConnectWallet() {
    this.$utils.account.openAuth(this);
  }

  handleFill() {
    this.bindShowTip = true;
    this.bindAmount =
      this.meta.debtAmountText !== "-" ? this.meta.debtAmountText : "";
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
