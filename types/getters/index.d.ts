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
    stabilityFeeText: string;
    ratio: number;
    ratioText: string;
    riskLevelMeta: Utils.VaultRiskLevelMeta;
    liquidationRatio: number;
    liquidationPrice: number;
    liquidationPriceText: string;
    liquidationPenalty: number;
    price: number;
    nextPrice: Utils.NextPrice | undefined;
    avaliableDebt: number;
    avaliableWithdraw: number;
  }

  export interface MarketFields {
    minimumRatio: number;
    minimumRatioText: string;
    collateralPrice: number;
    collateral: API.Collateral | undefined;
    collateralAsset: API.Asset | undefined;
    debtAsset: API.Asset | undefined;
    collateralSymbol: string;
    debtSymbol: string;
    collateralAmount: number;
    debtAmount: number;
    collateralAssetPrice: number;
    debtAssetPrice: number;
    collateralFiat: number;
    maxAvailable: number;
    stabilityFee: number;
    liquidationPenalty: number;
    nextPrice: Utils.NextPrice | undefined;
  }

  export interface FlipFields {
    flip: API.Flip;
    collateral: API.Collateral | undefined;
    auctionAsset: API.Asset | undefined;
    auctionSymbol: string;
    collateralPrice: string;
    collateralValue: string;
    collateral2debt: string;
    debtAsset: API.Asset | undefined;
    debtSymbol: string;
    debtPrice: string;
    isDone: boolean;
    isStage1: boolean;
    isStage2: boolean;
    leading: boolean;
    participated: boolean;
    isMyVault: boolean;
    minBid: string;
    maxBid: string;
    curPrice: string;
    debtFiatValue: number;
    collateralFiatValue: number;
    vaultCollateralAmount: string;
    vaultDebtAmount: string;
  }

  export interface PredictionFields {
    collateralizationRatio: number;
    collateralizationRatioText: string;
    liquidationPrice: number;
    liquidationPriceText: string;
    stabilityFee: number;
    stabilityFeeText: string;
    maxToGenerate: number;
    maxToGenerateText: string;
    maxAvailable: number;
    maxAvailableText: string;
  }

  export type GettersTree = {
    getVaultFields: (id: string) => VaultFields;
    getMarketFields: (id: string) => MarketFields;
    getFlipFields: (flip: API.Flip) => FlipFields;
    openVaultPrediction: (
      deposit: number,
      mint: number,
      collateral: API.Collateral | null
    ) => PredictionFields;

    "asset/walletBlance": number;
    "asset/assetsMap": Record<string, API.Asset>;
    "asset/walletAssetsMap": Record<string, API.MixinAsset>;
    "asset/networkAssetsMap": Record<string, API.MixinAsset>;
    "asset/getAssetById": State.GetAssetById;
    "asset/getWalletAssetById": State.GetWalletAssetById;
    "asset/getNetworkAssetById": State.GetNetworkAssetById;

    "vault/haveVault": boolean;
    "vault/vaultsEmpty": boolean;

    "collateral/getCollateralById": State.GetCollateralById;
    "collateral/getOverview": State.MarketOverview;

    "auctions/flipsDone": API.Flip[];
    "auctions/flipsAuctioning": API.Flip[];
    "auctions/flipKickEvent": API.FlipEvent | undefined;
    "auctions/yourLastDebtBidEvent": (
      flip: API.Flip
    ) => API.FlipEvent | undefined;
    "auctions/yourLastCollateralBidEvent": (
      flip: API.Flip
    ) => API.FlipEvent | undefined;

    "auth/isLogged": boolean;
    "auth/canReadAsset": boolean;

    "account/userId": string;
  };
}
