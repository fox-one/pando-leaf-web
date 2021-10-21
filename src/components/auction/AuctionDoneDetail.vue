<template>
  <v-layout column>
    <div class="label-1 greyscale_3--text mb-4">
      {{ $t("auction.label.debt.highest") }}
    </div>

    <v-layout align-center>
      <f-mixin-asset-logo :size="24" :logo="meta.logo" />

      <div class="text-1 ml-2">
        {{ `= ${flip.bid} ${meta.debtSymbol}` }}
      </div>
    </v-layout>
  </v-layout>
</template>

<script lang="ts" scoped>
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class AuctionDoneDetail extends Vue {
  @Prop() flip!: API.Flip;

  get meta() {
    const getters = this.$store.getters as Getter.GettersTree;
    const { debtSymbol, debtAsset } = getters.getFlipFields(this.flip);

    const logo = debtAsset?.logo;

    return {
      debtSymbol,
      logo,
    };
  }
}
</script>

<style lang="scss" scoped></style>
