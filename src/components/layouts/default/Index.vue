<template>
  <v-app id="app">
    <default-layout-app-bar />
    <v-main>
      <!-- <base-ws-connect-bar /> -->
      <nuxt style="max-width: 1200px" />
    </v-main>
    <!-- <default-layout-bottom-nav /> -->
    <default-layout-modals />
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import AppBar from "./AppBar.vue";
import BottomNav from "./BottomNav.vue";
import Modals from "./Modals.vue";
import vconsole from "vconsole";

@Component({
  name: "default-layout",
  components: {
    "default-layout-modals": Modals,
    "default-layout-app-bar": AppBar,
    "default-layout-bottom-nav": BottomNav,
  },
})
class DefaultLayout extends Vue {
  mounted() {
    var vConsole = new vconsole();
  }
}
export default DefaultLayout;
</script>
