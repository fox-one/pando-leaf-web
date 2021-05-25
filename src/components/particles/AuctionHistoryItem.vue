<template>
  <div>
    <v-layout column class="py-3">
      <v-layout align-center class="f-body-1">
        <span class="font-weight-bold">{{ meta.actionText }}</span>
        <v-spacer />
        <span class="text-right f-caption">{{ meta.time }}</span>
      </v-layout>
      <div class="f-body-2">{{ meta.actionContent }}</div>
    </v-layout>
  </div>
</template>

<script lang="ts" scoped>
import { Vue, Component, Prop } from "vue-property-decorator";
import { Getter } from "vuex-class";
import { IAsset, ICollateral, IFlip, IFlipEvent } from "~/services/types/vo";
import { FlipAction } from "~/types";

@Component
export default class HistoryItem extends Vue {
  @Getter("global/getCollateral") getCollateral!: (id) => ICollateral;
  @Getter("global/getAssetById") getAssetById!: (id) => IAsset;
  @Prop() flipEvent!: IFlipEvent;
  @Prop() flip!: IFlip;

  get meta() {
    const collateral = this.getCollateral(this.flip?.collateral_id);
    const collateralAsset = this.getAssetById(collateral?.gem);
    const debtAsset = this.getAssetById(collateral?.dai);
    let actionText = this.$t("auction.history.bid.title");
    let actionContent = this.$t("auction.history.bid.content", {
      debtamount: this.flipEvent.bid,
      debtsymbol: debtAsset?.symbol,
      colamount: this.flipEvent.lot,
      colsymbol: collateralAsset?.symbol,
    });
    if (this.flipEvent.action === FlipAction.FlipKick) {
      actionText = this.$t("auction.history.kick.title");
      actionContent = this.$t("auction.history.kick.content", {
        debtamount: this.flipEvent.bid,
        debtsymbol: debtAsset?.symbol,
        colamount: this.flipEvent.lot,
        colsymbol: collateralAsset?.symbol,
      });
    }
    if (this.flipEvent.action === FlipAction.FlipDeal) {
      actionText = this.$t("auction.history.deal.title");
      actionContent = this.$t("auction.history.deal.content", {
        debtamount: this.flipEvent.bid,
        debtsymbol: debtAsset?.symbol,
        colamount: this.flipEvent.lot,
        colsymbol: collateralAsset?.symbol,
      });
    }
    return {
      actionText,
      actionContent,
      time: this.$utils.time.format(this.flipEvent.created_at),
    };
  }
}
</script>

<style lang="scss" scoped></style>
