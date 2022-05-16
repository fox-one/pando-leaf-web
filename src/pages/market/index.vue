<template>
  <v-container class="pa-0">
    <market-overview />

    <f-divider />

    <div class="text-3 ml-4 mt-8">{{ $t("chart") }}</div>

    <market-chart-panel class="ma-4" />

    <f-divider />

    <div class="text-3 ml-4 mt-8">{{ $t("all-markets") }}</div>

    <market-item
      v-for="market in collaterals"
      :key="market.id"
      :collateral="market"
    />

    <div style="height: 70px"></div>
  </v-container>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import mixins from "@/mixins";
import MarketOverview from "@/components/market/MarketOverview.vue";
import MarketItem from "@/components/market/MarketItem.vue";
import MarketChartPanel from "@/components/charts/MarketChartPanel.vue";
import { Sync } from "vuex-pathify";

@Component({
  components: {
    MarketOverview,
    MarketItem,
    MarketChartPanel,
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
