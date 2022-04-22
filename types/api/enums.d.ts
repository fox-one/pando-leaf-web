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
    NA = "-",
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
}
