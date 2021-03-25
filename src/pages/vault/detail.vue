<template>
  <v-layout column>
    <v-app-bar />
    <vault-stats :vault="vault" :collateral="collateral" />
  </v-layout>
</template>

<script lang="ts" scoped>
import { Component, Mixins } from "vue-property-decorator";
import mixins from "~/mixins";
import VaultStats from "@/components/particles/VaultStats.vue";

@Component({
  components: {
    VaultStats,
  },
})
export default class VaultDetail extends Mixins(mixins.vault) {
  get title() {
    return `${this.collateral?.name} #${this.vault?.identity_id}`;
  }

  get appbar() {
    return {
      disabled: true,
    };
  }
}
</script>

<style lang="scss" scoped></style>
