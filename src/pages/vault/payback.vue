<template>
  <v-container>
    <base-alert close type="error">
      {{ $t("form.hint.debt.intro") }}
    </base-alert>
  </v-container>
</template>

<script lang="ts">
import { Component, Mixins } from "vue-property-decorator";
import mixins from "@/mixins";

@Component
class VaultPaybackPage extends Mixins(mixins.page) {
  get title() {
    return this.$t("form.title.payback");
  }

  get appbar() {
    return {
      back: true,
    };
  }
}
export default VaultPaybackPage;
</script>
