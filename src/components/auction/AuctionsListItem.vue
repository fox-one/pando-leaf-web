<template>
  <div>
    <v-layout @click="toDetail(flip)" align-center class="pb-6">
      <f-mixin-asset-logo :logo="meta.logo" :size="36" class="ml-4 mt-6 mr-3" />

      <div class="flex-grow-1 mt-6">
        <div class="item-title">{{ flip.lot }} {{ meta.symbol }}</div>
        <div class="item-content">
          {{ meta.price }}
        </div>
      </div>

      <v-icon class="mt-6 mr-4" align-self-end size="16">
        $FIconChevronRight
      </v-icon>
    </v-layout>

    <f-divider />
  </div>
</template>

<script lang="ts" scoped>
import { Vue, Component, Prop } from "vue-property-decorator";
import dayjs from "dayjs";

@Component({
  components: {},
})
export default class AuctionsListItem extends Vue {
  @Prop() flip!: API.Flip;

  timer: any = null;

  get meta() {
    const getters = this.$store.getters as Getter.GettersTree;
    const { auctionAsset, auctionSymbol, debtSymbol, collateral2debt } =
      getters.getFlipFields(this.flip);
    const price = `1 ${auctionSymbol} ≈ ${collateral2debt} ${debtSymbol}`;
    return {
      logo: auctionAsset?.logo,
      symbol: auctionAsset?.symbol,
      price,
    };
  }

  mounted() {
    let diffSeconds = dayjs(this.flip.tic).diff(dayjs(), "seconds");
    if (
      dayjs(this.flip.tic).unix() === 0 ||
      dayjs(this.flip.tic).isAfter(dayjs(this.flip.end))
    ) {
      diffSeconds = dayjs(this.flip.end).diff(dayjs(), "seconds");
    }
    if (diffSeconds > 0) {
      this.timer = setTimeout(() => {
        this.$emit("refresh");
      }, (diffSeconds + 3) * 1000);
    }
  }

  beforeDestroy() {
    clearTimeout(this.timer);
  }

  toDetail(flip: API.Flip) {
    this.$router.push(`/auction?id=${flip.id}`);
  }
}
</script>
<style lang="scss" scoped>
.item-title {
  margin-bottom: 8px;
  font-weight: 600;
  font-size: 14px;
  line-height: 17px;
  color: var(--v-greyscale_1-base);
}

.item-content {
  font-weight: 400;
  font-size: 12px;
  line-height: 15px;
  color: var(--v-greyscale_3-base);
}
</style>
