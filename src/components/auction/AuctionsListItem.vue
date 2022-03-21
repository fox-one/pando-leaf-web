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

      <!-- label buttons -->
      <template v-if="meta.isStage1 || meta.isStage2">
        <div v-if="meta.isYourBid" class="label-button check-my-bid">
          Check My Bid
        </div>

        <div v-else-if="meta.leading" class="label-button leading">Leading</div>

        <div v-else class="label-button bid-it">Bid it</div>
      </template>

      <v-icon v-else class="mt-6 mr-4" align-self-end size="16">
        $FIconChevronRight
      </v-icon>
    </v-layout>

    <v-layout v-if="meta.isStage1 || meta.isStage2" justify-space-between>
      <!-- timer -->
      <div class="round-tag">
        <span>ROUND {{ meta.isStage1 ? "1" : "2" }}</span>

        <count-down-timer :diffSeconds="meta.diffSeconds"></count-down-timer>
      </div>

      <!-- my vault tag -->
      <div align-self-end class="top-arrow-tag">My Vault</div>
    </v-layout>

    <f-divider />
  </div>
</template>

<script lang="ts" scoped>
import { Vue, Component, Prop } from "vue-property-decorator";
import CountDownTimer from "@/components/auction/CountDownTimer.vue";
import dayjs from "dayjs";

@Component({
  components: {
    CountDownTimer,
  },
})
export default class AuctionsListItem extends Vue {
  @Prop() flip!: API.Flip;

  timer: any = null;

  get meta() {
    const getters = this.$store.getters as Getter.GettersTree;
    const {
      auctionAsset,
      auctionSymbol,
      debtSymbol,
      collateral2debt,
      isStage1,
      isStage2,
      isYourBid,
      isMyVault,
    } = getters.getFlipFields(this.flip);
    const price = `1 ${auctionSymbol} ≈ ${collateral2debt} ${debtSymbol}`;
    return {
      logo: auctionAsset?.logo,
      symbol: auctionAsset?.symbol,
      price,
      isStage1,
      isStage2,
      isYourBid,
      isMyVault,
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

.top-arrow-tag {
  color: white;
  background: #f58721;
  border-radius: 28px;
  padding: 6px 10px;
  font-weight: 600;
  font-size: 12px;
  line-height: 15px;
}

.label-button {
  height: 36px;
  border-radius: 53px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  align-self: flex-end;
  padding: 10px 16px;
  font-weight: 600;
  margin-top: 24px;
  margin-right: 16px;
  font-size: 14px;
  line-height: 17px;

  &.bid-it {
    background: var(--v-greyscale_1-base);
    color: var(--v-greyscale_7-base);
  }

  &.check-my-bid {
    background: var(--v-greyscale_6-base);
    color: var(--v-greyscale_1-base);
  }

  &.leading {
    background: #cbf58d;
    color: #000000;
  }
}

.round-tag {
  background: #cbf58d;
  height: 23px;
  padding: 4px 8px;
}
</style>
