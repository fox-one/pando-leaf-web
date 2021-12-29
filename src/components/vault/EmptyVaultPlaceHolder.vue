<template>
  <v-layout
    class="placeholder greyscale_1--text text-center"
    column
    justify-center
  >
    {{ $t("me.vault-empty") }}
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
class EmptyVaultPlaceHolder extends Vue {}
export default EmptyVaultPlaceHolder;
</script>

<style lang="scss" scoped>
.placeholder {
  font-size: 13px;
  font-weight: 600;
  line-height: 16px;
}
</style>
