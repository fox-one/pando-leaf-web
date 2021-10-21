import * as auction from "./auction";
import * as market from "./market";
import * as vault from "./vault";

export default {
  ...vault,
  ...market,
  ...auction,
};
