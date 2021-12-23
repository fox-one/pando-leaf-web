<template>
  <v-layout align-center class="ma-4 mt-4">
    <base-pair-logo :base="meta.collateralLogo" :quote="meta.debtLogo" />

    <span class="ml-2"> {{ meta.name }}</span>

    <v-spacer />
  </v-layout>
</template>

<script lang="ts" scoped>
import { Vue, Component, Prop } from "vue-property-decorator";

@Component({
  components: {},
})
export default class MarketItemTitle extends Vue {
  @Prop() collateral!: API.Collateral;

  get meta() {
    const getters = this.$store.getters as Getter.GettersTree;

    const { collateralAsset, debtAsset } = getters.getMarketFields(
      this.collateral?.id
    );

    return {
      name: this.collateral?.name,
      collateralLogo: collateralAsset?.logo,
      debtLogo: debtAsset?.logo,
    };
  }
}
</script>

<style></style>
