<template>
  <div>
    <f-button
      fab
      @click="generateNewVault"
      class="greyscale_1 greyscale_7--text xx-small"
    >
      <v-icon size="16">$FIconAdd</v-icon>
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

<style lang="scss" scoped>
.xx-small {
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
}
</style>
