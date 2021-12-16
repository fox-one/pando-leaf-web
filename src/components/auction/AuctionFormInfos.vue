<template>
  <div>
    <auction-form-info-item
      class="my-3"
      v-for="item in infos"
      :key="item.label"
      :flip="flip"
      :hint="item.hint"
      :label="item.label"
      :value="item.value"
      :value-color="item.valueColor"
      :fillable="false"
    >
    </auction-form-info-item>
  </div>
</template>

<script lang="ts" scoped>
import { Vue, Component, Prop } from "vue-property-decorator";
import AuctionFormInfoItem from "./AuctionFormInfoItem.vue";

@Component({
  components: {
    AuctionFormInfoItem,
  },
})
export default class AuctionFormInfos extends Vue {
  @Prop() flip!: API.Flip;

  @Prop() amount!: string;

  @Prop() type!: "collateral" | "debt";

  get meta() {
    const getters = this.$store.getters as Getter.GettersTree;
    const { toPercent, format, isValid } = this.$utils.number;
    const {
      debtSymbol,
      debtAsset,
      auctionAsset,
      auctionSymbol,
      minBid,
      maxBid,
    } = getters.getFlipFields(this.flip);

    let inputBidPriceText = "-";
    let currentPriceText = "-";
    let priceDifference = 0;
    let priceDifferenceText = "-";

    const getWalletAssetById = getters["asset/getWalletAssetById"];
    const debtPrice = getWalletAssetById(debtAsset?.id ?? "")?.price_usd ?? 0;
    const auctionPrice =
      getWalletAssetById(auctionAsset?.id ?? "")?.price_usd ?? 0;
    const currentPrice = +auctionPrice / +debtPrice;
    currentPriceText = `1 ${auctionSymbol} ≈ ${format({
      n: currentPrice,
    })} ${debtSymbol}`;

    if (this.type === "debt") {
      const inputBidPrice = +this.amount / +this.flip.lot;
      if (inputBidPrice !== 0) {
        inputBidPriceText = `1 ${auctionSymbol} ≈ ${format({
          n: inputBidPrice,
        })} ${debtSymbol}`;
      }

      priceDifference = (inputBidPrice - currentPrice) / currentPrice;
      if (isValid(priceDifference)) {
        priceDifferenceText = `${toPercent({
          n: priceDifference,
        })}`;
      }
    }

    if (this.type === "collateral") {
      const inputBidPrice = +this.flip.bid / +this.amount;
      if (inputBidPrice !== 0) {
        inputBidPriceText = `1 ${auctionSymbol} ≈ ${format({
          n: inputBidPrice,
        })} ${debtSymbol}`;
      }

      priceDifference = (inputBidPrice - currentPrice) / currentPrice;
      if (isValid(priceDifference)) {
        priceDifferenceText = `${toPercent({
          n: priceDifference,
        })}`;
      }
    }

    return {
      debtSymbol,
      debtAsset,
      auctionSymbol,
      auctionAsset,
      minBid,
      maxBid,
      inputBidPriceText,
      currentPriceText,
      priceDifference,
      priceDifferenceText,
    };
  }

  get infos() {
    return [
      {
        label: this.$t("common.current-price"),
        value: this.meta.currentPriceText,
      },
      {
        label: this.$t("auction.my-bid-price"),
        value: this.meta.inputBidPriceText,
      },
      {
        label: this.$t("auction.price-difference"),
        value: this.meta.priceDifferenceText,
        valueColor:
          this.meta.priceDifference > 0
            ? "green"
            : this.meta.priceDifference < 0
            ? "red"
            : "greyscale_1",
      },
    ];
  }
}
</script>

<style lang="scss" scoped></style>
