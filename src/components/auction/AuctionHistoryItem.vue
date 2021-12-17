<template>
  <div>
    <v-layout column class="py-4">
      <v-layout align-center justify-space-between class="mb-2 text-1">
        <span class="font-weight-bold">
          {{ meta.actionText
          }}<span v-if="meta.is_me" class="tag ml-1">You</span>
        </span>
        <span class="text-right f-caption greyscale_4--text">
          {{ meta.time }}
        </span>
      </v-layout>
      <div class="f-caption greyscale_3--text">{{ meta.actionContent }}</div>
    </v-layout>
  </div>
</template>

<script lang="ts" scoped>
import { Vue, Component, Prop } from "vue-property-decorator";
import { FlipAction } from "~/enums";

@Component
export default class AuctionHistoryItem extends Vue {
  @Prop() flipEvent!: API.FlipEvent;
  @Prop() flip!: API.Flip;

  get meta() {
    const getters = this.$store.getters as Getter.GettersTree;
    const getAssetById = getters["asset/getAssetById"];
    const getCollateral = getters["collateral/getCollateralById"];
    const collateral = getCollateral(this.flip?.collateral_id);
    const collateralAsset = getAssetById(collateral?.gem ?? "");
    const debtAsset = getAssetById(collateral?.dai ?? "");
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
      time: this.$utils.time.toRelative(this.flipEvent.created_at),
      is_me: this.flipEvent.is_me,
    };
  }
}
</script>
<style lang="scss" scoped>
.tag {
  padding: 2px 4px;
  background: #8fe613;
  border-radius: 4px;
  color: #2e2e2e;
  font-weight: 600;
  font-size: 10px;
  line-height: 14px;
}
</style>
