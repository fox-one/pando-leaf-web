<template>
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="11"
      cy="11"
      r="7"
      :stroke="color"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
    <path
      d="M16 16L19.5355 19.5355"
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
class IconSearch extends Vue {
  @State((state) => state.app.settings.dark) isDark;

  get color() {
    return this.isDark ? "#ffffff" : "#000000";
  }
}
export default IconSearch;
</script>

<style lang="scss" scoped>
.icon {
  fill: none;
}
</style>
