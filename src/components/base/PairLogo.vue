<template>
  <div class="pair-logo d-flex">
    <f-mixin-asset-logo class="z-index-2" :size="40" :logo="base" />
    <f-mixin-asset-logo class="ml-n4" :size="40" :logo="quote" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
class PairLogo extends Vue {
  @Prop() base!: string;

  @Prop() quote!: string;
}
export default PairLogo;
</script>

<style scoped>
.z-index-2 {
  z-index: 2;
}
</style>
