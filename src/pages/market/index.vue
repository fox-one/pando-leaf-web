<template>
  <v-container class="fill-height"> asf </v-container>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import mixins from "@/mixins";

@Component
class VaultPage extends Mixins(mixins.page) {
  get title() {
    return this.$t("tab.market") as string;
  }

  get appbar() {
    return {
      style: "home" as const,
    };
  }

  get bottomNav() {
    return "market";
  }
}
export default VaultPage;
</script>
