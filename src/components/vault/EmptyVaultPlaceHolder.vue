<template>
  <v-layout column align-center justify-center>
    {{ "This vault don’t have any collateral" }}
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
class EmptyVaultPlaceHolder extends Vue {}
export default EmptyVaultPlaceHolder;
</script>
