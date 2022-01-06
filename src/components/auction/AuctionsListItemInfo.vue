<template>
  <v-layout column class="mx-6 pt-3">
    <v-layout v-for="item in infos" :key="item.label" align-center class="my-2">
      <div class="f-caption greyscale_3--text">{{ item.label }}</div>

      <v-spacer />

      <div class="f-caption greyscale_1--text font-weight-medium">
        {{ item.value }}
      </div>
    </v-layout>
  </v-layout>
</template>

<script lang="ts" scoped>
import { Vue, Component, Prop } from "vue-property-decorator";

@Component({
  components: {},
})
export default class AuctionsListItem extends Vue {
  @Prop() flip!: API.Flip;

  get meta() {
    const { toPercent } = this.$utils.number;
    const getters = this.$store.getters as Getter.GettersTree;
    const { collateral, auctionSymbol, debtSymbol } = getters.getFlipFields(
      this.flip
    );

    return {
      chop: toPercent({ n: Number(collateral?.chop) - 1 }),
      auctionSymbol,
      debtSymbol,
    };
  }

  get infos() {
    return [
      {
        label: this.$t("common.collateral"),
        value: `${this.flip.lot} ${this.meta.auctionSymbol}`,
      },
      {
        label: this.$t("common.bid"),
        value: `${this.flip.bid} ${this.meta.debtSymbol}`,
      },
      {
        label: this.$t("common.liquidation-penalty"),
        value: this.meta.chop,
      },
    ];
  }
}
</script>

<style lang="scss" scoped></style>
