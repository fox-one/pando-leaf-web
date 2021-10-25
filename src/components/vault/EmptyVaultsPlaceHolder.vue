<template>
  <v-layout column align-center justify-center>
    <v-icon class="mb-8" size="110">$iconNoVault</v-icon>
    <div class="greyscale_1--text body-2 mb-8">{{ $t("me.no-vault-1") }}</div>

    <action-create-vault @itemclick="handleItemclick" />
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import ActionCreateVault from "./ActionCreateVault.vue";

@Component({
  components: {
    ActionCreateVault,
  },
})
class EmptyPlaceHolder extends Vue {
  handleItemclick(item: API.Collateral) {
    this.$router.push({ name: "vault-open", query: { id: item.id } });
  }
}
export default EmptyPlaceHolder;
</script>
