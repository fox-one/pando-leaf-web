<template>
  <f-app-bar v-bind="appbar" v-if="!appbar.disabled" @back="handleBack">
    <v-layout v-if="appbar.avatar" align-center>
      <v-avatar class="ml-2" size="32">
        <v-img :src="avatar" :size="32"></v-img>
      </v-avatar>
      <h4 class="mx-2">Hi, {{ name }}</h4>
      <v-spacer />
      <v-btn fab x-small color="primary" @click="toMarket">
        <v-icon> {{ $icons.mdiGoogleAnalytics }}</v-icon>
      </v-btn>
    </v-layout>
  </f-app-bar>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
class DefaultLayoutAppBar extends Vue {
  get appbar() {
    const state = this.$store.state;
    const appbar = state.app.appbar;
    const isDark = state.app.settings.dark;

    return {
      ...appbar,
      color: isDark ? "#000000" : "#FFFFFF",
    };
  }

  get avatar() {
    const avatar = this.$store.state.auth.avatar;
    return this.$utils.helper.mixinImageResize(avatar);
  }

  get name() {
    const name = this.$store.state.auth.name;
    return name;
  }

  toMarket() {
    this.$router.push("/market");
  }

  handleBack() {
    if (window.history.length <= 1) {
      this.$router.push({ name: "index" });
    } else {
      this.$router.back();
    }
  }
}
export default DefaultLayoutAppBar;
</script>
<style lang="scss" scoped></style>
