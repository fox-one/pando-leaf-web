<template>
  <f-app-bar
    app
    custom-content
    :show="appbar.show"
    :flat="false"
    :height="64"
    class="desktop-appbar"
  >
    <v-container class="d-flex">
      <v-row cols="4" class="align-center">
        <v-col class="account">
          <account />
        </v-col>

        <v-col cols="4" class="text-center">
          <pando-products :current-id="'leaf'" z-index="111" />
        </v-col>

        <v-col cols="4">
          <top-nav class="d-flex justify-end" />
        </v-col>
      </v-row>
    </v-container>
  </f-app-bar>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import Account from "../partials/Account.vue";
import TopNav from "./TopNav.vue";

@Component({
  components: {
    TopNav,
    Account,
  },
})
class AppBar extends Vue {
  get appbar() {
    const appbar = this.$store.state.app.appbar;

    return {
      show: appbar.show,
    };
  }

  get navItems() {
    return [
      {
        text: this.$t("tab.home"),
        path: "home",
        value: "home",
      },
      {
        text: this.$t("tab.market"),
        path: "market",
        value: "market",
      },
      {
        text: this.$t("tab.auctions"),
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
export default AppBar;
</script>

<style lang="scss" scoped>
.desktop-appbar {
  box-shadow: 0px 0px 16px 0px #00000014 !important;
}
</style>
