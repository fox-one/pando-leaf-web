<template>
  <div class="mt-3 ml-8 greyscale_3--text f-caption">
    {{ meta.title }}

    <span class="ml-1 greyscale_1--text font-weight-bold" @click="autoBid()">
      {{ `${meta.maxBid} ${meta.symbol}` }}

      <v-icon class="ml-1 mt-n1" size="12"> $iconAuctionDetail </v-icon>
    </span>
  </div>
</template>

<script lang="ts" scoped>
import { Vue, Component, Prop, PropSync } from "vue-property-decorator";

@Component({
  components: {},
})
export default class AuctionMaxBid extends Vue {
  @Prop() flip!: API.Flip;

  @PropSync("amount") bindAmount!: string;

  get meta() {
    const getters = this.$store.getters as Getter.GettersTree;
    const {
      maxBid,
      isDone,
      isStage1,
      debtSymbol,
      auctionSymbol,
    } = getters.getFlipFields(this.flip);

    const title = isStage1
      ? this.$t("auction.max-bid")
      : this.$t("auction.max-reduction");

    const symbol = isStage1 ? debtSymbol : auctionSymbol;
    return {
      title,
      isDone,
      isStage1,
      maxBid,
      symbol,
    };
  }

  autoBid() {
    if (this.meta.isDone) return;
    if (this.meta.isStage1) {
      this.bindAmount = this.meta.maxBid;
    } else {
      this.bindAmount = this.meta.maxBid;
    }
  }
}
</script>

<style lang="scss" scoped></style>
