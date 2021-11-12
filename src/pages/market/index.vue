<template>
  <div>
    <market-overview />

    <market-item
      v-for="market in collaterals"
      :key="market.id"
      :collateral="market"
    />

    <div style="height: 70px"></div>
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import mixins from "@/mixins";
import MarketOverview from "@/components/market/MarketOverview.vue";
import MarketItem from "@/components/market/MarketItem.vue";
import { Sync } from "vuex-pathify";

@Component({
  components: {
    MarketOverview,
    MarketItem,
  },
})
class VaultPage extends Mixins(mixins.page) {
  @Sync("collateral/collaterals") collaterals!: API.Collateral[];

  get title() {
    return this.$t("tab.market") as string;
  }

  get appbar() {
    return {
      style: "home" as const,
    };
  }

  get bottomNav() {
    return "market";
  }
}
export default VaultPage;
</script>
