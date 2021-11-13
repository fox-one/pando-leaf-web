<template>
  <v-layout class="f-caption text--disabled" column justify-center>
    {{ $t("me.vault-empty") }}
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
class EmptyVaultPlaceHolder extends Vue {}
export default EmptyVaultPlaceHolder;
</script>
