<template>
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M2 8C2 7.44772 2.44772 7 3 7H13C13.5523 7 14 7.44772 14 8C14 8.55228 13.5523 9 13 9H3C2.44772 9 2 8.55228 2 8Z"
      :fill="color"
    />
    <path
      d="M8 2C8.55228 2 9 2.44772 9 3L9 13C9 13.5523 8.55228 14 8 14C7.44771 14 7 13.5523 7 13L7 3C7 2.44771 7.44772 2 8 2Z"
      :fill="color"
    />
  </svg>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { State } from "vuex-class";

@Component
class Add extends Vue {
  @State((state) => state.app.settings.dark) isDark;
  get color() {
    return this.isDark ? "black" : "white";
  }
}
export default Add;
</script>
<style lang="scss" scoped></style>
