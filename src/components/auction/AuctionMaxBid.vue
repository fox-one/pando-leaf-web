<template>
  <auction-form-info-item
    :flip="flip"
    :hint="meta.hint"
    :label="meta.label"
    :value="meta.value"
    :fillable="true"
    @fill="handleFill()"
  >
  </auction-form-info-item>
</template>

<script lang="ts" scoped>
import { Vue, Component, Prop, PropSync } from "vue-property-decorator";
import AuctionFormInfoItem from "./AuctionFormInfoItem.vue";

@Component({
  components: {
    AuctionFormInfoItem,
  },
})
export default class AuctionMaxBid extends Vue {
  @Prop() flip!: API.Flip;

  @PropSync("amount") bindAmount!: string;

  get meta() {
    const getters = this.$store.getters as Getter.GettersTree;
    const { format } = this.$utils.number;
    const {
      minBid,
      maxBid,
      auctionSymbol,
      isDone,
      isStage1,
    } = getters.getFlipFields(this.flip);

    const label = isStage1
      ? this.$t("auction.max-bid")
      : this.$t("auction.max-reduction");

    return {
      isDone,
      isStage1,
      maxBid,
      label,
      hint: [
        "Each time the amount of the bid is reduced or increase by a minimum of 3%",
        "Highest bids = The vault’s original debt",
      ],
      minBid,
      value: `${format({ n: maxBid, dp: 8 })} ${auctionSymbol}`,
      fillable: true,
    };
  }

  handleFill() {
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
