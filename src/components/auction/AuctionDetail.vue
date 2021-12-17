<template>
  <v-layout column>
    <!-- timer -->
    <v-row no-gutters :class="meta.isStage2 ? 'justify-end' : ''">
      <div class="auction-detail-header">
        <div class="text">
          {{ meta.header }}
        </div>

        <count-down-timer :diff-seconds="meta.diffSeconds"></count-down-timer>
      </div>
    </v-row>

    <f-panel
      class="auction-detail-card pa-0"
      :class="meta.isStage1 ? 'left' : meta.isStage2 ? 'right' : ''"
    >
      <v-row no-gutters>
        <!-- left -->
        <v-col
          cols="6"
          class="pl-6 py-6 left"
          :class="meta.isStage1 ? 'active' : ''"
        >
          <f-mixin-asset-logo :size="32" :logo="meta.debtLogo" />

          <div class="action-detail-label mt-2">
            {{ $t("auction.vault-debt") }}
          </div>

          <div class="action-detail-value">
            {{ `${meta.vaultDebtAmount} ${meta.debtSymbol}` }}
          </div>

          <div
            class="action-detail-label"
            :class="meta.isYourBid && meta.isStage1 ? 'your-bid' : ''"
          >
            {{ meta.bidLabel }}
            {{ meta.isYourBid && meta.isStage1 ? "(You)" : "" }}
          </div>

          <div class="action-detail-value">
            {{ `${flip.bid} ${meta.debtSymbol}` }}
          </div>
        </v-col>

        <!-- right -->
        <v-col
          cols="6"
          class="pl-6 py-6 right"
          :class="meta.isStage2 ? 'active' : ''"
        >
          <f-mixin-asset-logo :size="32" :logo="meta.auctionLogo" />

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
    </f-panel>
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

    const walletAuctionAsset = getters["asset/getWalletAssetById"](
      auctionAsset?.id ?? ""
    );

    const debtLogo = debtAsset?.logo;
    const auctionLogo = auctionAsset?.logo;

    const header = isStage2 ? "ROUND 2" : "ROUND 1";

    const bidLabel = isStage1 ? this.$t("auction.current-bid") : "ROUND 1 Bid";

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
        n: +vaultCollateralAmount * +(walletAuctionAsset?.price_usd ?? 0),
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
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  flex: 0 0 50%;
  max-width: 50%;
  font-weight: 600;
  font-size: 12px;
  line-height: 15px;
  padding-left: 10px;
  padding-right: 10px;
  background: #8fe613;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;

  .text {
    padding-top: 10px;
    padding-bottom: 10px;
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
  font-size: 12px;
  margin-top: 24px;

  &.your-bid {
    color: rgba(143, 230, 19, 1);
  }

  .exchange-icon {
    margin-left: 3px;
    padding: 1px;
  }
}

.action-detail-value {
  font-size: 13px;
  line-height: 16px;
  margin-top: 8px;
}
</style>
