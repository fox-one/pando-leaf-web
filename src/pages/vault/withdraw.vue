<template>
  <v-container></v-container>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import mixins from "@/mixins";

@Component
class VaultWithdrawPage extends Mixins(mixins.page) {
  get title() {
    return this.$t("tab.home") as string;
  }
}
export default VaultWithdrawPage;
</script>
