<template>
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6 3L10 8L6 13"
      :stroke="color"
      stroke-width="1.5"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
class ListArrow extends Vue {
  get color() {
    const dark = this.$vuetify.theme.dark;
    return dark ? "white" : "black";
  }
}
export default ListArrow;
</script>
