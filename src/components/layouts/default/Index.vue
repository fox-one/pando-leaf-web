<template>
  <v-app id="app">
    <default-layout-app-bar />
    <v-main>
      <!-- <base-ws-connect-bar /> -->
      <nuxt />
    </v-main>
    <default-layout-bottom-nav />
    <default-layout-modals />
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import AppBar from "./AppBar.vue";
import BottomNav from "./BottomNav.vue";
import Modals from "./Modals.vue";

@Component({
  name: "default-layout",
  components: {
    "default-layout-modals": Modals,
    "default-layout-app-bar": AppBar,
    "default-layout-bottom-nav": BottomNav,
  },
})
class DefaultLayout extends Vue {}
export default DefaultLayout;
</script>
