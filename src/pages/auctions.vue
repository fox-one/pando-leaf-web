<template>
  <v-container class="pa-0">
    <v-layout justify-center class="mt-6 mb-4">
      <auctions-tabs v-model="tabIndex" />
    </v-layout>

    <auctioning-list v-if="tabIndex === 0"></auctioning-list>

    <auctioning-done-list v-else></auctioning-done-list>
  </v-container>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import mixins from "@/mixins";
import AuctionsTabs from "@/components/auction/AuctionsTabs.vue";
import AuctioningList from "@/components/auction/AuctioningList.vue";
import AuctioningDoneList from "@/components/auction/AuctionDoneList.vue";

@Component({
  components: {
    AuctionsTabs,
    AuctioningList,
    AuctioningDoneList,
  },
})
export default class AuctionsPage extends Mixins(mixins.page) {
  tabIndex = 0;

  get title() {
    return this.$t("tab.auctions") as string;
  }

  get appbar() {
    return {
      style: "home" as const,
    };
  }

  get bottomNav() {
    return "auctions";
  }
}
</script>
