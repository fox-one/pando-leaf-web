declare namespace State {
  export interface Vault {
    vaults: API.Vault[];
  }

  export type GetVaultById = (id: string) => API.Vault | undefined;
}
