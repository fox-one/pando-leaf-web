<template>
  <v-layout align-center class="pa-6">
    <base-pair-logo :base="meta.collateralLogo" :quote="meta.debtLogo" />

    <span class="ml-3 font-weight-semibold"> {{ meta.name }}</span>

    <v-spacer />

    <market-item-action
      v-if="showButton"
      :collateral="collateral"
    ></market-item-action>
  </v-layout>
</template>

<script lang="ts" scoped>
import { Vue, Component, Prop } from "vue-property-decorator";
import MarketItemAction from "@/components/market/MarketItemAction.vue";

@Component({
  components: {
    MarketItemAction,
  },
})
export default class MarketItemTitle extends Vue {
  @Prop() collateral!: API.Collateral;

  @Prop({ default: true }) showButton!: boolean;

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
