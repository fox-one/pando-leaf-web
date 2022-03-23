<template>
  <v-form ref="form">
    <base-form-input
      :amount.sync="inputCollateralAmount"
      type="number"
      :label="meta.auctionSymbol"
      :assets="[meta.auctionAsset]"
      :asset.sync="meta.auctionAsset"
      :selectable="false"
      hide-details
      fullfilled
      :placeholder="$t('auction.collateral-amount-placeholder')"
      :fillable="false"
      :rules="[meetCollateral]"
    >
    </base-form-input>

    <auction-max-bid
      class="my-6"
      :flip="flip"
      :amount.sync="inputCollateralAmount"
    />

    <auction-form-infos
      class="my-6"
      :amount="inputCollateralAmount"
      :type="'collateral'"
      :flip="flip"
    ></auction-form-infos>

    <div class="my-3 tip greyscale_3--text">
      {{ meta.stageEndTip }}
      <span class="greyscale_1--text">{{ meta.stageEndTipAmount }}</span>
    </div>

    <auction-collateral-action
      :amount="inputCollateralAmount"
      :flip="flip"
      @success="handleSuccess"
    />
  </v-form>
</template>

<script lang="ts" scoped>
import { Vue, Component, Prop, Ref } from "vue-property-decorator";
import AuctionMaxBid from "@/components/auction/AuctionMaxBid.vue";
import AuctionBidWarning from "@/components/auction/AuctionBidWarning.vue";
import AuctionCollateralAction from "./AuctionCollateralAction.vue";
import AuctionFormInfos from "./AuctionFormInfos.vue";

@Component({
  components: {
    AuctionMaxBid,
    AuctionBidWarning,
    AuctionCollateralAction,
    AuctionFormInfos,
  },
})
export default class AuctionCollateralForm extends Vue {
  @Prop() flip!: API.Flip;

  @Ref("form") form;

  inputCollateralAmount = "";

  get meta() {
    const getters = this.$store.getters as Getter.GettersTree;
    const {
      auctionAsset,
      auctionSymbol,
      debtSymbol,
      isStage2,
      maxBid,
      collateral,
    } = getters.getFlipFields(this.flip);
    const { toPercent } = this.$utils.number;

    return {
      auctionLogo: auctionAsset?.logo,
      auctionAsset,
      auctionSymbol,
      isStage2,
      maxBid,
      begText: toPercent({
        n: +(collateral?.beg ?? "1.03") - 1,
      }),
      stageEndTip: this.$t("auction.rule.stage-collateral-end"),
      stageEndTipAmount: `(${this.flip.bid} ${debtSymbol})`,
    };
  }

  meetCollateral(val) {
    return (
      +val <= +this.meta.maxBid ||
      this.$t("auction.rule.stage-collateral-2", {
        beg: this.meta.begText,
      })
    );
  }

  handleSuccess() {
    this.form.reset();
    this.$emit("success");
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
