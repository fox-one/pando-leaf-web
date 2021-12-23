<template>
  <div>
    <f-button
      block
      @click="generateNewVault"
      class="greyscale_1 greyscale_7--text"
    >
      <v-icon size="16" class="mr-2">$FIconAdd</v-icon>
      {{ $t("common.add-a-vault") }}
    </f-button>
  </div>
</template>

<script lang="ts" scoped>
import { Vue, Component, Prop } from "vue-property-decorator";

@Component({
  components: {},
})
export default class MarketItemAction extends Vue {
  @Prop() collateral!: API.Collateral;

  generateNewVault() {
    this.$router.push(`/vault/open?id=${this.collateral.id}`);
  }
}
</script>

<style></style>
