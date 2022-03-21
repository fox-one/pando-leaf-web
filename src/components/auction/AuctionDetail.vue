<template>
  <v-layout column>
    <!-- title -->
    <div class="auction-detail-header">
      <div class="title">
        {{ "Selling Off" }}
      </div>

      <div class="value">
        {{ meta.vaultCollateralValueText }}
        <span class="round-icon">
          <v-icon size="16" @click="changeCollateral"
            >$FIconExchange4PBold</v-icon
          >
        </span>
      </div>

      <div class="title">
        {{ "For" }}
      </div>

      <div class="value">{{ flip.bid }} {{ meta.debtSymbol }}</div>
    </div>

    <!-- line -->
    <div class="ma-0 mt-5 pa-0 line" :class="meta.isStage1 ? 'left' : 'right'">
      <div cols="6" class="line active pa-0 ma-0"></div>
    </div>

    <v-row no-gutters>
      <!-- left -->
      <v-col cols="6">
        <div
          class="action-detail-label"
          :class="meta.isStage1 ? 'highlight' : ''"
        >
          ROUND 1
        </div>

        <div
          class="action-detail-value"
          :class="meta.isStage1 ? 'highlight' : ''"
        >
          <count-down-timer
            v-if="meta.isStage1"
            :diff-seconds="meta.diffSeconds"
          ></count-down-timer>

          <div v-else>Ended</div>
        </div>

        <div class="action-detail-label">
          {{ $t("auction.vault-debt") }}
        </div>

        <div class="action-detail-value">
          {{ `${meta.vaultDebtAmount} ${meta.debtSymbol}` }}
        </div>

        <div
          class="action-detail-label"
          :class="meta.isYourBid && meta.isStage1 ? 'highlight' : ''"
        >
          {{ meta.bidLabel }}
          {{ meta.isYourBid && meta.isStage1 ? "(You)" : "" }}
        </div>

        <div class="action-detail-value mb-6">
          {{ `${flip.bid} ${meta.debtSymbol}` }}
        </div>
      </v-col>

      <!-- right -->
      <v-col cols="6">
        <div
          class="action-detail-label"
          :class="meta.isStage1 ? 'disabled' : meta.isStage2 ? 'highlight' : ''"
        >
          ROUND 2
        </div>

        <div
          class="action-detail-value"
          :class="meta.isStage1 ? 'disabled' : meta.isStage2 ? 'highlight' : ''"
        >
          <count-down-timer
            v-if="meta.isStage1"
            :diff-seconds="meta.diffSeconds"
          ></count-down-timer>

          <div v-else>-</div>
        </div>

        <div class="action-detail-label mt-2">
          {{ $t("auction.vault-collateral") }}
          <v-icon
            size="12"
            color="greyscale_7"
            class="greyscale_2 rounded-circle exchange-icon"
            @click="changeCollateral"
          >
            $FIconExchange4PBold
          </v-icon>
        </div>

        <div class="action-detail-value">
          {{ meta.vaultCollateralValueText }}
        </div>

        <div
          class="action-detail-label"
          :class="meta.isYourBid ? 'your-bid' : ''"
          v-if="meta.isStage2"
        >
          {{ $t("auction.current-bid") }} {{ meta.isYourBid ? "(You)" : "" }}
        </div>

        <div class="action-detail-value" v-if="meta.isStage2">
          {{ `${flip.lot} ${meta.auctionSymbol}` }}
        </div>
      </v-col>
    </v-row>
  </v-layout>
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
export default class AuctionDetail extends Vue {
  @Prop() flip!: API.Flip;

  showFiat = false;

  get meta() {
    const { toFiat } = this.$utils.number;
    const getters = this.$store.getters as Getter.GettersTree;
    const {
      isDone,
      isStage1,
      isStage2,
      auctionSymbol,
      debtSymbol,
      debtAsset,
      auctionAsset,
      vaultDebtAmount,
      vaultCollateralAmount,
      isYourBid,
    } = getters.getFlipFields(this.flip);

    const networkAuctionAsset = getters["asset/getNetworkAssetById"](
      auctionAsset?.id ?? ""
    );

    const debtLogo = debtAsset?.logo;
    const auctionLogo = auctionAsset?.logo;

    const header = isStage2 ? "ROUND 2" : "ROUND 1";

    const bidLabel = isStage1
      ? this.$t("auction.current-bid")
      : "ROUND 1 " + this.$t("common.bid");

    let diffSeconds = dayjs(this.flip.tic).diff(dayjs(), "seconds");
    if (
      dayjs(this.flip.tic).unix() === 0 ||
      dayjs(this.flip.tic).isAfter(dayjs(this.flip.end))
    ) {
      diffSeconds = dayjs(this.flip.end).diff(dayjs(), "seconds");
    }
    let vaultCollateralValueText = `${vaultCollateralAmount} ${auctionSymbol}`;
    if (this.showFiat) {
      vaultCollateralValueText = toFiat(this, {
        n: +vaultCollateralAmount * +(networkAuctionAsset?.price_usd ?? 0),
      });
    }

    return {
      isDone,
      header,
      debtLogo,
      auctionLogo,
      debtSymbol,
      auctionSymbol,
      vaultDebtAmount,
      vaultCollateralAmount,
      vaultCollateralValueText,
      isStage1,
      isStage2,
      bidLabel,
      diffSeconds,
      isYourBid,
    };
  }

  changeCollateral() {
    this.showFiat = !this.showFiat;
  }
}
</script>

<style lang="scss" scoped>
.auction-detail-header {
  font-weight: 700;
  font-size: 20px;
  margin-top: 8px;

  .title {
    color: var(--v-greyscale_3-base);
    line-height: 20px;
    margin-bottom: 12px;
  }

  .value {
    display: inline-flex;
    flex-direction: row;
    color: var(--v-greyscale_1-base);
    line-height: 24px;
    margin-bottom: 12px;

    .round-icon {
      align-self: center;
      text-align: center;
      width: 20px;
      height: 20px;
      border-radius: 20px;
      line-height: 20px;
      margin-left: 6px;
      background-color: var(--v-greyscale_6-base);
    }
  }
}

.line {
  display: inline-flex;
  flex-direction: row;
  height: 3px;
  background: var(--v-greyscale_6-base);

  .active {
    background: #89df0f;
    flex: 0 0 50%;
    max-width: 50%;
  }

  .left {
    justify-content: flex-start;
  }

  .right {
    justify-content: flex-end;
  }
}

.auction-detail-card {
  font-weight: 500;
  background: #2e2e2e;
  color: #ccc;

  &.left {
    border-top-left-radius: 0px !important;
  }

  &.right {
    border-top-right-radius: 0px !important;
  }

  .active {
    color: #fff;
    font-weight: 600 !important;
    background: linear-gradient(
      180deg,
      rgba(143, 230, 19, 0.21) 0%,
      rgba(143, 230, 19, 0.0786085) 55.7%,
      rgba(143, 230, 19, 0) 100%
    );
  }
}

.action-detail-label {
  display: flex;
  align-items: center;
  font-weight: 600;
  font-size: 12px;
  line-height: 15px;
  margin-top: 16px;

  &.highlight {
    color: rgba(137, 223, 15, 1);
  }

  &.disabled {
    color: var(--v-greyscale_4-base);
  }

  .exchange-icon {
    margin-left: 3px;
    padding: 1px;
  }
}

.action-detail-value {
  font-weight: 600;
  font-size: 14px;
  line-height: 17px;
  margin-top: 8px;

  &.highlight {
    color: rgba(137, 223, 15, 1);
  }

  &.disabled {
    color: var(--v-greyscale_4-base);
  }
}
</style>
