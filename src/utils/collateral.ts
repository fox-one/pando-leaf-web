import { RISK } from "@/enums";

export function maxAvailable(cat: API.Collateral) {
  return Math.max(Number(cat.line) - Number(cat.art) * Number(cat.rate), 0);
}

export function getRiskLevelMeta(current: number, min: number) {
  const meta = {
    [RISK.NA]: { color: "grey", value: RISK.NA },
    [RISK.HIGH]: { color: "red", value: RISK.HIGH },
    [RISK.MEDIUM]: { color: "orange", value: RISK.MEDIUM },
    [RISK.LOW]: { color: "green", value: RISK.LOW },
  };

  if (min <= 0 || current <= 0) return meta[RISK.NA];

  const risk = current / min;
  if (risk < 0) {
    return meta[RISK.NA];
  } else if (risk <= 1.25) {
    return meta[RISK.HIGH];
  } else if (risk <= 5 / 3) {
    return meta[RISK.MEDIUM];
  } else {
    return meta[RISK.LOW];
  }
}
