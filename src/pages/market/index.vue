<template>
  <v-container class="pa-0">
    <v-layout
      justify-space-between
      class="px-4 f-greyscale-3 f-bg-greyscale-7 f-caption"
    >
      <div>Name/Price</div>
      <div>Stability Fee/Update Time</div>
    </v-layout>
    <market-item
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
  @Getter("auth/isLogged") isLogged;
  @Action("global/syncWallets") syncWallets;
  @State((state) => state.global.collaterals) collaterals;

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

  get meta() {
    return {
      totalSupply: "-",
      totalBorrow: "-",
      volume24hSupply: "-",
      volume24hBorrow: "-",
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
