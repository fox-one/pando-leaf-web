// Todo the base vault form.
import Vue from "vue";
import { Component, Mixins } from "vue-property-decorator";
import { Action, Getter, Mutation } from "vuex-class";
import { IAsset, ICollateral, IVault } from "~/services/types/vo";
import PageView, { Page } from "./page";

export interface Vault extends Page {
  vaultId: string;
  vault: IVault;
  collateral: ICollateral;
  collateralAsset: IAsset;
  debtAsset: IAsset;

  updateWalletAssets: () => void;
  updateVaultsAssets: () => void;
}

@Component
export default class VaultPage extends Mixins(PageView) {
  @Getter("global/getCollateral") getCollateral;
  @Getter("global/getAssetById") getAssetById;
  @Getter("global/getVault") getVault;
  @Action("global/syncMarkets") syncMarkets;

  beforeMount() {
    if (this.getCollateral === undefined || this.getCollateral === null) {
      this.syncMarkets();
    }
  }

  get vaultId() {
    return this.$route.query["id"];
  }

  get vault(): IVault {
    return this.getVault(this.vaultId);
  }

  get collateral(): ICollateral {
    return this.getCollateral(this.vault?.collateral_id);
  }

  get collateralAsset(): IAsset {
    return this.getAssetById(this.collateral?.gem);
  }

  get debtAsset(): IAsset {
    return this.getAssetById(this.collateral?.dai);
  }

  updateWalletAssets() {
    this.$utils.helper.loadWalletAssets(this);
  }

  updateVaultsAssets() {
    this.$utils.helper.loadWalletAsset(this, this.collateralAsset?.id);
    this.$utils.helper.loadWalletAsset(this, this.debtAsset?.id);
  }
}
