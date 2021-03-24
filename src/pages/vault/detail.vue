<template>
  <div>{{ vaultId }}</div>
</template>

<script lang="ts" scoped>
import { Mixins } from "vue-property-decorator";
import mixins from "~/mixins";

export default class DepositForm extends Mixins(mixins.vault) {
  get title() {
    return `${this.collateral?.name} #${this.vault?.identity_id}`;
  }
}
</script>

<style lang="scss" scoped></style>
