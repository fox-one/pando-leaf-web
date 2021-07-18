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
      d="M14.3058 2.62653C12.9233 1.65127 11.0767 1.65127 9.69423 2.62653L2.69424 7.56459C1.63186 8.31403 0.999994 9.53304 1 10.8332L1.00004 20.5C1.00005 21.8807 2.11933 23 3.50004 23H20.5C21.8807 23 23 21.8807 23 20.5V10.8331C23 9.53304 22.3681 8.31403 21.3058 7.5646L14.3058 2.62653ZM15 17C15 16.4477 14.5523 16 14 16H9.99998C9.44769 16 8.99998 16.4477 8.99998 17C8.99998 17.5522 9.44769 18 9.99998 18H14C14.5523 18 15 17.5522 15 17Z"
      :fill="colors[0]"
    />
  </svg>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Get } from "vuex-pathify";

@Component
class Home extends Vue {
  @Get("app/bottomNav@value") currentNav!: string;

  get colors() {
    const isActive = this.currentNav === "vault";
    const active = this.$vuetify.theme.currentTheme.primary;
    const inactive = this.$vuetify.theme.currentTheme.greyscale_4;

    return isActive ? [active] : [inactive];
  }
}
export default Home;
</script>
