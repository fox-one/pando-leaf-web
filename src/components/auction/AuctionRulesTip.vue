<template>
  <base-tooltip
    class="tooltip ml-1"
    :hint="meta.contents"
    :learn-more="meta.learnMore"
  >
  </base-tooltip>
</template>

<script lang="ts" scoped>
import { Vue, Component, Prop } from "vue-property-decorator";
import { LINKS } from "~/constants";

@Component({
  components: {},
})
export default class AuctionRulesTip extends Vue {
  @Prop() flip!: API.Flip;

  get meta() {
    const getters = this.$store.getters as Getter.GettersTree;
    const { collateral, isStage1, debtSymbol } = getters.getFlipFields(
      this.flip
    );

    const begText = this.$utils.number.toPercent({
      n: +(collateral?.beg ?? "1.03") - 1,
    });

    const content1 = isStage1
      ? this.$t("auction.rule.stage-price-1")
      : this.$t("auction.rule.stage-collateral-1");

    const content2 = isStage1
      ? this.$t("auction.rule.stage-price-2", {
          beg: begText,
          amount: this.flip.tab,
          symbol: debtSymbol,
        })
      : this.$t("auction.rule.stage-collateral-2", {
          beg: begText,
        });

    const content3 = isStage1
      ? this.$t("auction.rule.stage-price-3")
      : this.$t("auction.rule.stage-collateral-3");

    return {
      contents: [content1, content2, content3],
      learnMore: LINKS["auction.auction-participation"],
    };
  }
}
</script>

<style lang="scss" scoped>
.tooltip {
  display: inline-block;
}
</style>
