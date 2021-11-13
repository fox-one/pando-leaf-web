<template>
  <div class="mt-3 ml-8 greyscale_3--text f-caption">
    {{ $t("auction.min-bid") }}

    <span class="ml-1 greyscale_1--text font-weight-bold" @click="autoBid()">
      {{ `${meta.minBid} ${meta.symbol}` }}

      <v-icon class="ml-1 mt-n1" size="12"> $iconAuctionDetail </v-icon>
    </span>
  </div>
</template>

<script lang="ts" scoped>
import { Vue, Component, Prop, PropSync } from "vue-property-decorator";

@Component({
  components: {},
})
export default class AuctionMinBid extends Vue {
  @Prop() flip!: API.Flip;

  @PropSync("debtAmount") bindAmount!: string;

  get meta() {
    const getters = this.$store.getters as Getter.GettersTree;
    const {
      minBid,
      isDone,
      isStage1,
      debtSymbol,
      auctionSymbol,
    } = getters.getFlipFields(this.flip);

    const symbol = isStage1 ? debtSymbol : auctionSymbol;
    return { isDone, isStage1, minBid, symbol };
  }

  autoBid() {
    if (this.meta.isDone) return;
    if (this.meta.isStage1) {
      this.bindAmount = this.meta.minBid;
    }
  }
}
</script>

<style lang="scss" scoped></style>
