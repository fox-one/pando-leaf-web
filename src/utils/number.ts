import BigNumber from "bignumber.js";

export default {
  isValid(num: number): boolean {
    return (
      !isNaN(num) &&
      num !== undefined &&
      num !== null &&
      num !== Infinity &&
      num !== -Infinity
    );
  },
  getPrecision(n) {
    return new BigNumber(n).dp();
  },
  getDefaultPercision(n) {
    const bn = new BigNumber(n);
    return bn.gt(1e4) ? 2 : bn.gt(1) ? 4 : 8;
  },
  addSymbol(n) {
    return n >= 0 ? `+${n}` : n;
  },
  toFixed(n: string | number, p: number) {
    if (n === undefined || n === null) {
      return "";
    }
    return parseFloat("" + n).toFixed(p);
  },
  toPrecision(
    n: string | number | undefined,
    p: number | undefined = undefined,
    roundMode: BigNumber.RoundingMode = BigNumber.ROUND_DOWN
  ): any {
    if (n === undefined) {
      return "";
    }
    if (p === undefined) {
      p = this.getDefaultPercision(n);
    }
    const dp = new BigNumber(n).dp();
    if (dp > p) {
      const v = new BigNumber(n).decimalPlaces(p, roundMode);
      return v.toFixed(p);
    } else {
      if (typeof n === "number") {
        return (n as number).toFixed(dp);
      } else {
        return n;
      }
    }
  },
  toPercent(v: string | number, symbol = false, percision = 2) {
    v = Number(v);
    if (isNaN(v)) {
      return "-";
    }
    const s = symbol && v >= 0 ? "+" : "";
    if (percision >= 0) {
      return s + (Number(v) * 100).toFixed(percision) + "%";
    }
    const n = new BigNumber(v);
    return n.multipliedBy(100) + "%";
  },
  toShort(v: string | number): string {
    v = Number(v);
    if (isNaN(v)) {
      return "-";
    }
    if (v === 0) return "0.00";
    if (v < 1) {
      return this.toPrecision(v);
    } else if (v < 1000) {
      return `${v.toPrecision(this.getDefaultPercision(v))}`;
    } else if (v >= 1000 && v < 1000000) {
      // kilo
      v = v / 1000;
      return `${v.toFixed(2)}k`;
    } else if (v >= 1000000 && v < 1000000000) {
      // mega
      v = v / 1000000;
      return `${v.toFixed(2)}m`;
    } else if (v >= 1000000000 && v < 1000000000000) {
      // giga
      v = v / 1000000000;
      return `${v.toFixed(2)}g`;
    } else {
      // tera
      v = v / 1000000000000;
      return `${v.toFixed(2)}t`;
    }
  },
};
