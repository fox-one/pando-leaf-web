<template>
  <f-asset-amount-input
    v-model="bindAmount"
    :assets="[meta.debtAsset]"
    :asset.sync="meta.debtAsset"
    :rules="rules"
    :selectable="false"
    :placeholder="meta.placeholder"
    :readonly="false"
    hide-details
    fullfilled
    v-bind="$attrs"
    :balance="$t('form.set-max')"
  >
    <template #tools="{ messages }">
      <form-input-tools
        :balance="meta.debtAmountText"
        :fiat-amount="meta.fiatAmount"
        :messages="messages"
        :fillable="true"
        :leftLabel="text.balance"
        @fill="handleFill"
      >
      </form-input-tools>
    </template>
  </f-asset-amount-input>
</template>

<script lang="ts">
import { Component, Vue, Prop, PropSync } from "vue-property-decorator";
import BigNumber from "bignumber.js";
import FormInputTools from "@/components/base/FormInputTools.vue";

@Component({
  components: { FormInputTools },
})
export default class extends Vue {
  @PropSync("amount") bindAmount;

  @PropSync("shotTip") bindShowTip!: boolean;

  @Prop() vault!: API.Vault;

  @Prop({ default: () => [] }) rules!: ((amount: string) => boolean | string)[];

  get text() {
    return {
      balance: this.$t("form.set-max"),
    };
  }

  get meta() {
    const { isValid, format, toFiat } = this.$utils.number;
    const getters = this.$store.getters as Getter.GettersTree;
    const { debtAsset, debtSymbol, debtAmount } = getters.getVaultFields(
      this.vault?.id
    );
    const walletAsset = getters["asset/getWalletAssetById"](
      debtAsset?.id ?? ""
    );

    const inputAmount = +(this.bindAmount ?? "0");
    const price = +(walletAsset?.price_usd ?? 0);
    const fiatAmount = inputAmount * price;

    return {
      balance: walletAsset?.balance,
      debtAsset,
      debtAmount,
      debtSymbol,
      fiatAmount: isValid(fiatAmount) ? toFiat(this, { n: fiatAmount }) : "-",
      debtAmountText: format({
        n: debtAmount,
        dp: 4,
        mode: BigNumber.ROUND_UP,
      }),
      placeholder: this.$t("form.payback-amount"),
    };
  }

  handleConnectWallet() {
    this.$utils.account.openAuth(this);
  }

  handleFill() {
    this.bindAmount =
      this.meta.debtAmountText !== "-" ? this.meta.debtAmountText : "";
  }
}
</script>

<style lang="scss" scoped></style>
