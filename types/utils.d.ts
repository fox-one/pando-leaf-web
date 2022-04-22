declare namespace Utils {
  export interface NextPrice {
    price?: number;
    time?: number | string;
  }

  export enum RISK {
    HIGH = "high",
    MEDIUM = "medium",
    LOW = "low",
    NA = "-",
  }

  export interface VaultRiskLevelMeta {
    color: string;
    bg_color: string;
    subtitle: string;
    value: RISK;
  }
}
