<template>
  <v-layout
    class="placeholder greyscale_3--text text-center"
    column
    justify-center
  >
    {{ $t("me.vault-empty", { id: shorterId }) }}
  </v-layout>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
class EmptyVaultPlaceHolder extends Vue {
  @Prop() id!: string;

  get shorterId() {
    const { vault } = this.$store.getters.getVaultFields(this.id);

    return "#" + vault.identity_id;
  }
}
export default EmptyVaultPlaceHolder;
</script>

<style lang="scss" scoped>
.placeholder {
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 14px;
}
</style>
