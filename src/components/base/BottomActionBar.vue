<template>
  <div class="bottom-action-bar">
    <f-divider />
    <slot />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class extends Vue {}
</script>

<style lang="scss" scoped>
.bottom-action-bar {
  z-index: 2;
  position: fixed;
  width: 100%;
  left: 0;
  bottom: 0;
  padding-bottom: constant(safe-area-inset-bottom) !important;
  padding-bottom: env(safe-area-inset-bottom) !important;
  background-color: var(--v-greyscale_7-base);
}
</style>
