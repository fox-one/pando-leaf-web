declare namespace State {
  export interface Collateral {
    collaterals: API.Collateral[];
    fiats: API.Fiat[];
  }

  export interface MarketOverview {
    supply: string | number;
    collaterals: string | number;
    collaterilazation: string | number;
  }

  export type GetCollateralById = (id: string) => API.Collateral | undefined;
}
