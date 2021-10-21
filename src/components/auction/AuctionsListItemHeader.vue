<template>
  <v-layout align-center class="mx-6 pt-6">
    <base-pair-logo :base="meta.auctionLogo" :quote="meta.debtLogo" />

    <div class="f-caption ml-2 greyscale_4--text">
      #{{ meta.id.slice(0, 5) }}
    </div>

    <v-spacer />

    <span class="f-caption greyscale_4--text" justify-end>
      {{ meta.endTime }}
    </span>
  </v-layout>
</template>

<script lang="ts" scoped>
import dayjs from "dayjs";
import { Vue, Component, Prop } from "vue-property-decorator";
import { Get } from "vuex-pathify";
import { FlipAction } from "~/enums";

@Component
export default class AuctionsListItemHeader extends Vue {
  @Prop() flip!: API.Flip;

  @Get("collateral/getCollateralById") getCollateral!: (id) => API.Collateral;

  @Get("asset/getAssetById") getAssetById!: (id) => API.Asset;

  get meta() {
    const { format } = this.$utils.time;
    const collateral = this.getCollateral(this.flip?.collateral_id);
    const auctionAsset = this.getAssetById(collateral?.gem);
    const debtAsset = this.getAssetById(collateral?.dai);

    const isDone = this.flip.action === FlipAction.FlipDeal;
    let endTime;

    if (isDone) {
      endTime = format(this.flip?.tic);
    } else {
      if (dayjs(this.flip.tic).unix() === 0) {
        endTime = format(this.flip?.tic);
      } else {
        endTime = dayjs(this.flip.tic).isBefore(dayjs(this.flip.end))
          ? format(this.flip.tic)
          : format(this.flip.end);
      }
    }

    return {
      id: this.flip.id,
      auctionLogo: auctionAsset?.logo,
      debtLogo: debtAsset?.logo,
      endTime,
    };
  }
}
</script>
