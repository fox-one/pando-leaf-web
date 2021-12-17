<template>
  <v-layout column>
    <div class="text-3 greyscale_1--text mb-4">
      {{ $t("auction.done-title") }}
    </div>

    <f-panel class="greyscale_6 py-6 pl-0">
      <v-row no-gutters>
        <!-- left -->
        <v-col cols="6" class="pl-6">
          <f-mixin-asset-logo :size="32" :logo="meta.debtLogo" />

          <div class="action-detail-label greyscale_1--text">
            {{ $t("auction.vault-debt") }}
          </div>

          <div class="action-detail-value">
            {{ `${meta.vaultDebtAmount} ${meta.debtSymbol}` }}
          </div>

          <div class="action-detail-label">
            {{ $t("auction.final-debt-bid") }}
          </div>

          <div class="action-detail-value font-weight-medium">
            {{ `${flip.bid} ${meta.debtSymbol}` }}
          </div>
        </v-col>

        <!-- right -->
        <v-col cols="6" class="pl-4">
          <f-mixin-asset-logo :size="32" :logo="meta.auctionLogo" />

          <div class="action-detail-label greyscale_1--text">
            {{ $t("auction.vault-collateral") }}
            <v-icon
              size="12"
              color="greyscale_1"
              class="greyscale_5 rounded-circle exchange-icon"
              @click="showFiat = !showFiat"
            >
              $FIconExchange4PBold
            </v-icon>
          </div>

          <div class="action-detail-value">
            {{ meta.vaultCollateralValueText }}
          </div>

          <div class="action-detail-label">
            {{ $t("auction.final-collateral-bid") }}
          </div>

          <div class="action-detail-value font-weight-medium">
            {{ `${flip.lot} ${meta.auctionSymbol}` }}
          </div>
        </v-col>
      </v-row>
    </f-panel>
  </v-layout>
</template>

<script lang="ts" scoped>
import { Vue, Component, Prop } from "vue-property-decorator";

@Component
export default class AuctionDoneDetail extends Vue {
  @Prop() flip!: API.Flip;

  showFiat = false;

  get meta() {
    const { toFiat } = this.$utils.number;
    const getters = this.$store.getters as Getter.GettersTree;
    const {
      debtSymbol,
      debtAsset,
      auctionAsset,
      auctionSymbol,
      vaultCollateralAmount,
      vaultDebtAmount,
    } = getters.getFlipFields(this.flip);

    const debtLogo = debtAsset?.logo;
    const auctionLogo = auctionAsset?.logo;

    const walletAuctionAsset = getters["asset/getWalletAssetById"](
      auctionAsset?.id ?? ""
    );

    let vaultCollateralValueText = `${vaultCollateralAmount} ${auctionSymbol}`;
    if (this.showFiat) {
      vaultCollateralValueText = toFiat(this, {
        n: +vaultCollateralAmount * +(walletAuctionAsset?.price_usd ?? 0),
      });
    }
    return {
      debtSymbol,
      debtLogo,
      auctionSymbol,
      auctionLogo,
      vaultCollateralAmount,
      vaultDebtAmount,
      vaultCollateralValueText,
    };
  }
}
</script>

<style lang="scss" scoped>
.action-detail-label {
  display: flex;
  align-items: center;
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  color: var(--v-greyscale_3-base);
  margin-top: 24px;
  &.greyscale_1--text {
    font-weight: 600;
    margin-top: 8px;
  }
}
.exchange-icon {
  margin-left: 3px;
  padding: 1px;
}
.action-detail-value {
  font-style: normal;
  font-weight: 600;
  font-size: 13px;
  line-height: 16px;
  color: var(--v-greyscale_1-base);
  margin-top: 8px;
}
</style>
