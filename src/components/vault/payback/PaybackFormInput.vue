<template>
  <f-asset-amount-input
    v-model="bindAmount"
    :assets="[meta.debtAsset]"
    :asset.sync="meta.debtAsset"
    :rules="rules"
    :selectable="false"
    :placeholder="meta.placeholder"
    :readonly="false"
    inputmode="decimal"
    hide-details
    fullfilled
    v-bind="$attrs"
  >
    <template #tools="{ messages }">
      <f-asset-input-tools
        :wallet-connected="meta.logged"
        :balance="meta.balance"
        :fiat-amount="meta.fiatAmount"
        :messages="messages"
        :fillable="false"
        @fill="handleFill"
      >
        <template #append-left>
          <base-mvm-action :asset="asset" />
        </template>
      </f-asset-input-tools>
    </template>
  </f-asset-amount-input>
</template>

<script lang="ts">
import { Component, Vue, Prop, PropSync } from "vue-property-decorator";
import BigNumber from "bignumber.js";
import FormInputTools from "@/components/base/FormInputTools.vue";

@Component({
  components: {
    FormInputTools,
  },
})
export default class extends Vue {
  @PropSync("amount") bindAmount;

  @PropSync("shotTip") bindShowTip!: boolean;

  @Prop() vault!: API.Vault;

  @Prop({ default: () => [] }) rules!: ((amount: string) => boolean | string)[];

  get meta() {
    const { isValid, format, toFiat } = this.$utils.number;
    const getters = this.$store.getters as Getter.GettersTree;
    const { debtAsset, debtSymbol, debtAmount } = getters.getVaultFields(
      this.vault?.id
    );

    const getWalletAssetById: State.GetWalletAssetById =
      getters["asset/getWalletAssetById"];

    const walletAsset = getWalletAssetById(debtAsset?.id ?? "");

    const balance = walletAsset?.balance ?? "-";
    const logged = getters["auth/isLogged"];

    const inputAmount = +(this.bindAmount ?? "0");
    const price = +(walletAsset?.price_usd ?? 0);
    const fiatAmount = inputAmount * price;

    return {
      logged,
      balance,
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
    const toPrecision = this.$utils.number.toPrecision;
    if (this.meta.debtAmountText !== "-") {
      this.bindAmount = toPrecision({
        n: this.meta.debtAmount,
        dp: 4,
        mode: BigNumber.ROUND_UP,
      });
      this.bindShowTip = true;
    }
  }
}
</script>

<style lang="scss" scoped></style>
