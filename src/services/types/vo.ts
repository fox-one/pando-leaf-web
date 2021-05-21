/* eslint-disable camelcase */
import { FlipAction, TransactionStatus, VatAction } from "~/types/enum";

export interface AuthResult {
  avatar: string;
  id: string; // uuid
  name: string;
  scope: string;
  token: string;
}

export interface IAsset {
  chain_id: string;
  id: string;
  logo: string;
  name: string;
  price: string;
  symbol: string;
}

export interface IMixinAsset {
  asset_id: string;
  asset_key: string;
  balance: string;
  capitalization: number;
  chain_id: string;
  change_btc: string;
  change_usd: string;
  confirmations: number;
  destination: string;
  icon_url: string;
  mixin_id: string;
  name: string;
  price_btc: string;
  price_usd: string;
  reserve: string;
  symbol: string;
  tag: string;
  type: string;
}

export interface IChartData {
  v: number;
  ts: number;
}

export interface ICollateral {
  id: string;
  created_at: string;
  name: string;
  gem: string; // Collateral Asset ID  uuid
  dai: string; // Debt Asset ID  uuid
  ink: string; // Total Deposited
  art: string; // Total Normalised Debt
  rate: string; // Accumulated Rates
  rho: string; // Rate Update Date
  debt: string; // Total Debt
  line: string; // Max Debt
  dust: string; // Minimum Debt Per Vault
  price: string; // Current Price
  duty: string; // Stability Fee
  mat: string; // Liquidation Rate
  chop: string; // Liquidation Fee
  dunk: string; // Max Liquidation Debt
  live: boolean; // Collateral State

  beg: "0.03"; // 出价的最小涨幅 / 数量的最少降幅, 百分比()
  box: "500000"; // 拍卖资产总上线
  litter: "0"; // 当前正在拍卖的资产量
  number_of_vaults: "169"; // 当前的这个类型的金库总数
  tau: number; // 拍卖总时长 单位 s
  ttl: number; // 单次竞价时长，每次叫价后重置为ttl 单位 s
}

export interface IVault {
  id: string;
  created_at: string;
  collateral_id: string; // uuid
  ink: string; // Total Deposited
  art: string; // Total Normalised Debt, debt = art * rate
  identity_id: string;
}

export interface ITransaction {
  action: number;
  amount: string;
  asset_id: string;
  collateral_id: string;
  created_at: string;
  data: string;
  id: string;
  status: TransactionStatus;
  vault_id: string;
}

export interface IVaultEvent {
  action: VatAction;
  created_at: string;
  dart: string;
  debt: string;
  dink: string;
  vault_id: string;
}

export interface IFlip {
  // art: string; // art * rate = tab, 先不管这个.jpg
  bid: string; // 当前的偿还债务的出价
  created_at: string; // 创建时间
  end: string; // 拍卖最迟结束时间
  lot: string; // 对于竞标拍卖物数量的出价
  tab: string; // 包含清算罚金的总债
  tic: string; // 本轮竞价结束时间
  action: FlipAction;
  guy: string;
  id: string;
  vault_id: string;
  collateral_id: string;
}

export interface IOracle {
  asset_id: string;
  current: string;
  governors: string[];
  hop: number;
  next: string;
  peek_at: string;
  threshold: number;
}
