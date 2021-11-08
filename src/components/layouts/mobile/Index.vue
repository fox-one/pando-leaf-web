<template>
  <v-app class="leaf-app">
    <app-bar-home v-if="isHome" />
    <app-bar-nav v-else />

    <v-main>
      <nuxt />
    </v-main>

    <bottom-nav />

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
    AppBarHome,
    AppBarNav,
    BottomNav,
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
