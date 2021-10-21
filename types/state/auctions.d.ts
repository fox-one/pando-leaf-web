declare namespace State {
  export interface Auctions {
    flips: API.Flip[];
    loading: boolean;
    limit: number;
    cursor: string | null;
    hasNext: boolean;
  }

  export type GetFlipById = (id: string) => API.Flip | undefined;
}
