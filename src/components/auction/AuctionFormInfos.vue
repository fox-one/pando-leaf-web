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
    let inputBidPrice = 0;

    const getNetworkAssetById = getters["asset/getNetworkAssetById"];
    const debtWalletAsset = getNetworkAssetById(debtAsset?.id ?? "");
    const debtPrice = debtWalletAsset?.price_usd ?? 0;
    const auctionWalletAsset = getNetworkAssetById(auctionAsset?.id ?? "");

    const auctionPrice = auctionWalletAsset?.price_usd ?? 0;
    const currentPrice = +auctionPrice / +debtPrice;

    if (isValid(currentPrice)) {
      currentPriceText = `1 ${auctionSymbol} ≈ ${format({
        n: currentPrice,
      })} ${debtSymbol}`;
    }

    if (this.type === "debt") {
      inputBidPrice = +this.amount / +this.flip.lot;
    } else if (this.type === "collateral") {
      inputBidPrice = +this.flip.bid / +this.amount;
    }

    if (inputBidPrice !== 0 && isValid(+this.amount) && +this.amount > 0) {
      inputBidPriceText = `1 ${auctionSymbol} ≈ ${format({
        n: inputBidPrice,
      })} ${debtSymbol}`;
    }

    priceDifference = (inputBidPrice - currentPrice) / currentPrice;
    if (isValid(priceDifference) && isValid(+this.amount) && +this.amount > 0) {
      priceDifferenceText = `${toPercent({
        n: priceDifference,
      })}`;
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
