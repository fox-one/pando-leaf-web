<template>
  <f-app-bottom-nav
    v-if="Boolean(value)"
    :value="value"
    :items="items"
    app
    flat
    color="primary"
    @change="handleChange"
  >
  </f-app-bottom-nav>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Sync } from "vuex-pathify";

@Component({})
class DefaultLayoutBottomNav extends Vue {
  @Sync("app/bottomNav@value") bottomNav!: string;

  get value() {
    return this.bottomNav || undefined;
  }

  get items() {
    return [
      {
        text: this.$t("tab.home"),
        icon: "$IconHome",
        path: "vault",
        value: "vault",
      },
      {
        text: this.$t("tab.market"),
        icon: "$IconMarket",
        path: "market",
        value: "market",
      },
      {
        text: this.$t("tab.auctions"),
        icon: "$IconAuctions",
        path: "auctions",
        value: "auctions",
      },
    ];
  }

  handleChange(value) {
    const nav = this.items.find((x) => x.value === value);

    if (nav) {
      this.$router.replace(this.localePath({ name: nav.path }));
    }
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
