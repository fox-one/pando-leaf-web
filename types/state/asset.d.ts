declare namespace State {
  export interface Asset {
    walletAssets: API.MixinAsset[];
    assets: API.Asset[];
  }

  export type GetAssetById = (id: string) => API.Asset | undefined;
  export type GetWalletAssetById = (id: string) => API.MixinAsset | undefined;
}
