<template>
  <f-app-bottom-nav
    :app="true"
    :nav="bottomNav"
    :items="navItems"
    :animation="animation"
    active-class="primary-color"
    @change="handleChange"
  ></f-app-bottom-nav>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { State } from "vuex-class";

@Component
class DefaultLayoutBottomNav extends Vue {
  @State((state) => state.app.bottomNav.value)
  bottomNav;

  @State((state) => state.app.bottomNav.animation)
  animation;

  get navItems() {
    return [
      {
        text: this.$t("tab.home"),
        icon: "$vuetify.icon.iconHome",
        path: "home",
        value: "home",
      },
      {
        text: this.$t("tab.market"),
        icon: "$vuetify.icon.iconMarket",
        path: "market",
        value: "market",
      },
      {
        text: this.$t("tab.auctions"),
        icon: "$vuetify.icon.iconAuctions",
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
