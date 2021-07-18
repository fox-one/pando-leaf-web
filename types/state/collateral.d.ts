declare namespace State {
  export interface Collateral {
    collaterals: API.Collateral[];
  }

  export type GetCollateralById = (id: string) => API.Collateral | undefined;
}
