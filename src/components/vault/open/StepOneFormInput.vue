<template>
  <f-asset-amount-input
    v-model="bindAmount"
    :assets="meta.assets"
    :asset="asset"
    :rules="rules"
    :selectable="true"
    :placeholder="meta.placeholder"
    :readonly="closed"
    inputmode="decimal"
    hide-details
    fullfilled
    v-bind="$attrs"
  >
    <template #tools="{ messages }">
      <form-input-tools
        :balance="meta.balance"
        :fiat-amount="meta.fiatAmount"
        :messages="messages"
        :fillable="fillable"
        :leftLabel="text.balance"
        @fill="handleFill"
      >
      </form-input-tools>
    </template>

    <template #assets="{ assets, asset, on }">
      <v-list class="dialog-content" style="max-height: 70vh; overflow: scroll">
        <div v-if="filtedCollaterals(assets).length > 0">
          <collateral-list-item
            v-for="item in filtedCollaterals(assets)"
            :key="item.id"
            :collateral="item"
            @add="handleCollateralSelect(on, assets, item, asset)"
          />
        </div>

        <div v-else class="greyscale_1--text text-1 text-center mt-2">
          {{ $t("common.no-result") }}
        </div>
      </v-list>
    </template>
  </f-asset-amount-input>
</template>

<script lang="ts">
import { Component, Vue, Prop, PropSync } from "vue-property-decorator";
import FormInputTools from "@/components/base/FormInputTools.vue";
import CollateralListItem from "@/components/vault/CollateralListItem.vue";
import { Get } from "vuex-pathify";

@Component({
  components: {
    FormInputTools,
    CollateralListItem,
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

  @Get("collateral/collaterals") collaterals!: API.Collateral[];

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

    const balance = this.balance ? this.balance : walletAsset?.balance ?? "-";
    const inputAmount = +(this.bindAmount ?? "0");
    const price = +this.asset?.price;
    const fiatAmount = inputAmount * price;
    const assets = this.collaterals.map((item) => {
      return getters["asset/getAssetById"](item.gem);
    });

    return {
      balance,
      fiatAmount: isValid(fiatAmount) ? toFiat(this, { n: fiatAmount }) : "-",
      placeholder: this.placeholder ?? this.$t("common.amount"),
      assets,
    };
  }

  filtedCollaterals(assets: API.Asset[]) {
    const assetIds = assets?.map((a) => a.id);
    const filterd = this.collaterals.filter((item) => {
      if (assetIds.includes(item.gem)) {
        return true;
      }
    });
    return filterd;
  }

  handleCollateralSelect(
    on: { select: (asset?: API.Asset) => void },
    assets: API.Asset[],
    collateral: API.Collateral,
    prevAsset?: API.Asset
  ) {
    if (prevAsset?.id === collateral.gem) {
      const dumpCollateral = this.collaterals.find((item) => {
        return item.id !== collateral.id;
      });
      const dumpAsset = assets?.find((asset) => {
        return asset.id !== collateral.gem;
      });
      on.select(dumpAsset);
      this.$emit("select", dumpCollateral);
    }

    const asset = assets?.find((asset) => {
      return asset.id === collateral.gem;
    });
    this.$emit("select", collateral);
    on.select(asset);
  }

  handleFill() {
    this.$emit("fill");
    this.bindAmount = this.meta.balance !== "-" ? this.meta.balance : "";
  }
}
</script>

<style lang="scss" scoped></style>
