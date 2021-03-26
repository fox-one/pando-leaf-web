import { ITransaction, IVaultEvent } from "./vo";

export interface IMixinResponse<T> {
  data: T;
}

export interface BaseRes<T> {
  ts: number;
  data: T;
}

export interface Pagination {
  next_cursor: string;
  has_next: boolean;
}

export interface PagedTransactions {
  pagination: Pagination;
  transactions: ITransaction[];
}

export interface PagedVaultEvents {
  pagination: Pagination;
  events: IVaultEvent[];
}

export interface IActionsParams {
  user_id: string;
  follow_id: string;
  asset_id: string;
  amount: string;
  parameters: string[];
}
