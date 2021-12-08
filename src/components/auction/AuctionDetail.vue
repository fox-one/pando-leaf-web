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

          <div class="action-detail-label semibold">Vault Debt</div>

          <div class="action-detail-value">
            {{ `${meta.vaultDebtAmount} ${meta.debtSymbol}` }}
          </div>

          <div class="action-detail-label">{{ meta.bidLabel }}</div>

          <div class="action-detail-value font-weight-medium">
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

          <div class="action-detail-label semibold">Vault Collateral</div>

          <div class="action-detail-value">
            {{ `${meta.vaultCollateralAmount} ${meta.auctionSymbol}` }}
          </div>

          <div class="action-detail-label" v-if="isStage2">Current Bid</div>

          <div class="action-detail-value font-weight-medium" v-if="isStage2">
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

  get meta() {
    const getters = this.$store.getters as Getter.GettersTree;
    const {
      isDone,
      isStage1,
      isStage2,
      debtFiatValue,
      collateralValue,
      auctionSymbol,
      debtSymbol,
      debtAsset,
      auctionAsset,
      curPrice,
      collateralFiatValue,
      vaultDebtAmount,
      vaultCollateralAmount,
    } = getters.getFlipFields(this.flip);

    const debtLogo = debtAsset?.logo;
    const auctionLogo = auctionAsset?.logo;

    const collateralAmountText = isStage2
      ? `${this.flip.tab} ${debtSymbol}`
      : `${this.flip.lot} ${auctionSymbol}`;

    const collateralValueText = isStage2
      ? `$${debtFiatValue}`
      : `${collateralValue} ${debtSymbol}`;

    const collateralFiatValueText = this.$utils.number.format({
      n: collateralFiatValue,
    });

    const header = isStage2 ? "ROUND 2" : "ROUND 1";

    const bidLabel = isStage1 ? "Current Bid" : "ROUND 1 Bid";

    let diffSeconds = dayjs(this.flip.tic).diff(dayjs(), "seconds");
    if (
      dayjs(this.flip.tic).unix() === 0 ||
      dayjs(this.flip.tic).isAfter(dayjs(this.flip.end))
    ) {
      diffSeconds = dayjs(this.flip.end).diff(dayjs(), "seconds");
    }

    return {
      isDone,
      header,
      debtLogo,
      auctionLogo,
      debtSymbol,
      auctionSymbol,
      collateralAmountText,
      collateralValueText,
      collateralFiatValue,
      collateralFiatValueText,
      vaultDebtAmount,
      vaultCollateralAmount,
      curPrice,
      isStage1: true,
      isStage2,
      bidLabel,
      diffSeconds: 1500,
    };
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
    background: linear-gradient(
      180deg,
      rgba(143, 230, 19, 0.21) 0%,
      rgba(143, 230, 19, 0.0786085) 55.7%,
      rgba(143, 230, 19, 0) 100%
    );
  }
}

.action-detail-label {
  font-weight: 500;
  font-size: 12px;
  line-height: 15px;
  margin-top: 24px;
  &.semibold {
    font-weight: 600;
    margin-top: 8px;
  }
}

.action-detail-value {
  font-weight: 600;
  font-size: 13px;
  line-height: 16px;
  margin-top: 8px;
}
</style>
