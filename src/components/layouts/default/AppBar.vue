<template>
  <f-app-bar v-bind="appbar" v-if="!appbar.disabled" @back="handleBack">
    <v-layout v-if="appbar.avatar" align-center>
      <v-avatar class="ml-2" size="32">
        <v-img :src="avatar" :size="32"></v-img>
      </v-avatar>
      <h4 class="mx-2">Hi, {{ name }}</h4>
      <v-spacer />
      <f-bottom-sheet
        v-model="showMenu"
        :adaptive="true"
        :desktop-wapper="'menu'"
      >
        <template #activator="{ on }">
          <v-btn
            fab
            x-small
            elevation="0"
            color="primary"
            class="mr-1"
            v-on="on"
          >
            <v-icon> {{ $icons.mdiGoogleAnalytics }}</v-icon>
          </v-btn>
        </template>
        <template #title> {{ $t("common.menu") }} </template>
        <f-list>
          <f-list-item
            v-for="(item, index) in menuItems"
            :key="item.title"
            :title="item.title"
            :subtitle="item.subtitle"
            :value="item.value"
            @click="clickItem(item, index)"
          >
          </f-list-item>
        </f-list>
      </f-bottom-sheet>
    </v-layout>
  </f-app-bar>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
class DefaultLayoutAppBar extends Vue {
  showMenu = false;
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

  get menuItems() {
    return [
      {
        title: this.$t("menu.market"),
      },
      {
        title: this.$t("menu.auction"),
      },
    ];
  }

  clickItem(menu, index) {
    if (index === 0) {
      this.toMarket();
    }
    if (index === 1) {
      this.toAuctions();
    }
  }

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }

  toAuctions() {
    this.toggleMenu();
    this.$router.push("/auctions");
  }

  toMarket() {
    this.toggleMenu();
    this.$router.push("/market");
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
export default DefaultLayoutAppBar;
</script>
<style lang="scss" scoped></style>
