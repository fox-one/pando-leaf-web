<template>
  <v-app lang="">
    <f-loading v-if="initing" :loading="initing" :color="color" fullscreen />

    <template v-else>
      <pando-banner v-if="isHome" app="leaf" :dev="dev" />

      <desktop-layout v-if="desktop" />

      <mobile-layout v-else />
    </template>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import DesktopLayout from "@/components/layouts/desktop/Indexx.vue";
import MobileLayout from "@/components/layouts/mobile/Index.vue";
import { isProduct } from "@/constants";

@Component({
  components: {
    MobileLayout,
    DesktopLayout,
  },
})
class NuxtDefaultLayout extends Vue {
  color = this.$vuetify.theme.currentTheme.primary;

  initing = false;

  dev = !isProduct;

  get desktop() {
    return this.$vuetify.breakpoint.mdAndUp;
  }

  get isHome() {
    return ["index", "vault", "auctions", "market"].includes(
      this.$route.name as string
    );
  }

  get language() {
    return this.$i18n.locale;
  }

  async mounted() {
    this.initing = true;
    const html = document.getElementsByTagName("html");
    html.item(0)?.setAttribute("lang", this.$i18n.locale);
    try {
      await this.$utils.app.initApp(this);
    } catch (error) {
      this.$utils.helper.errorHandler(this, error as any);
    }
    this.initing = false;
  }
}
export default NuxtDefaultLayout;
</script>
