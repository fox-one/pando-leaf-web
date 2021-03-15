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
