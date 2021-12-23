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
      :fillable="item.fillable"
      @fill="item.fillable ? item.handleFill() : handleNothing()"
    >
    </auction-form-info-item>

    <div class="my-3 tip greyscale_3--text">
      {{ $t("auction.rule.stage-price-end") }}
    </div>
  </div>
</template>

<script lang="ts" scoped>
import { Vue, Component, Prop, PropSync } from "vue-property-decorator";
import AuctionFormInfoItem from "./AuctionFormInfoItem.vue";

@Component({
  components: {
    AuctionFormInfoItem,
  },
})
export default class AuctionCollateralFormInfos extends Vue {
  @Prop() flip!: API.Flip;

  @PropSync("amount") inputCollateralAmount!: string;

  get meta() {
    const getters = this.$store.getters as Getter.GettersTree;
    const { isValid, toPrecision, toPercent, format } = this.$utils.number;
    const {
      isDone,
      debtSymbol,
      debtAsset,
      minBid,
      collateral,
      maxBid,
      debtPrice,
      auctionSymbol,
    } = getters.getFlipFields(this.flip);

    const currentPrice = +this.flip.bid / +this.flip.lot;
    let currentBidPriceText = `1 ${auctionSymbol} = ${format({
      n: currentPrice,
    })} ${debtSymbol}`;

    const inputBidPrice = +this.flip.bid / +this.inputCollateralAmount;
    let inputBidPriceText = "-";
    let priceDifference = "-";

    if (inputBidPrice !== 0 && isValid(+this.inputCollateralAmount)) {
      inputBidPriceText = `1 ${auctionSymbol} = ${format({
        n: inputBidPrice,
      })} ${debtSymbol}`;
      priceDifference = `${toPercent({
        n: (inputBidPrice - currentPrice) / currentPrice,
      })}`;
    }

    return {
      isDone,
      debtLogo: debtAsset?.logo,
      debtSymbol,
      debtAsset,
      debtPrice,
      minBid,
      minBidText: `${format({ n: minBid })} ${auctionSymbol}`,
      maxBid,
      maxBidText: `${format({ n: maxBid })} ${auctionSymbol}`,
      begText: toPercent({
        n: +(collateral?.beg ?? "1.03") - 1,
      }),
      inputFiatValue: `≈ $${toPrecision({
        n: +debtPrice / +this.inputCollateralAmount,
      })}`,
      inputBidPrice,
      inputBidPriceText,
      currentBidPriceText,
      priceDifference,
    };
  }

  get infos() {
    return [
      {
        label: this.$t("auction.min-bid-amount"),
        hint: [
          "Each time the amount of the bid is reduced or increase by a minimum of 3%",
          "Highest bids = The vault’s original debt",
        ],
        value: this.meta.minBidText,
        fillable: true,
        handleFill: () => {
          this.inputCollateralAmount = this.meta.minBid;
        },
      },
      {
        label: this.$t("common.current-price"),
        value: this.meta.currentBidPriceText,
      },
      {
        label: this.$t("auction.my-bid-price"),
        value: this.meta.inputBidPriceText,
      },
      {
        label: this.$t("auction.price-difference"),
        value: this.meta.priceDifference,
        valueColor: this.meta.inputBidPrice !== 0 ? "green" : undefined,
      },
    ];
  }

  handleNothing() {
    console.log("nothing");
  }
}
</script>

<style lang="scss" scoped>
.tip {
  font-weight: 500;
  font-size: 13px;
  line-height: 16px;
}
</style>
