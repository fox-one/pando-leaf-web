export interface IMixinResponse<T> {
  data: T;
}

export interface BaseRes<T> {
  ts: number;
  data: T;
}

export interface IActionsParams {
  user_id: string;
  follow_id: string;
  asset_id: string;
  amount: string;
  parameters: string[];
}
