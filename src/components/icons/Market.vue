<template>
  <svg
    width="26"
    height="24"
    viewBox="0 0 26 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fill-rule="evenodd"
      clip-rule="evenodd"
      d="M22.195 5.96037C22.5973 6.57164 22.9403 7.22542 23.2158 7.91351C24.7798 7.87633 25.7581 8.07943 25.8836 8.54778C26.0091 9.01628 25.2629 9.6816 23.8889 10.4317C23.8889 10.4317 23.889 10.4318 23.889 10.4318C21.7098 11.6215 17.9516 13.0245 13.5876 14.1938C9.22284 15.3633 5.26596 16.0275 2.78399 16.0865C2.78399 16.0865 2.78398 16.0865 2.78398 16.0865C1.21967 16.1237 0.241208 15.9206 0.115702 15.4523C-0.00984872 14.9837 0.736541 14.3183 2.11081 13.568C2.03772 13.0559 1.9999 12.5324 1.9999 12C1.9999 11.7874 2.00593 11.5762 2.01783 11.3666C2.01783 11.3666 2.01783 11.3666 2.01782 11.3666C2.26097 7.08372 4.95434 3.45641 8.7182 1.86443C9.79068 1.41081 10.9501 1.12245 12.1645 1.03125C12.4402 1.01054 12.7188 1 12.9999 1C16.8445 1 20.2284 2.97234 22.195 5.96037ZM23.3603 12.9277C23.5723 12.8304 23.7798 12.7322 23.982 12.6334C23.6538 18.4138 18.8624 23 12.9999 23C9.15533 23 5.77142 21.0277 3.80481 18.0397C4.0296 18.0242 4.25867 18.0054 4.49117 17.9837C7.07178 17.7426 10.4733 17.0988 14.1053 16.1256C17.7372 15.1524 21.0049 14.0092 23.3603 12.9277Z"
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
