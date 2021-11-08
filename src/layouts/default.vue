<template>
  <v-app>
    <f-loading v-if="initing" :loading="initing" :color="color" fullscreen />

    <template v-else>
      <desktop-layout v-if="desktop" />

      <mobile-layout v-else />
    </template>
  </v-app>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import DesktopLayout from "@/components/layouts/desktop/Indexx.vue";
import MobileLayout from "@/components/layouts/mobile/Index.vue";

@Component({
  components: {
    MobileLayout,
    DesktopLayout,
  },
})
class NuxtDefaultLayout extends Vue {
  color = this.$vuetify.theme.currentTheme.primary;

  initing = false;

  get desktop() {
    return this.$vuetify.breakpoint.mdAndUp;
  }

  async mounted() {
    this.initing = true;
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
