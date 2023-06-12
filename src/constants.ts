import pkg from "../package.json";

export const VERSION = pkg.version;

export const TERMS_VERSION = "0.0.1";

export const isProduct = process.env.APP_ENV === "prod";

export const GA = process.env.GA || "";

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
      API_BASE: "https://leaf-api.aspens.rocks/api/",
      WS_BASE: "wss://",
      MIXIN_CLIENT_ID: "670e1faa-2975-48d9-a81f-cd0905ae847e",
    };

export const PAGINATION_LIMIT = 8;

export const DEFAULT_ASSET_ID = "c94ac88f-4671-3976-b60a-09064f1811e8";

export const BTC_ASSET_ID = "c6d0c728-2624-429b-8e0d-d9d19b6592fa";

export const CNB_ASSET_ID = "965e5c6e-434c-3fa9-b780-c50f43cd955c";

// ETH
export const ACTION_ASSET_ID = "43d61dcd-e413-450d-80b8-101d5e903357";

export const ACTION_ASSET_AMOUNT = "0.00000001";

export const PANDO_DOC = "https://docs.pando.im/manual/mint.html";

export const EVENTS = {
  PAY_QR_CODE: "PAY_QR_CODE",
  OPEN_AUTH: "OPEN_AUTH",
  OPEN_RISK_WARN: "OPEN_RISK_WARN",
  OPEN_TERMS_MODAL: "OPEN_TERMS_MODAL",
};

export const LINKS = {
  // 创建金库后的首页 我的金库
  "home.vault": "https://docs.pando.im/manual/mint.html#vaults",
  // 金库详情 添加⾦库/还款⻚/铸币⻚/取回⻚/存入⻚ 市场页 抵押率
  "vault.liquidation-ratio":
    "https://docs.pando.im/manual/mint.html#leaf-liquidation-ratio",
  // 金库详情 添加⾦库/还款⻚/铸币⻚/取回⻚/存入⻚ 清算价格
  "vault.liquidation-price":
    "https://docs.pando.im/manual/mint.html#liquidation-price",
  // 金库详情 市场页 下一价格 ETH/pUSD价格
  "vault.price-oracles":
    "https://docs.pando.im/manual/essential.html#price-oracles",
  // 添加⾦库/还款⻚/铸币⻚/取回⻚/存入⻚ 抵押率
  "vault.liquidation":
    "https://docs.pando.im/manual/mint.html#leaf-liquidation",
  // 拍卖页 Debt you bid to pay for, Collateral you bid to receive
  "auction.auction-participation":
    "https://docs.pando.im/manual/mint.html#liquidation-penalty",
  //
};
