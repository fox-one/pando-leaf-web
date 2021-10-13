declare namespace Getter {
  export interface VaultFields {
    vault: API.Vault | undefined;
    collateral: API.Collateral | undefined;
    collateralAsset: API.Asset | undefined;
    debtAsset: API.Asset | undefined;
    collateralSymbol: string;
    debtSymbol: string;
    collateralAmount: number;
    debtAmount: number;
    collateralAmountUSD: number;
    debtAmountUSD: number;
    stabilityFee: number;
    ratio: number;
    riskLevelMeta: Utils.VaultRiskLevelMeta;
    liquidationPrice: number;
    liquidationPenalty: number;
    price: number;
    nextPrice: Utils.NextPrice | undefined;
    avaliableDebt: number;
    avaliableWithdraw: number;
  }

  export type GettersTree = {
    getVaultFields: (id: string) => VaultFields;
    "asset/assetsMap": Record<string, API.Asset>;
    "asset/walletAssetsMap": Record<string, API.MixinAsset>;
    "asset/getAssetById": (id: string) => API.Asset | undefined;
    "asset/getWalletAssetById": (id: string) => API.MixinAsset | undefined;

    "auth/isLogged": boolean;
  };
}
