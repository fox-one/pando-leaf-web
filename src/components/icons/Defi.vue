<template>
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z"
      :fill="colors[0]"
    />
    <rect
      x="6"
      y="16"
      width="4"
      height="2"
      rx="1"
      transform="rotate(-90 6 16)"
      :fill="colors[1]"
    />
    <rect
      x="11"
      y="16"
      width="6"
      height="2"
      rx="1"
      transform="rotate(-90 11 16)"
      :fill="colors[1]"
    />
    <rect
      x="16"
      y="16"
      width="9"
      height="2"
      rx="1"
      transform="rotate(-90 16 16)"
      :fill="colors[1]"
    />
  </svg>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { State } from "vuex-class";

@Component
class IconDefi extends Vue {
  @Prop({ type: Boolean, default: false }) pure;

  @State((state) => state.app.bottomNav) currentNav;

  @State((state) => state.app.settings.dark) isDark;

  get colors() {
    if (this.pure) {
      return ["", "currentColor", "currentColor", "currentColor"];
    }
    return this.currentNav === "defi"
      ? ["#159CFE", "#FFFFFF"]
      : this.isDark
      ? ["#191C1F", "#D9D9D9"]
      : ["#DDDDDD", "#FFFFFF"];
  }
}
export default IconDefi;
</script>
