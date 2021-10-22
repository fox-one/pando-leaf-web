<template>
  <div>
    <v-layout justify-start align-center>
      <f-mixin-asset-logo :size="24" :logo="meta.auctionLogo" />

      <f-input
        v-model="inputCollateralAmount"
        class="input-collateral ml-2"
        type="number"
        :label="meta.auctionSymbol"
        :rules="[meetCollateral]"
      />
    </v-layout>

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
import { Get } from "vuex-pathify";

@Component({
  components: {
    AuctionMaxBid,
    AuctionBidWarning,
    AuctionCollateralAction,
  },
})
export default class AuctionCollateralForm extends Vue {
  @Get("account/userId") user_id;

  @Prop() flip!: API.Flip;

  inputCollateralAmount = "";

  loading = false;

  follow_id = "";

  meetCollateral(val) {
    return +val <= +this.meta.maxBid;
  }

  get meta() {
    const getters = this.$store.getters as Getter.GettersTree;
    const {
      auctionAsset,
      auctionSymbol,
      isStage2,
      maxBid,
      collateralPrice,
    } = getters.getFlipFields(this.flip);
    const { toPrecision } = this.$utils.number;

    return {
      auctionLogo: auctionAsset?.logo,
      auctionSymbol,
      isStage2,
      maxBid,
      inputFiatValue: `≈ $${toPrecision({
        n: +collateralPrice * +this.inputCollateralAmount,
      })}`,
    };
  }

  handleSuccess() {
    this.$emit("success");
  }
}
</script>

<style lang="scss" scoped>
.input-collateral {
  width: 100%;
}
</style>
