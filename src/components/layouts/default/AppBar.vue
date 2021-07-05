<template>
  <f-app-bar v-bind="appbar" @back="handleBack">
    <v-layout align-center v-if="!appbar.back">
      <v-avatar v-if="appbar.avatar" class="ml-2" size="32">
        <v-img :src="avatar" :size="32"></v-img>
      </v-avatar>
      <f-bottom-sheet
        v-model="showMenu"
        :adaptive="true"
        :desktop-wapper="'menu'"
      >
        <template #activator="{ on }">
          <v-btn
            x-small
            elevation="0"
            color="transparent"
            class="middle-center"
            v-on="on"
          >
            <v-icon size="44"> $iconLeaf</v-icon>
            <v-icon size="16"> {{ $icons.mdiChevronDown }}</v-icon>
          </v-btn>
        </template>
        <template #title> {{ "Jump To" }} </template>
        <div>
          <v-layout
            style="height: 72px"
            class="list-item-text"
            align-center
            v-for="(item, index) in menuItems"
            :key="item.title"
            @click="clickItem(item, index)"
          >
            <div
              :class="`ml-4 ${
                item.disabled ? 'f-greyscale-4' : 'f-greyscale-1'
              }`"
            >
              <span> {{ item.title }}</span>
            </div>
            <v-spacer />
            <div v-if="item.check">
              <v-icon class="mr-4"> {{ $icons.mdiCheck }}</v-icon>
            </div>
          </v-layout>
        </div>
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
        title: "Pando Lakes (Coming soon)",
        disabled: true,
      },
      {
        title: "Pando Leaf",
        check: true,
      },
      {
        title: "Pando Rings (Coming soon)",
        disabled: true,
      },
    ];
  }

  clickItem(menu, index) {
    if (index === 0) {
      this.toPandoLakes();
    }
    if (index === 1) {
      // this.toAuctions();
    }
    if (index === 2) {
      this.toPandoRings();
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

  toPandoLakes() {
    // coming soon
  }

  toPandoRings() {
    // coming soon
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
<style lang="scss" scoped>
.middle-center {
  position: absolute;
  @media only screen and (max-width: 959px) {
    left: calc(50% - 30px);
  }
  left: 48px;
}
.list-item-text {
  font-weight: 500;
  font-size: 16px !important;
}
</style>
