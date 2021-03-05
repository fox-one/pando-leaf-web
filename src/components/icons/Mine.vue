<template>
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 23.5C18.3513 23.5 23.5 18.3513 23.5 12C23.5 5.64873 18.3513 0.5 12 0.5C5.64873 0.5 0.5 5.64873 0.5 12C0.5 18.3513 5.64873 23.5 12 23.5Z"
      :fill="colors[0]"
    />
    <path
      d="M12 10.75C13.1046 10.75 14 9.85457 14 8.75C14 7.64543 13.1046 6.75 12 6.75C10.8954 6.75 10 7.64543 10 8.75C10 9.85457 10.8954 10.75 12 10.75Z"
      :fill="colors[1]"
    />
    <path
      d="M7.5 17.25C7.5 16.0565 7.97411 14.9119 8.81802 14.068C9.66193 13.2241 10.8065 12.75 12 12.75C13.1935 12.75 14.3381 13.2241 15.182 14.068C16.0259 14.9119 16.5 16.0565 16.5 17.25"
      :fill="colors[1]"
    />
  </svg>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { State } from "vuex-class";

@Component
class IconMine extends Vue {
  @State((state) => state.app.bottomNav) currentNav;

  @State((state) => state.app.settings.dark) isDark;

  get colors() {
    return this.currentNav === "mine"
      ? ["#159CFE", "#FFFFFF"]
      : this.isDark
      ? ["#191C1F", "#D9D9D9"]
      : ["#DDDDDD", "#FFFFFF"];
  }
}
export default IconMine;
</script>
