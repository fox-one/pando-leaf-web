import dayjs from "dayjs";

export function oracleNext(gem: API.Oracle, dai: API.Oracle) {
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

export function getWeekStart() {
  return dayjs().subtract(1, "week").unix();
}

export function getMonthStart() {
  return dayjs().subtract(1, "month").unix();
}

export function getYearStart() {
  return dayjs().subtract(365, "days").unix();
}

export function getToday() {
  return dayjs().unix();
}
