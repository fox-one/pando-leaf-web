<template>
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M4 4L2.89443 3.44722C1.56462 2.78231 0 3.74931 0 5.23607V12.7639C0 14.2507 1.56462 15.2177 2.89443 14.5528L4 14V4ZM21.1056 3.44722L20 4H6V14L10 14V22C10 23.1046 10.8954 24 12 24C13.1046 24 14 23.1046 14 22V14H20L21.1056 14.5528C22.4354 15.2177 24 14.2507 24 12.7639V5.23607C24 3.74931 22.4354 2.78231 21.1056 3.44722Z"
      :fill="color"
    />
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M4 4L2.89443 3.44722C1.56462 2.78231 0 3.74931 0 5.23607V12.7639C0 14.2507 1.56462 15.2177 2.89443 14.5528L4 14V4ZM21.1056 3.44722L20 4H6V14L10 14V22C10 23.1046 10.8954 24 12 24C13.1046 24 14 23.1046 14 22V14H20L21.1056 14.5528C22.4354 15.2177 24 14.2507 24 12.7639V5.23607C24 3.74931 22.4354 2.78231 21.1056 3.44722Z"
      :fill="bgColor"
      :fill-opacity="opacity"
    />
  </svg>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { State } from "vuex-class";

@Component
class Auctions extends Vue {
  @State((state) => state.app.bottomNav) currentNav;
  @State((state) => state.app.settings.dark) isDark;

  get opacity() {
    return this.currentNav.value === "auctions" ? "0" : "0.8";
  }

  get color() {
    return this.isDark ? "white" : "black";
  }

  get bgColor() {
    return this.isDark ? "black" : "white";
  }
}
export default Auctions;
</script>
