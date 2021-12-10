<template>
  <f-asset-amount-input
    v-model="bindAmount"
    :assets="[asset]"
    :asset.sync="asset"
    :rules="rules"
    :selectable="false"
    :placeholder="meta.placeholder"
    :readonly="closed"
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
        :fillable="fillable"
        @fill="handleFill"
        @connect-wallet="handleConnectWallet"
      />
    </template>
  </f-asset-amount-input>
</template>

<script lang="ts">
import { Component, Vue, Prop, PropSync, Ref } from "vue-property-decorator";
import FormInputTools from "./FormInputTools.vue";

@Component({
  components: {
    FormInputTools,
  },
})
export default class extends Vue {
  @PropSync("amount") bindAmount;

  @Prop({ default: null }) asset!: API.Asset;

  @Prop({ default: () => [] }) rules!: ((amount: string) => boolean | string)[];

  @Prop({ default: false }) closed!: boolean;

  @Prop({ type: [String, Number], default: "" }) balance!: string;

  @Prop({ type: [String, Number], default: "" }) fiatAmount!: boolean;

  @Prop({ type: String, default: null }) leftLabel!: string;

  @Prop({ default: null }) placeholder!: string;

  @Prop({ default: null }) messages;

  @Prop({ default: true }) fillable!: boolean;

  get text() {
    return {
      balance: this.leftLabel ? this.leftLabel : this.$t("balance"),
      connect_wallet: this.$t("connect_wallet"),
    };
  }

  get meta() {
    const { isValid, toFiat } = this.$utils.number;
    const getters = this.$store.getters as Getter.GettersTree;
    const getWalletAssetById: State.GetWalletAssetById =
      getters["asset/getWalletAssetById"];

    const walletAsset = getWalletAssetById(this.asset?.id);

    const balance = this.balance ? this.balance : walletAsset?.balance ?? "-";
    const inputAmount = +(this.bindAmount ?? "0");
    const price = +this.asset?.price;
    const fiatAmount = inputAmount * price;
    return {
      balance,
      logged: getters["auth/isLogged"],
      fiatAmount: isValid(fiatAmount) ? toFiat(this, { n: fiatAmount }) : "-",
      placeholder: this.placeholder ?? this.$t("common.amount"),
    };
  }

  handleConnectWallet() {
    this.$utils.account.openAuth(this);
  }

  handleFill() {
    this.bindAmount = this.meta.balance !== "-" ? this.meta.balance : "";
  }
}
</script>

<style lang="scss" scoped></style>
