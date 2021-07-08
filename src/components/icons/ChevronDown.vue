<template>
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4 7L8 10L12 7"
      stroke="currentColor"
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
class ChevronDown extends Vue {
  @State((state) => state.app.settings.dark) isDark;

  get color() {
    return this.isDark ? "white" : "black";
  }
}
export default ChevronDown;
</script>
