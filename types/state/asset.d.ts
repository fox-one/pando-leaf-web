declare namespace State {
  export interface Asset {
    walletAssets: Record<string, API.MixinAsset>;
    assets: API.Asset[];
  }

  export type GetAssetById = (id: string) => API.Asset | undefined;
}
