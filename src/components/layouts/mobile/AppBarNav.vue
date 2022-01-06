<template>
  <f-app-bar
    v-if="appbar.show"
    app
    flat
    center
    class="appbar"
    :title="appbar.title"
    :back="appbar.back"
    :color="appbar.color"
    @back="handleBack"
  >
  </f-app-bar>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
class AppBarNav extends Vue {
  get appbar() {
    const state = this.$store.state;
    const appbar = state.app.appbar;
    const defaultThemeColor = this.$vuetify.theme.dark ? "#000000" : "#ffffff";
    const color = appbar.color || defaultThemeColor;

    return {
      ...appbar,
      color,
    };
  }

  handleBack() {
    if (window.history.length <= 2) {
      this.$router.options;
      this.$router.replace({ name: "index" });
    } else {
      this.$router.back();
    }
  }
}
export default AppBarNav;
</script>

<style lang="scss" scoped>
.appbar {
  z-index: 20;
}
</style>
