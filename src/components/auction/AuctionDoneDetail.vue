<template>
  <v-layout column>
    <div class="text-3 greyscale_1--text mb-4">
      {{ $t("auction.highest-call") }}
    </div>

    <f-panel class="greyscale_6 py-6 pl-0">
      <v-row no-gutters>
        <!-- left -->
        <v-col cols="6" class="pl-6">
          <f-mixin-asset-logo :size="32" :logo="meta.debtLogo" />

          <div class="action-detail-label greyscale_1--text">Vault Debt</div>

          <div class="action-detail-value">
            {{ `${meta.vaultDebtAmount} ${meta.debtSymbol}` }}
          </div>

          <div class="action-detail-label">Final Debt Bid</div>

          <div class="action-detail-value font-weight-medium">
            {{ `${flip.bid} ${meta.debtSymbol}` }}
          </div>
        </v-col>

        <!-- right -->
        <v-col cols="6" class="pl-4">
          <f-mixin-asset-logo :size="32" :logo="meta.auctionLogo" />

          <div class="action-detail-label greyscale_1--text">
            Vault Collateral
          </div>

          <div class="action-detail-value">
            {{ `${meta.vaultCollateralAmount} ${meta.auctionSymbol}` }}
          </div>

          <div class="action-detail-label">Final Collateral Bid</div>

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

  get meta() {
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

    return {
      debtSymbol,
      debtLogo,
      auctionSymbol,
      auctionLogo,
      vaultCollateralAmount,
      vaultDebtAmount,
    };
  }
}
</script>

<style lang="scss" scoped>
.action-detail-label {
  font-style: normal;
  font-weight: 500;
  font-size: 12px;
  line-height: 15px;
  color: var(--v-greyscale_3-base);
  margin-top: 24px;
  &.greyscale_1--text {
    font-weight: 600;
    margin-top: 8px;
  }
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
