import pkg from "../package.json";
import PandoSeed from "@foxone/pandoseed";

export const VERSION = pkg.version;

export const isProduct = process.env.APP_ENV === "prod";

export const GA = "";

export const NODE_ENV = process.env.NODE_ENV;
export const APP_TOKEN = process.env.TOKEN;
export const APP_SCOPE = process.env.SCOPE;
export const APP_ID = process.env.ID;
export const APP_NAME = process.env.NAME;
export const APP_AVATAR = process.env.AVATAR;

export const MIXIN_HOST = "https://api.mixin.one";

export const CONFIG = isProduct
  ? {
      API_BASE: "https://leaf-api.pando.im/api/",
      WS_BASE: "wss://",
      MIXIN_CLIENT_ID: "75f18fe8-b056-46d6-9c48-0214425e58ce",
    }
  : {
      API_BASE: "https://pando-test-api.fox.one/api/",
      WS_BASE: "wss://uniswap-dev.fox.one/ws?raw=1",
      MIXIN_CLIENT_ID: "670e1faa-2975-48d9-a81f-cd0905ae847e",
    };

export const DEFAULT_ASSET_ID = "c94ac88f-4671-3976-b60a-09064f1811e8";

export const BTC_ASSET_ID = "c6d0c728-2624-429b-8e0d-d9d19b6592fa";

export const CNB_ASSET_ID = "965e5c6e-434c-3fa9-b780-c50f43cd955c";

export const ACTION_ASSET_ID = PandoSeed.PS_ASSET_ID;

export const EVENTS = {
  PAY_QR_CODE: "PAY_QR_CODE",
  OPEN_AUTH: "OPEN_AUTH",
  OPEN_RISK_WARN: "OPEN_RISK_WARN",
};
