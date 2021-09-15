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
            <v-icon class="leaf-logo mr-2" size="72">$iconLeaf</v-icon>
            <v-icon size="16" color="primary">$iconChevronDown</v-icon>
          </div>
        </template>
        <template #title> {{ $t("menu.jump-to") }} </template>
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
      <v-spacer></v-spacer>
      <v-layout justify-end v-if="$vuetify.breakpoint.mdAndUp">
        <div
          class="top-navs mx-5"
          :class="item.active ? 'f-greyscale-1' : 'f-greyscale-4'"
          v-for="item in navs"
          :key="item.value"
          @click="handleChange(item)"
        >
          {{ item.text }}
        </div>
      </v-layout>
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
        title: `Pando Lake`,
        disabled: false,
      },
      {
        title: "Pando Leaf",
        check: true,
      },
      {
        title: `Pando Rings`,
        disabled: false,
      },
    ];
  }

  get navs() {
    const name = this.$route.name;
    return [
      {
        text: this.$t("tab.home"),
        path: "home",
        value: "home",
        active: name === "home",
      },
      {
        text: this.$t("tab.market"),
        path: "market",
        value: "market",
        active: name === "market",
      },
      {
        text: this.$t("tab.auctions"),
        path: "auctions",
        value: "auctions",
        active: name === "auctions",
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
    location.assign("https://lake.pando.im");
  }

  toPandoRings() {
    location.assign("https://rings.pando.im");
  }

  handleChange(nav) {
    if (!nav || this.$route.name === nav.path) {
      return;
    }
    this.$router.push({ name: nav.path });
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
.top-navs {
  display: none;
  @media only screen and (min-width: 960px) {
    display: flex;
    font-weight: 600;
    font-size: 16px;
  }
}

.list-item-text {
  font-weight: 500;
  font-size: 16px !important;
}
</style>
