<template>
  <div v-if="meta.isStage2" class="mt-3 ml-8 f-caption warning--text">
    {{ meta.warning }}
  </div>
</template>

<script lang="ts" scoped>
import { Vue, Component, Prop, PropSync } from "vue-property-decorator";

@Component({
  components: {},
})
export default class AuctionBidWarning extends Vue {
  @Prop() flip!: API.Flip;

  @PropSync("amount") bindAmount!: string;

  get meta() {
    const getters = this.$store.getters as Getter.GettersTree;
    const { isStage2, debtSymbol, auctionSymbol } = getters.getFlipFields(
      this.flip
    );

    const warning = this.$t("auction.reduction-agreement", {
      price: `${this.flip?.tab} ${debtSymbol}`,
      amount: `${this.bindAmount ? this.bindAmount : "-"}`,
      collateral: auctionSymbol,
    });

    return { isStage2, warning };
  }
}
</script>

<style lang="scss" scoped></style>
