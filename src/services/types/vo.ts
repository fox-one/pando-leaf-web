/* eslint-disable camelcase */
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
