<template>
  <v-app class="leaf-app">
    <mobile-layout-appbar-home v-if="isHome" />
    <mobile-layout-appbar-nav v-else />
    <v-main>
      <nuxt />
    </v-main>
    <mobile-layout-bottom-nav />
    <modals />
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import AppBarHome from "./AppBarHome.vue";
import AppBarNav from "./AppBarNav.vue";
import BottomNav from "./BottomNav.vue";
import Modals from "../modals/Index.vue";
import { Get } from "vuex-pathify";

@Component({
  name: "mobile-layout",
  components: {
    Modals,
    "mobile-layout-appbar-home": AppBarHome,
    "mobile-layout-appbar-nav": AppBarNav,
    "mobile-layout-bottom-nav": BottomNav,
  },
})
class DefaultLayout extends Vue {
  @Get("app/appbar") appbar!: State.AppBarState;

  get isHome() {
    return this.appbar.style === "home";
  }
}
export default DefaultLayout;
</script>
