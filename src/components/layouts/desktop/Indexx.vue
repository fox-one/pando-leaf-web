<template>
  <v-app class="leaf-app">
    <pando-banner app="leaf" :dev="dev" />
    <desktop-layout-appbar />
    <v-main>
      <nuxt />
    </v-main>
    <modals />
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import AppBar from "./AppBar.vue";
import Modals from "../modals/Index.vue";
import { isProduct } from "@/constants";

@Component({
  components: {
    Modals,
    "desktop-layout-appbar": AppBar,
  },
})
class DesktopLayout extends Vue {
  dev = !isProduct;
}
export default DesktopLayout;
</script>
