export interface IMixinResponse<T> {
  data: T;
}

export interface BaseRes<T> {
  ts: number;
  data: T;
}
