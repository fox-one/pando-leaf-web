<template>
  <f-app-bar v-bind="appbar" @back="handleBack">
    <v-layout align-center v-if="!appbar.back">
      <v-avatar
        v-if="appbar.avatar && avatar"
        class="ml-2 appbar-avatar"
        size="32"
      >
        <v-img :src="avatar" :size="32"></v-img>
      </v-avatar>
      <div
        class="ml-2 appbar-avatar text-avatar"
        v-if="appbar.avatar && !avatar"
      >
        {{ name ? name.slice(0, 1) : "P" }}
      </div>
      <f-bottom-sheet
        v-model="showMenu"
        overlay-opacity="0.9"
        :adaptive="true"
        :desktop-wapper="'menu'"
      >
        <template #activator="{ on }">
          <div class="leaf-logo-button" v-on="on">
            <v-icon class="leaf-logo" size="64">$iconLeaf</v-icon>
            <v-icon size="16" color="primary">$iconChevronDown</v-icon>
          </div>
        </template>
        <template #title> {{ "Jump To" }} </template>
        <div class="mb-10">
          <v-layout
            class="list-item-text py-5"
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
              <v-icon size="24" class="mr-4" color="primary">$iconCheck</v-icon>
            </div>
          </v-layout>
        </div>
      </f-bottom-sheet>
    </v-layout>
  </f-app-bar>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { State } from "vuex-class";

@Component
class DefaultLayoutAppBar extends Vue {
  @State((state) => state.auth.name) name;
  @State((state) => state.auth.avatar) avatar;

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
.appbar-avatar {
  margin-top: -2px;
}
.text-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  font-weight: 600;
  height: 32px;
  border-radius: 32px;
  background-color: goldenrod;
}
.leaf-logo-button {
  position: absolute;
  @media only screen and (max-width: 959px) {
    float: left;
    left: calc(50% - 54px);
  }
  left: 48px;
}
.leaf-logo {
  margin-top: -4px;
  margin-left: 6px;
  height: 32px !important;
  width: 64px !important;
  font-size: 64px !important;
  ::v-deep {
    .v-icon__component {
      height: 32px !important;
      width: 64px !important;
      font-size: 64px !important;
    }
  }
}
.list-item-text {
  font-weight: 500;
  font-size: 16px !important;
}
</style>
