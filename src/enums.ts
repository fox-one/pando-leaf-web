export enum SCOPE {
  PROFILE_READ = "PROFILE:READ",
  ASSETS_READ = "ASSETS:READ",
  SNAPSHOTS_READ = "SNAPSHOTS:READ",
}

export enum SOCKET_STATE {
  CONNECTED = "connected",
  CONNECTING = "connecting",
  ERROR = "error",
  CLOSED = "closed",
}

export enum TransactionStatus {
  OK = "OK",
  Abort = "Abort",
}

export enum RISK {
  HIGH = "high",
  MEDIUM = "medium",
  LOW = "low",
  NA = "-",
}

export const RISK_LEVEL_META: Record<RISK, Utils.VaultRiskLevelMeta> = {
  [RISK.NA]: {
    color: "greyscale_1",
    bg_color: "greyscale_6",
    subtitle: "greyscale_3",
    value: RISK.NA,
  },
  [RISK.HIGH]: {
    color: "risk_high",
    bg_color: "risk_high_bg",
    subtitle: "risk_high_subtitle",
    value: RISK.HIGH,
  },
  [RISK.MEDIUM]: {
    color: "risk_mid",
    bg_color: "risk_mid_bg",
    subtitle: "risk_mid_subtitle",
    value: RISK.MEDIUM,
  },
  [RISK.LOW]: {
    color: "risk_low",
    bg_color: "risk_low_bg",
    subtitle: "risk_low_subtitle",
    value: RISK.LOW,
  },
};

export enum VatAction {
  VatOpen = "VatOpen", // 创建金库
  VatDeposit = "VatDeposit", // 充值
  VatWithdraw = "VatWithdraw", // 提取
  VatPayback = "VatPayback", // 还款
  VatGenerate = "VatGenerate", // 铸币
  FlipKick = "FlipKick", // 系统清算金库
  FlipBid = "FlipBid", // 清算余额返还
}

export enum FlipAction {
  FlipDeal = "FlipDeal",
  FlipBid = "FlipBid",
  FlipKick = "FlipKick",
}

export enum FlipRequestAction {
  FlipKick = "41",
  FlipBid = "42",
  FlipDeal = "43",
}

export enum SortBy {
  COLLATERAL_RATIO_ASC = "COLLATERAL_RATIO_ASC",
  COLLATERAL_RATIO_DESC = "COLLATERAL_RATIO_DESC",
  COLLATERAL_VALUE_ASC = "COLLATERAL_VALUE_ASC",
  COLLATERAL_VALUE_DESC = "COLLATERAL_VALUE_DESC",
}

export enum FlipPhase {
  tend = "tend", // 第一阶段 first stage
  dent = "dent", // 第二阶段 second stage
  bid = "bid", // 第一 + 第二阶段, the ongoing auctions
  deal = "deal", // 已结束 ended auctions
}

export enum FlipTag {
  MyVault = "MyVault", // 是我的金库 is my vault
  Participated = "Participated", // 曾出价过 participated in auction
  Leading = "Leading", // 自己是最高出价 leading auction‘s highest bid
}

type Meta<T extends string> = Record<
  T,
  {
    text: string;
  }
>;

const DurationMeta: Meta<API.Duration> = {
  week: { text: "chart.duration.w" },
  month: { text: "chart.duration.m" },
  year: { text: "chart.duration.y" },
};

export const DurationHour: Record<API.Duration, string> = {
  week: "168h",
  month: "720h",
  year: "8760h",
};

export function getDurationMeta(t: API.Duration) {
  return DurationMeta[t];
}

export enum AuthMethod {
  MixinToken = "mixin_token",
  MVM = "mvm",
}
