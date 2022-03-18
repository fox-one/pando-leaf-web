declare namespace State {
  export interface Auctions {
    ongoing: {
      flips: API.Flip[];
      loading: boolean;
      params: API.FlipParams;
      total: number;
    };
    done: {
      flips: API.Flip[];
      loading: boolean;
      params: API.FlipParams;
      total: number;
    };
    loading: boolean;
    limit: number;
    events: API.FlipEvent[];
  }

  export type GetFlipById = (id: string) => API.Flip | undefined;
}
