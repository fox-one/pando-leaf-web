<template>
  <div class="pair-logo d-flex">
    <f-mixin-asset-logo class="z-index-2 round-white" :size="36" :logo="base" />
    <f-mixin-asset-logo class="ml-n3" :size="36" :logo="quote" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component({})
export default class PairLogo extends Vue {
  @Prop() base!: string;

  @Prop() quote!: string;
}
</script>

<style scoped>
.z-index-2 {
  z-index: 2;
}
.round-white {
  width: 40px !important;
  height: 40px !important;
  margin-top: -2px;
  border: 2px solid var(--v-greyscale_6-base);
  border-radius: 72px;
}
</style>
