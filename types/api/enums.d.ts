declare namespace API {
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

  export enum VatAction {
    VatOpen = "VatOpen", // 创建金库
    VatDeposit = "VatDeposit", // 充值
    VatWithdraw = "VatWithdraw", // 提取
    VatPayback = "VatPayback", // 还款
    VatGenerate = "VatGenerate", // 铸币
    FlipKick = "FlipKick",
    FlipBid = "FlipBid",
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
}
