<template>
  <f-asset-amount-input
    v-model="bindAmount"
    :assets="meta.assets"
    :asset.sync="asset"
    :rules="rules"
    :selectable="false"
    :placeholder="meta.placeholder"
    :readonly="closed"
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
        :fillable="fillable"
        :balance-label="text.balance"
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
import FormInputTools from "./FormInputTools.vue";

@Component({
  name: "FormInput",
  components: { FormInputTools },
})
export default class extends Vue {
  @PropSync("amount") bindAmount;

  @Prop({ default: null }) asset!: API.Asset;

  @Prop({ default: null }) assets!: API.Asset[];

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
      balance: this.leftLabel ? this.leftLabel : this.$t("common.balance"),
    };
  }

  get meta() {
    const { isValid, toFiat } = this.$utils.number;
    const getters = this.$store.getters as Getter.GettersTree;
    const getWalletAssetById: State.GetWalletAssetById =
      getters["asset/getWalletAssetById"];

    const walletAsset = getWalletAssetById(this.asset?.id);
    const logged = getters["auth/isLogged"];

    const balance = this.balance ? this.balance : walletAsset?.balance ?? "-";
    const inputAmount = +(this.bindAmount ?? "0");
    const price = +this.asset?.price;
    const fiatAmount = inputAmount * price;
    return {
      logged,
      balance,
      fiatAmount: isValid(fiatAmount) ? toFiat(this, { n: fiatAmount }) : "-",
      placeholder: this.placeholder ?? this.$t("common.amount"),
      assets: this.assets ?? [this.asset],
    };
  }

  handleFill() {
    this.$emit("fill");
    this.bindAmount = this.meta.balance !== "-" ? this.meta.balance : "";
  }
}
</script>

<style lang="scss" scoped></style>
