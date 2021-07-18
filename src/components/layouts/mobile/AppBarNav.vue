<template>
  <f-app-bar v-bind="appbar" @back="handleBack"> </f-app-bar>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
class AppBarNav extends Vue {
  get appbar() {
    const state = this.$store.state;
    const appbar = state.app.appbar;
    const isDark = state.app.settings.dark;

    return {
      flat: true,
      align: "center",
      color: isDark ? "#000000" : "#FFFFFF",
      ...appbar,
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
