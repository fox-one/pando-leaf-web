<template>
  <svg
    width="12"
    height="12"
    viewBox="0 0 12 12"
    class="icon"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="6" cy="6" r="6" :fill="color[0]" />
    <path
      d="M4 7.99998L7.42857 4.57141"
      :stroke="color[1]"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M4.57129 4H7.99986V7.42857"
      :stroke="color[1]"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
class AuctionDetail extends Vue {
  get color() {
    const dark = this.$vuetify.theme.dark;
    return dark ? ["#ffffff", "#000000"] : ["#000000", "#ffffff"];
  }
}
export default AuctionDetail;
</script>

<style lang="scss" scoped>
.icon {
  fill: none;
}
</style>
