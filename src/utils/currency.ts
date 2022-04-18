import * as currency from "@foxone/utils/currency";
import BigNumber from "bignumber.js";

export const CURRENCY = {
  CNY: { name: "CNY", symbol: "¥" },
  USD: { name: "USD", symbol: "$" },
  JPY: { name: "JPY", symbol: "¥" },
  EUR: { name: "EUR", symbol: "€" },
  KRW: { name: "KRW", symbol: "₩" },
  HKD: { name: "HKD", symbol: "HK$" },
  GBP: { name: "GBP", symbol: "£" },
  AUD: { name: "AUD", symbol: "A$" },
  SGD: { name: "SGD", symbol: "S$" },
  MYR: { name: "MYR", symbol: "RM" },
  PHP: { name: "PHP", symbol: "₱" },
  AED: { name: "AED", symbol: "AED" },
};

export function toFiat(
  vm: Vue,
  opts: { n: BigNumber.Value; short?: boolean; intl?: boolean; from?: string },
  part = false
) {
  const to = vm.$store.state.app.settings.currency;
  const rates = vm.$store.state.collateral.fiats;
  const locale = vm.$store.$i18n.locale;
  const configs = opts.short
    ? {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
      }
    : {};
  const intl = opts.intl ?? true;

  return currency.toFiat(
    { n: opts.n, configs, from: opts.from, to, rates, locale, intl },
    part
  );
}
