<template>
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9.5 4C9.5 2.89543 10.3954 2 11.5 2H12.5C13.6046 2 14.5 2.89543 14.5 4V23H9.5V4Z"
      :fill="colors[0]"
    />
    <path
      d="M2.5 15C2.5 13.8954 3.39543 13 4.5 13H5.5C6.60457 13 7.5 13.8954 7.5 15V23H4.5C3.39543 23 2.5 22.1046 2.5 21V15Z"
      :fill="colors[0]"
    />
    <path
      d="M18.5 8C17.3954 8 16.5 8.89543 16.5 10V23H19.5C20.6046 23 21.5 22.1046 21.5 21V10C21.5 8.89543 20.6046 8 19.5 8H18.5Z"
      :fill="colors[0]"
    />
  </svg>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Get } from "vuex-pathify";

@Component
class Market extends Vue {
  @Get("app/bottomNav@value") currentNav!: string;

  get colors() {
    const isActive = this.currentNav === "market";
    const active = this.$vuetify.theme.currentTheme.primary;
    const inactive = this.$vuetify.theme.currentTheme.greyscale_4;

    return isActive ? [active] : [inactive];
  }
}
export default Market;
</script>
