<template>
  <v-layout column class="mx-6 pt-3">
    <v-layout v-for="item in infos" :key="item.label" align-center class="my-2">
      <div class="f-caption greyscale_3--text">{{ item.label }}</div>

      <v-spacer />

      <div class="f-caption greyscale_1--text font-weight-medium">
        {{ item.value }}
      </div>
    </v-layout>
  </v-layout>
</template>

<script lang="ts" scoped>
import { Vue, Component, Prop } from "vue-property-decorator";
import { Get } from "vuex-pathify";

@Component({
  components: {},
})
export default class AuctionsListItem extends Vue {
  @Prop() flip!: API.Flip;
  @Get("collateral/getCollateralById") getCollateral!: (id) => API.Collateral;
  @Get("asset/getAssetById") getAssetById!: (id) => API.Asset;

  get meta() {
    const { toPercent } = this.$utils.number;
    const collateral = this.getCollateral(this.flip?.collateral_id);
    const auctionAsset = this.getAssetById(collateral?.gem);
    const debtAsset = this.getAssetById(collateral?.dai);

    return {
      chop: toPercent({ n: Number(collateral?.chop) - 1 }),
      auctionSymbol: auctionAsset?.symbol,
      debtSymbol: debtAsset?.symbol,
    };
  }

  get infos() {
    return [
      {
        label: this.$t("auction.item.collateral-symbol"),
        value: `${this.flip.lot} ${this.meta.auctionSymbol}`,
      },
      {
        label: this.$t("auction.item.debt-symbol"),
        value: `${this.flip.bid} ${this.meta.debtSymbol}`,
      },
      {
        label: this.$t("form.info.liquidation-penalty"),
        value: this.meta.chop,
      },
    ];
  }
}
</script>

<style lang="scss" scoped></style>
