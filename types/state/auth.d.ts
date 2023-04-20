declare namespace State {
  export interface Auth {
    token: string;
    mixin_token: string;
    scope: string;
    channel: string;
  }
}
