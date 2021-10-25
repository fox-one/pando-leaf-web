export function isValid(num: number): boolean {
  return (
    !isNaN(num) &&
    num !== undefined &&
    num !== null &&
    num !== Infinity &&
    num !== -Infinity
  );
}

export function toFiat(
  vm: Vue,
  opts: { n: number; short?: boolean; space?: boolean }
) {
  const symbol = vm.$store.state.app.fiat.symbol;
  const short = opts.short ?? false;
  const space = opts.space ? " " : "";

  if (short) {
    return `${symbol}${space}${vm.$utils.number.simplize({
      n: opts.n,
    })}`;
  }

  return `${symbol}${space}${vm.$utils.number.format({ n: opts.n, dp: 2 })}`;
}
