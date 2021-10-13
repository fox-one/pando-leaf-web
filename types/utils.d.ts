declare namespace Utils {
  export interface NextPrice {
    price: number;
    time: number;
  }

  export enum RISK {
    HIGH = "high",
    MEDIUM = "medium",
    LOW = "low",
    NA = "n/a",
  }

  export interface VaultRiskLevelMeta {
    color: string;
    bg_color: string;
    value: RISK;
  }
}
