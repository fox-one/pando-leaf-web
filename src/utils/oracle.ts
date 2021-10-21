import dayjs from "dayjs";

export function getNextPairPrice(
  getters: Getter.GettersTree,
  opts: { base: string; quote: string }
) {
  const getOracleById: State.GetOracleById = getters["oracle/getOracleById"];

  const baseOracle = getOracleById(opts.base);
  const quoteOracle = getOracleById(opts.quote);

  if (!baseOracle || !quoteOracle) {
    return;
  }

  const basePeekTime = dayjs(baseOracle.peek_at).add(baseOracle.hop, "second");
  const quotePeekTime = dayjs(quoteOracle.peek_at).add(
    quoteOracle.hop,
    "second"
  );

  let time: dayjs.Dayjs | undefined;
  let price = Number(baseOracle.next) / Number(quoteOracle.next);

  if (baseOracle.threshold && quoteOracle.threshold) {
    if (basePeekTime.isBefore(quotePeekTime)) {
      time = basePeekTime;
      price = Number(baseOracle.next) / Number(quoteOracle.current);
    } else {
      time = quotePeekTime;
      price = Number(baseOracle.current) / Number(quoteOracle.next);
    }
  } else if (baseOracle.threshold) {
    time = basePeekTime;
  } else if (quoteOracle.threshold) {
    time = quotePeekTime;
  } else {
    time = dayjs().add(baseOracle.hop, "second");
  }

  return {
    price,
    time: time?.toString(),
  };
}

export function isValidOracle(next: Utils.NextPrice | undefined) {
  return next && next.price && dayjs(next.time).isAfter(Date.now());
}
