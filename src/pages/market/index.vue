<template>
  <v-container class="pa-0">
    <v-layout
      justify-space-between
      class="px-4 pb-2 f-bg-greyscale-7 f-caption"
    >
      <v-layout column>
        <div>{{ $t("market.total-collaterals") }}</div>
        <div class="f-title-2">{{ total.collaterals }}</div>
      </v-layout>
      <v-layout column class="text-right">
        <div>{{ $t("market.total-supply") }}</div>
        <div class="f-title-2">{{ total.supply }}</div>
      </v-layout>
    </v-layout>
    <market-item
      class="my-2"
      v-for="item in collaterals"
      :collateral="item"
      :key="item.id"
    ></market-item>
  </v-container>
</template>

<script lang="ts" scoped>
import { Component, Mixins } from "vue-property-decorator";
import mixins from "@/mixins";
import { Action, Getter, State } from "vuex-class";
import MarketItem from "@/components/particles/MarketItem.vue";
import { ICollateral } from "~/services/types/vo";

@Component({
  components: {
    MarketItem,
  },
})
export default class Market extends Mixins(mixins.page) {
  @State((state) => state.global.collaterals) collaterals!: ICollateral[];
  @Getter("auth/isLogged") isLogged;
  @Getter("global/getAssetById") getAssetById;
  @Action("global/syncWallets") syncWallets;

  get title() {
    const s = this.$t("tab.market");
    return `${s}`;
  }

  get appbar() {
    return {
      back: false,
    };
  }

  get bottomNav() {
    return "market";
  }

  get total() {
    if (!this.collaterals || this.collaterals.length === 0) {
      return {
        supply: "-",
        collaterals: "-",
      };
    }
    let col = 0;
    let dai = 0;
    this.collaterals.forEach((c) => {
      const colAsset = this.getAssetById(c?.gem);
      const daiAsset = this.getAssetById(c?.dai);
      const colAmount = Number(c.ink || "0");
      const daiAmount = Number(c.art || "0") * Number(c.rate || "1");
      const colPrice = Number(colAsset?.price || "0");
      const daiPrice = Number(daiAsset?.price || "0");
      col += colAmount * colPrice;
      dai += daiAmount * daiPrice;
    });
    return {
      collaterals: "$" + this.$utils.number.toShort(col),
      supply: "$" + this.$utils.number.toShort(dai),
    };
  }

  mounted() {
    if (this.isLogged) {
      this.syncWallets();
    }
  }
}
</script>

<style lang="scss" scoped>
.market-table-title {
  opacity: 0.5;
  font-weight: normal;
  font-style: normal;
}

.arrow-right {
  position: relative;
  float: right;
  right: 30px;
  transform: translateY(52px);
}
</style>
