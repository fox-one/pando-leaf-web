import { RISK, RISK_LEVEL_META } from "@/enums";

export function maxAvailable(cat: API.Collateral | null) {
  return Math.max(Number(cat?.line) - Number(cat?.art) * Number(cat?.rate), 0);
}

export function getRiskLevelMeta(current: number, min: number) {
  if (min <= 0 || current <= 0) return RISK_LEVEL_META[RISK.NA];
  const risk = current / min;
  if (risk < 0) {
    return RISK_LEVEL_META[RISK.NA];
  } else if (risk <= 1.25) {
    return RISK_LEVEL_META[RISK.HIGH];
  } else if (risk <= 5 / 3) {
    return RISK_LEVEL_META[RISK.MEDIUM];
  } else {
    return RISK_LEVEL_META[RISK.LOW];
  }
}
