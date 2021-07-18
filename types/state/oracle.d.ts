declare namespace State {
  export interface Oracle {
    oracles: API.Oracle[];
  }

  export type GetOracleById = (id: string) => API.Oracle | undefined;
}
