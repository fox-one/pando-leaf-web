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

  export interface MarketFields {
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
    debtAsset: API.Asset | undefined;
    debtSymbol: string;
    debtPrice: string;
    isDone: boolean;
    isStage1: boolean;
    isStage2: boolean;
    minBid: string;
    maxBid: string;
    curPrice: string;
    debtFiatValue: number;
    collateralFiatValue: number;
  }

  export interface PredictionFields {
    collateralizationRatio: number;
    liquidationPrice: number;
    stabilityFee: number;
    maxToGenerate: number;
    maxAvailable: number;
  }

  export type GettersTree = {
    getVaultFields: (id: string) => VaultFields;
    getMarketFields: (id: string) => MarketFields;
    getFlipFields: (flip: API.Flip) => FlipFields;
    getPredictions: (
      deposit: number,
      mint: number,
      collateral: API.Collateral
    ) => PredictionFields;

    "asset/assetsMap": Record<string, API.Asset>;
    "asset/walletAssetsMap": Record<string, API.MixinAsset>;
    "asset/getAssetById": State.GetAssetById;
    "asset/getWalletAssetById": State.GetWalletAssetById;

    "collateral/getCollateralById": State.GetCollateralById;
    "collateral/getOverview": State.MarketOverview;

    "auctions/flipsDone": API.Flip[];
    "auctions/flipsAuctioning": API.Flip[];

    "auth/isLogged": boolean;
  };
}
