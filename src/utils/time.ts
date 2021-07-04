import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/zh";
import { IOracle } from "~/services/types/vo";
import number from "./number";

dayjs.extend(relativeTime);

export function toRelative(t) {
  return dayjs().to(t);
}

export function format(t, p = "YYYY-MM-DD HH:mm:ss") {
  return dayjs(t).format(p);
}

export function oracleNext(gem: IOracle, dai: IOracle) {
  if (!gem || !dai) return { peek_at: dayjs(0) };
  const gemPeekTime = dayjs(gem.peek_at).add(gem.hop, "seconds");
  const daiPeekTime = dayjs(dai.peek_at).add(dai.hop, "seconds");
  if (gem.threshold === 0 && dai.threshold === 0) {
    return {
      peek_at: dayjs(0),
      price: Number(gem.current) / Number(dai.current),
    };
  }
  if (gem.threshold === 0) {
    return {
      peek_at: daiPeekTime,
      price: Number(gem.current) / Number(dai.next),
    };
  }
  if (dai.threshold === 0) {
    return {
      peek_at: gemPeekTime,
      price: Number(gem.next) / Number(dai.current),
    };
  }
  if (gemPeekTime.isBefore(daiPeekTime)) {
    return {
      peek_at: gemPeekTime,
      price: Number(gem.next) / Number(dai.current),
    };
  } else {
    return {
      peek_at: daiPeekTime,
      price: Number(gem.next) / Number(gem.next),
    };
  }
}
