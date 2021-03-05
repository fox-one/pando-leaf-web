<template>
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37261 0 3.05176e-05 5.37258 3.05176e-05 12C3.05176e-05 18.6274 5.37261 24 12 24Z"
      :fill="colors[0]"
    />
    <rect x="4.99997" y="9" width="14" height="2" rx="1" fill="white" />
    <rect
      x="14.4142"
      y="5"
      width="7"
      height="2"
      rx="1"
      transform="rotate(45 14.4142 5)"
      fill="white"
    />
    <rect x="4.99991" y="13" width="14" height="2" rx="1" fill="white" />
    <rect
      x="5.99991"
      y="12.6001"
      width="7"
      height="2"
      rx="1"
      transform="rotate(45 5.99991 12.6001)"
      fill="white"
    />
  </svg>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { State } from "vuex-class";

@Component
class IconTrade extends Vue {
  @Prop({ type: Boolean, default: false }) pure;

  @State((state) => state.app.bottomNav) currentNav;

  @State((state) => state.app.settings.dark) isDark;

  get colors() {
    return this.currentNav === "buy_sell"
      ? ["#159CFE"]
      : this.isDark
      ? ["#191C1F"]
      : ["#DDDDDD"];
  }
}
export default IconTrade;
</script>
