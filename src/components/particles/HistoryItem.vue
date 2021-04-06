<template>
  <div>
    <template v-if="isOpen">
      <v-layout column class="py-3">
        <v-layout align-center class="f-body-1">
          <span>{{ $t("vault.event.action.vatgenerate") }}</span>
          <v-spacer />
          <span class="text-right f-caption">{{ meta.time }}</span>
        </v-layout>
        <div>
          {{
            `Generated ${this.history.debt.replace("-", "")} new ${
              this.meta.debtSymbol
            } from Vault`
          }}
        </div>
      </v-layout>

      <v-divider />

      <v-layout column class="py-3">
        <v-layout align-center class="f-body-1">
          <span>{{ $t("vault.event.action.vatdeposit") }}</span>
          <v-spacer />
          <span class="text-right f-caption">{{ meta.time }}</span>
        </v-layout>
        <div>
          {{
            `Deposited ${this.history.dink} ${this.meta.collateralSymbol} into Vault`
          }}
        </div>
      </v-layout>

      <v-divider />
    </template>
    <v-layout column class="py-3">
      <v-layout align-center class="f-body-1">
        <span>{{ meta.actionText }}</span>
        <v-spacer />
        <span class="text-right f-caption">{{ meta.time }}</span>
      </v-layout>
      <div>{{ meta.actionContent }}</div>
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
    let actionContent = "";
    switch (this.history.action) {
      case VatAction.VatOpen:
        actionContent = `Opened a new Vault with id ${this.vault.identity_id}`;
        break;
      case VatAction.VatDeposit:
        actionContent = `Deposited ${this.history.dink.replace("-", "")} ${
          collateralAsset.symbol
        } into Vault`;
        break;
      case VatAction.VatWithdraw:
        actionContent = `Withdrew ${this.history.dink.replace("-", "")} ${
          collateralAsset.symbol
        } from Vault`;
        break;
      case VatAction.VatPayback:
        actionContent = `Payback ${this.history.debt.replace("-", "")} ${
          debtAsset.symbol
        } into Vault`;
        break;
      case VatAction.VatGenerate:
        actionContent = `Generated ${this.history.debt.replace("-", "")} new ${
          debtAsset.symbol
        } from Vault`;
        break;
      default:
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
