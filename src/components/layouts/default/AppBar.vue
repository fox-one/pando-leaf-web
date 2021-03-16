<template>
  <f-app-bar class="custom-f-app-bar" v-bind="appbar" @back="handleBack">
    <v-layout v-if="appbar.avatar" align-center>
      <v-avatar class="ml-2" size="32">
        <v-img :src="avatar" :size="32"></v-img>
      </v-avatar>
      <h4 class="mx-2">Hi, {{ name }}</h4>
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
<style lang="scss" scoped>
.custom-f-app-bar {
  ::v-deep {
    .f-app-bar-title {
      display: block;
      position: absolute;
      left: 32px;
      right: 40px;
      &.left {
        text-align: left;
        padding-left: 4px !important;
      }
      &.left.no-back {
        left: 8px;
      }
      &.center {
        text-align: center;
        padding-left: 0px !important;
      }
      &.center.no-back {
        left: 0px;
        right: 0px;
      }
    }
  }
}
</style>
