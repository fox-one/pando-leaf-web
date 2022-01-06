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
  NA = "n/a",
}

export const RISK_LEVEL_META = {
  [RISK.NA]: {
    color: "greyscale_1",
    bg_color: "greyscale_6",
    value: RISK.NA,
  },
  [RISK.HIGH]: {
    color: "risk_high",
    bg_color: "risk_high_bg",
    value: RISK.HIGH,
  },
  [RISK.MEDIUM]: {
    color: "risk_mid",
    bg_color: "risk_mid_bg",
    value: RISK.MEDIUM,
  },
  [RISK.LOW]: {
    color: "risk_low",
    bg_color: "risk_low_bg",
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
  CREATE_TIME_ASC = "CREATE_TIME_ASC",
  CREATE_TIME_DESC = "CREATE_TIME_DESC",
  COLLATERAL_RATIO_ASC = "COLLATERAL_RATIO_ASC",
  COLLATERAL_RATIO_DESC = "COLLATERAL_RATIO_DESC",
}
