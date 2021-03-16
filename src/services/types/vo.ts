/* eslint-disable camelcase */
import { TransactionStatus } from "~/types/enum";

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
