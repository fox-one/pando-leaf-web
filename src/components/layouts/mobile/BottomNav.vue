<template>
  <f-app-bottom-nav
    :app="true"
    :nav="bottomNav"
    :items="navItems"
    :animation="false"
    active-class="primary-color"
    @change="handleChange"
  />
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Get } from "vuex-pathify";

@Component
class DefaultLayoutBottomNav extends Vue {
  @Get("app/bottomNav@value") bottomNav!: string;

  get navItems() {
    return [
      {
        text: this.$t("tab.home"),
        icon: "$iconHome",
        path: "vault",
        value: "vault",
      },
      {
        text: this.$t("tab.market"),
        icon: "$iconMarket",
        path: "market",
        value: "market",
      },
      {
        text: this.$t("tab.auctions"),
        icon: "$iconAuctions",
        path: "auctions",
        value: "auctions",
      },
    ];
  }

  handleChange(nav) {
    if (!nav || this.$route.name === nav.path) {
      return;
    }
    this.$router.push({ name: nav.path });
  }
}
export default DefaultLayoutBottomNav;
</script>

<style lang="scss">
.theme--dark.v-bottom-navigation.f-bottom-nav .v-btn:not(.v-btn--active) {
  color: var(--v-greyscale_4-base) !important;
}
.theme--light.v-bottom-navigation.f-bottom-nav .v-btn:not(.v-btn--active) {
  color: var(--v-greyscale_4-base) !important;
}
</style>
