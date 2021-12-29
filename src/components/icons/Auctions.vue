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
      d="M2 2.64899C2 1.82056 2.67432 1.14899 3.50275 1.14899C4.22461 1.14899 4.81744 1.69765 5.23346 2.28758C5.50268 2.66936 5.90702 2.99998 6.5 2.99998H17.5C18.093 2.99998 18.4973 2.66936 18.7665 2.28758C19.1826 1.69765 19.7754 1.14899 20.4973 1.14899C21.3257 1.14899 22 1.82056 22 2.64899V7.99998H8V6.49998C8 5.9477 7.55228 5.49998 7 5.49998C6.44772 5.49998 6 5.9477 6 6.49998V7.99998H2V2.64899ZM6 7.99998V9.49998C6 10.0523 6.44772 10.5 7 10.5C7.55228 10.5 8 10.0523 8 9.49998V7.99998H22V13.351C22 14.1794 21.3257 14.851 20.4973 14.851C19.7754 14.851 19.1826 14.3023 18.7665 13.7124C18.4973 13.3306 18.093 13 17.5 13H6.5C5.90702 13 5.50268 13.3306 5.23346 13.7124C4.81744 14.3023 4.22461 14.851 3.50275 14.851C2.67432 14.851 2 14.1794 2 13.351V7.99998H6Z"
      :fill="colors[0]"
    />
    <path
      d="M14 13V21C14 22.1045 13.1046 23 12 23C10.8954 23 10 22.1045 10 21V13H14Z"
      :fill="colors[0]"
    />
  </svg>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Get } from "vuex-pathify";

@Component
class Auctions extends Vue {
  @Get("app/bottomNav@value") currentNav!: string;

  get colors() {
    const isActive = this.currentNav === "auctions";
    const active = this.$vuetify.theme.currentTheme.primary;
    const inactive = this.$vuetify.theme.currentTheme.greyscale_4;

    return isActive ? [active] : [inactive];
  }
}
export default Auctions;
</script>
