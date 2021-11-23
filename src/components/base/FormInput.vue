<template>
  <v-form ref="form" autocomplete="off">
    <f-asset-amount-input
      class="no-left-padding"
      v-model="bindAmount"
      :assets="[asset]"
      :asset.sync="asset"
      :rules="rules"
      :selectable="false"
      :placeholder="meta.placeholder"
      :readonly="closed"
    >
      <template #tools>
        <form-input-tools
          :left-label="leftLabel"
          :balance="meta.balance"
          :fiat-amount="meta.fiatAmount"
          @fill="handleFill"
        />
      </template>
    </f-asset-amount-input>
  </v-form>
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

  @Ref("form") form;

  getForm() {
    return this.form;
  }

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
      fiatAmount: isValid(fiatAmount) ? toFiat(this, { n: fiatAmount }) : false,
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

<style lang="scss" scoped>
.no-left-padding {
  ::v-deep {
    .v-input__append-inner {
      padding-left: 0px !important;
    }
  }
}
</style>
