import utils, { mixin } from "@foxone/utils";
import * as app from "./app";
import * as account from "./account";
import * as asset from "./asset";
import * as collateral from "./collateral";
import * as currency from "./currency";
import * as time from "./time";
import * as helper from "./helper";
import * as payment from "./payment";
import * as vault from "./vault";
import * as oracle from "./oracle";
import * as number from "./number";
import icons from "./icons";

export default {
  account,
  app,
  asset,
  icons,
  collateral,
  payment,
  mixin,
  vault,
  oracle,
  currency,
  number: { ...utils.number, ...number },
  helper: { ...utils.helper, ...helper },
  time: { ...utils.time, ...time },
};
