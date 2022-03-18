<template>
  <v-container class="auctions-page pa-0">
    <v-layout class="auctions-tab-bar">
      <auctions-tabs v-model="tabIndex" />
    </v-layout>

    <auctioning-list
      class="flex-grow-1"
      v-if="tabIndex === 0"
    ></auctioning-list>

    <auctioning-done-list class="flex-grow-1" v-else></auctioning-done-list>
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

<style lang="scss" scoped>
.auctions-page {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.auctions-tab-bar {
  width: 100%;
  flex-grow: 0;
  justify-content: center;
  top: 44px;
  z-index: 3;
  background-color: var(--v-greyscale_7-base);
  position: sticky;
  box-shadow: 0px 0px 24px rgba(0, 0, 0, 0.06);
}
</style>
