<template>
  <v-container class="auctions-page pa-0">
    <h1 style="display: none">
      {{ $t("seo.h1") }}
    </h1>

    <auctions-tabs v-if="isDesktop" class="flex-grow-0" />

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
import { Sync } from "vuex-pathify";

@Component({
  components: {
    AuctionsTabs,
    AuctioningList,
    AuctioningDoneList,
  },
})
export default class AuctionsPage extends Mixins(mixins.page) {
  @Sync("page/auction@tabIndex") tabIndex!: number;

  get title() {
    return `${this.$t("app-name")}`;
  }

  get isDesktop() {
    return this.$vuetify.breakpoint.mdAndUp;
  }

  get appbar() {
    const h = this.$createElement;
    return {
      style: "home" as const,
      extension: h(AuctionsTabs),
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
