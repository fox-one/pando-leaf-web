<template>
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M18 8L9.42857 16L6 12"
      :stroke="color"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { State } from "vuex-class";

@Component
class Check extends Vue {
  @State((state) => state.app.settings.dark) isDark;
  get color() {
    return this.isDark ? "white" : "black";
  }
}
export default Check;
</script>
<style lang="scss" scoped></style>
