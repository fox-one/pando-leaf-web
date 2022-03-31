<template>
  <div>
    <v-layout @click="toDetail(flip)">
      <f-mixin-asset-logo :logo="meta.logo" :size="36" class="ml-4 mt-6 mr-3" />

      <div class="flex-grow-1 mt-6">
        <div class="item-title">{{ flip.lot }} {{ meta.symbol }}</div>
        <div class="item-content">
          {{ meta.price }}
        </div>

        <v-layout v-if="meta.isStage1 || meta.isStage2">
          <!-- timer -->
          <div class="round-tag mt-3">
            <span class="greyscale_1--text"
              >ROUND {{ meta.isStage1 ? "1" : "2" }}</span
            >
            <count-down-timer
              class="ml-3"
              :diffSeconds="meta.diffSeconds"
            ></count-down-timer>
          </div>
        </v-layout>
      </div>

      <!-- label buttons -->
      <template v-if="meta.isStage1 || meta.isStage2">
        <div v-if="meta.leading">
          <span class="label-button leading"> {{ $t("auction.leading") }}</span>

          <my-vault-tag v-if="meta.isMyVault" class="mt-2" />
        </div>

        <div v-else-if="meta.participated">
          <span class="label-button check-my-bid">
            {{ $t("auction.check-my-bid") }}
          </span>
          <my-vault-tag v-if="meta.isMyVault" class="mt-2" />
        </div>

        <div v-else>
          <span class="label-button bid-it"> {{ $t("auction.bid-it") }}</span>

          <my-vault-tag v-if="meta.isMyVault" class="mt-2" />
        </div>
      </template>

      <template v-else>
        <my-vault-tag style="margin-top: 30.5px" :triangle="false" />

        <v-icon class="mt-9 mr-4" align-self-end size="16">
          $FIconChevronRight
        </v-icon>
      </template>
    </v-layout>

    <f-divider class="mt-6" />
  </div>
</template>

<script lang="ts" scoped>
import { Vue, Component, Prop } from "vue-property-decorator";
import CountDownTimer from "@/components/auction/CountDownTimer.vue";
import MyVaultTag from "@/components/auction/MyVaultTag.vue";
import dayjs from "dayjs";

@Component({
  components: {
    CountDownTimer,
    MyVaultTag,
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
      isMyVault,
      leading,
      participated,
    } = getters.getFlipFields(this.flip);
    const price = `1 ${auctionSymbol} ≈ ${collateral2debt} ${debtSymbol}`;
    let diffSeconds = dayjs(this.flip.tic).diff(dayjs(), "seconds");
    if (
      dayjs(this.flip.tic).unix() === 0 ||
      dayjs(this.flip.tic).isAfter(dayjs(this.flip.end))
    ) {
      diffSeconds = dayjs(this.flip.end).diff(dayjs(), "seconds");
    }

    return {
      logo: auctionAsset?.logo,
      symbol: auctionAsset?.symbol,
      price,
      leading,
      participated,
      isStage1,
      isStage2,
      isMyVault,
      diffSeconds,
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
  display: inline-flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(
    105deg,
    #cbf58d 0%,
    #cbf58d 50%,
    #ffffff 50%,
    #ffffff 52%,
    #effbdd 52%,
    #effbdd 100%
  );
  border-radius: 8px;
  color: #9fc665;
  font-weight: 500;
  font-size: 12px;
  line-height: 15px;
  height: 23px;
  padding: 4px 8px;
}
</style>
