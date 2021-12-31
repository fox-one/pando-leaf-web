declare namespace State {
  export interface Asset {
    walletAssets: API.MixinAsset[];
    assets: API.Asset[];
    networkAssets: API.MixinAsset[];
  }

  export type GetAssetById = (id: string) => API.Asset | undefined;
  export type GetWalletAssetById = (id: string) => API.MixinAsset | undefined;
  export type GetNetworkAssetById = (id: string) => API.MixinAsset | undefined;
}
