<template>
  <div>
    <f-input
      v-model="inputCollateralAmount"
      class="input-collateral"
      type="number"
      :label="meta.auctionSymbol"
      :rules="[meetCollateral]"
    >
      <template #prepend>
        <f-mixin-asset-logo :size="24" :logo="meta.auctionLogo" />
      </template>
    </f-input>

    <div class="mt-3 ml-8 greyscale_3--text f-caption">
      {{ meta.inputFiatValue }}
    </div>

    <auction-max-bid :flip="flip" :amount.sync="inputCollateralAmount" />

    <auction-bid-warning :flip="flip" :amount.sync="inputCollateralAmount" />

    <auction-collateral-action
      :amount="inputCollateralAmount"
      :flip="flip"
      @success="handleSuccess"
    />
  </div>
</template>

<script lang="ts" scoped>
import { Vue, Component, Prop } from "vue-property-decorator";
import AuctionMaxBid from "@/components/auction/AuctionMaxBid.vue";
import AuctionBidWarning from "@/components/auction/AuctionBidWarning.vue";
import AuctionCollateralAction from "@/components/auction/AuctionCollateralAction.vue";

@Component({
  components: {
    AuctionMaxBid,
    AuctionBidWarning,
    AuctionCollateralAction,
  },
})
export default class AuctionCollateralForm extends Vue {
  @Prop() flip!: API.Flip;

  inputCollateralAmount = "";

  meetCollateral(val) {
    return (
      +val <= +this.meta.maxBid ||
      this.$t("auction.rule.stage-collateral-2", {
        beg: this.meta.begText,
      })
    );
  }

  get meta() {
    const getters = this.$store.getters as Getter.GettersTree;
    const {
      auctionAsset,
      auctionSymbol,
      isStage2,
      maxBid,
      collateral,
      collateralPrice,
    } = getters.getFlipFields(this.flip);
    const { toPrecision, toPercent } = this.$utils.number;

    return {
      auctionLogo: auctionAsset?.logo,
      auctionSymbol,
      isStage2,
      maxBid,
      begText: toPercent({
        n: +(collateral?.beg ?? "1.03") - 1,
      }),
      inputFiatValue: `≈ $${toPrecision({
        n: +collateralPrice * +this.inputCollateralAmount,
      })}`,
    };
  }

  handleSuccess() {
    this.inputCollateralAmount = "";
    this.$emit("success");
  }
}
</script>

<style lang="scss" scoped>
.input-collateral {
  width: 100%;
}
</style>
