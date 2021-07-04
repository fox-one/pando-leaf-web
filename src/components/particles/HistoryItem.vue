<template>
  <div>
    <template v-if="isOpen">
      <v-layout column>
        <v-layout align-center class="mt-4">
          <span class="f-body-2 font-weight-medium">{{
            $t("vault.event.action.vatgenerate")
          }}</span>
          <v-spacer />
          <span class="text-right f-caption f-greyscale-3">{{
            meta.time
          }}</span>
        </v-layout>
        <div style="margin-top: 10px" class="mb-4 f-caption f-greyscale-3">
          {{
            this.$t("vault.event.content.vatgenerate", {
              amount: this.history.debt.replace("-", ""),
              symbol: this.meta.debtSymbol,
            })
          }}
        </div>
      </v-layout>

      <v-divider />

      <v-layout column>
        <v-layout align-center class="mt-4">
          <span class="f-body-2 font-weight-medium">{{
            $t("vault.event.action.vatdeposit")
          }}</span>
          <v-spacer />
          <span class="text-right f-caption f-greyscale-3">{{
            meta.time
          }}</span>
        </v-layout>
        <div style="margin-top: 10px" class="mb-4 f-caption f-greyscale-3">
          {{
            this.$t("vault.event.content.vatdeposit", {
              amount: this.history.dink,
              symbol: this.meta.collateralSymbol,
            })
          }}
        </div>
      </v-layout>

      <v-divider />
    </template>
    <v-layout column>
      <v-layout align-center class="mt-4">
        <span class="f-body-2 font-weight-medium">{{ meta.actionText }}</span>
        <v-spacer />
        <span class="text-right f-caption f-greyscale-3">{{ meta.time }}</span>
      </v-layout>
      <div style="margin-top: 10px" class="mb-4 f-caption f-greyscale-3">
        {{ meta.actionContent }}
      </div>
    </v-layout>
  </div>
</template>

<script lang="ts" scoped>
import { Vue, Component, Prop } from "vue-property-decorator";
import { Getter } from "vuex-class";
import { ICollateral, IVault, IVaultEvent } from "~/services/types/vo";
import { VatAction } from "~/types";

@Component
export default class HistoryItem extends Vue {
  @Prop() history!: IVaultEvent;
  @Prop() collateral!: ICollateral;
  @Prop() vault!: IVault;
  @Getter("global/getAssetById") getAssetById;

  get isOpen() {
    return this.history.action === VatAction.VatOpen;
  }

  get meta() {
    const collateralAsset = this.getAssetById(this.collateral?.gem);
    const debtAsset = this.getAssetById(this.collateral?.dai);
    let actionContent;
    switch (this.history.action) {
      case VatAction.VatOpen:
        actionContent = this.$t("vault.event.content.vatopen", {
          id: this.vault.identity_id,
        });
        break;
      case VatAction.VatDeposit:
        actionContent = this.$t("vault.event.content.vatdeposit", {
          amount: this.history.dink.replace("-", ""),
          symbol: collateralAsset.symbol,
        });
        break;
      case VatAction.VatWithdraw:
        actionContent = this.$t("vault.event.content.vatwithdraw", {
          amount: this.history.dink.replace("-", ""),
          symbol: collateralAsset.symbol,
        });
        break;
      case VatAction.VatPayback:
        actionContent = this.$t("vault.event.content.vatpayback", {
          amount: this.history.debt.replace("-", ""),
          symbol: debtAsset.symbol,
        });
        break;
      case VatAction.VatGenerate:
        actionContent = this.$t("vault.event.content.vatgenerate", {
          amount: this.history.debt.replace("-", ""),
          symbol: debtAsset.symbol,
        });
        break;
      case VatAction.FlipKick:
        actionContent = this.$t("vault.event.content.flipkick", {
          collateral: `${this.history.dink.replace("-", "")} ${
            collateralAsset?.symbol
          }`,
          debt: `${this.history.debt.replace("-", "")} ${debtAsset?.symbol}`,
        });
        break;
      case VatAction.FlipBid:
        actionContent = this.$t("vault.event.content.flipbid", {
          amount: this.history.dink.replace("-", ""),
          symbol: collateralAsset?.symbol,
        });
        break;
      default:
        actionContent = "";
        break;
    }
    return {
      actionText: this.$t(
        `vault.event.action.${this.history.action.toLowerCase()}`
      ),
      actionContent,
      collateralLogo: collateralAsset?.logo,
      collateralSymbol: collateralAsset?.symbol,
      debtLogo: debtAsset?.logo,
      debtSymbol: debtAsset?.symbol,
      dink: this.history.dink,
      debt: this.history.debt,
      time: this.$utils.time.format(this.history.created_at),
    };
  }
}
</script>

<style lang="scss" scoped></style>
