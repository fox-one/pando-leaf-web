import { ICollateral } from "~/services/types/vo";

export function maxAvailable(cat: ICollateral) {
  return Math.max(Number(cat.line) - Number(cat.art) * Number(cat.rate), 0);
}
