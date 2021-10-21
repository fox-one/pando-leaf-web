<template>
  <v-layout column>
    <div class="label-1 greyscale_3--text mb-4">
      {{ meta.title }}
    </div>

    <v-layout align-center>
      <f-mixin-asset-logo :size="24" :logo="meta.logo" />
      <div class="text-1 ml-2">
        {{ meta.collateralAmountText }}
      </div>
    </v-layout>

    <div class="text-1 mt-3 ml-8">
      {{ meta.collateralValueText }}
    </div>

    <div v-if="meta.isStage1" class="text-1 mt-3 ml-8 greyscale_3--text">
      <div>{{ `≈ $${meta.collateralFiatValue}` }}</div>

      <div class="mt-2">
        {{ `${$t("form.info.current-price")}: ${meta.curPrice}` }}
      </div>
    </div>
  </v-layout>
</template>

<script lang="ts" scoped>
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class AuctionDetail extends Vue {
  @Prop() flip!: API.Flip;

  get meta() {
    const getters = this.$store.getters as Getter.GettersTree;
    const {
      isDone,
      isStage1,
      isStage2,
      debtFiatValue,
      collateralValue,
      auctionSymbol,
      debtSymbol,
      debtAsset,
      auctionAsset,
      curPrice,
      collateralFiatValue,
    } = getters.getFlipFields(this.flip);

    const title = isStage2
      ? this.$t("auction.label.debt")
      : this.$t("auction.label.collateral");

    const logo = isStage2 ? debtAsset?.logo : auctionAsset?.logo;

    const collateralAmountText = isStage2
      ? `= ${this.flip.tab} ${debtSymbol}`
      : `= ${this.flip.lot} ${auctionSymbol}`;

    const collateralValueText = isStage2
      ? `≈ $${debtFiatValue}`
      : `≈ ${collateralValue} ${debtSymbol}`;

    return {
      isDone,
      title,
      logo,
      collateralAmountText,
      collateralValueText,
      collateralFiatValue,
      curPrice,
      isStage1,
      isStage2,
    };
  }
}
</script>

<style lang="scss" scoped></style>
