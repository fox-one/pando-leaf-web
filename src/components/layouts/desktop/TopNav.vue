<template>
  <ul class="nav">
    <li
      v-for="(item, index) in navItems"
      :key="index"
      :class="{ active: item.active }"
      @click="handleChange(item)"
    >
      {{ item.text }}
    </li>
  </ul>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
class TopNav extends Vue {
  get navItems() {
    const current = this.$route.name as string;
    const isActive = (name: string) => name === current;

    return [
      {
        text: this.$t("tab.home"),
        path: "vault",
        value: "vault",
        active: isActive("vault"),
      },
      {
        text: this.$t("tab.market"),
        path: "market",
        value: "market",
        active: isActive("market"),
      },
      {
        text: this.$t("tab.auctions"),
        path: "auctions",
        value: "auctions",
        active: isActive("auctions"),
      },
    ];
  }

  handleChange(nav) {
    if (!nav || this.$route.name === nav.path) {
      return;
    }
    this.$router.push(this.localePath({ name: nav.path }));
  }
}
export default TopNav;
</script>

<style lang="scss" scoped>
.nav {
  list-style: none;
  padding: 0;
  display: flex;

  li {
    padding: 0 20px;
    font-weight: bold;
    color: var(--v-greyscale_4-base);

    &.active {
      color: var(--v-greyscale_1-base);
    }

    &:first-child {
      padding-left: 0px;
    }

    &:last-child {
      padding-right: 0px;
    }
  }
}
</style>
