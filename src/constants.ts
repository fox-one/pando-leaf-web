export const isProduct = process.env.APP_ENV === "prod";

export const GA = "";

export const NODE_ENV = process.env.NODE_ENV;

export const APP_TOKEN = process.env.TOKEN;

export const APP_SCOPE = process.env.SCOPE;

export const MIXIN_HOST = "https://mixin-api.zeromesh.net/";

export const CONFIG = isProduct
  ? {
      API_BASE: "https://pando-test-api.fox.one/api/",
      WS_BASE: "wss://",
      MIXIN_CLIENT_ID: "670e1faa-2975-48d9-a81f-cd0905ae847e",
    }
  : {
      API_BASE: "https://pando-test-api.fox.one/api/",
      WS_BASE: "wss://uniswap-dev.fox.one/ws?raw=1",
      MIXIN_CLIENT_ID: "670e1faa-2975-48d9-a81f-cd0905ae847e",
    };

export const DEFAULT_ASSET_ID = "c94ac88f-4671-3976-b60a-09064f1811e8";

export const BTC_ASSET_ID = "c6d0c728-2624-429b-8e0d-d9d19b6592fa";

export const CNB_ASSET_ID = "965e5c6e-434c-3fa9-b780-c50f43cd955c";

export const ACTION_ASSET_ID = CNB_ASSET_ID;
