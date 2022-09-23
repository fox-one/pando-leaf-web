<template>
  <v-app class="leaf-app">
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

@Component({
  components: {
    Modals,
    "desktop-layout-appbar": AppBar,
  },
})
class DesktopLayout extends Vue {}
export default DesktopLayout;
</script>
