declare namespace API {
  export interface Fiat {
    code: string;
    rate: number;
  }

  export interface ChartData {
    v: number;
    ts: number;
  }

  export type Duration = "week" | "month" | "year";

  export type ChartType = "supply" | "collaterals";

  export interface StatsPayload {
    from: number; // timestamp
    to: number; // timestamp
  }

  export interface StatsResponse {
    date: string; // eg: "2021-03-09T00:00:00Z"
    timestamp: string; // eg: "1615248000"
    gem_value: string; // 抵押金额（美元）eg:  "0.57807"
    dai_value: string; // 借贷金额 （美元） eg: "0.0000112"
  }
}
