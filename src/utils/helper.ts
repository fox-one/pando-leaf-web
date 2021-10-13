import Vue from "vue";
import { TransactionStatus } from "@/enums";

export function toast(vm: Vue, data: { message: string; color?: string }) {
  vm.$store.commit("app/SET_TOAST", { ...data, show: true });
}

export function errorHandler(
  vm: Vue,
  error: {
    status?: number;
    message?: string;
    msg?: string;
    code: string | number;
  }
) {
  const fallback = "未知错误";
  const errorcode = error.code !== -1 ? error.code : error.status;
  const i18nMessage = vm.$t(`errorcode.${errorcode}`).toString();
  const message = `${errorcode || ""} ${
    errorcode !== 400 ? i18nMessage : error.message || error.msg || fallback
  }`;
  toast(vm, {
    message: i18nMessage.includes("errorcode.") ? message : i18nMessage,
    color: "error",
  });
}

export function handleTxResult(vm: Vue, tx: API.Transaction) {
  if (tx.status === TransactionStatus.OK) {
    toast(vm, {
      message: vm.$t("common.action-success") as string,
      color: "success",
    });
    vm.$router.replace("/");
    return;
  }

  if (tx.status === TransactionStatus.Abort) {
    toast(vm, {
      message: vm.$t(`errorcode.${tx.msg}`) as string,
      color: "error",
    });
  }
}

export function demandPrecision(value: number): number {
  let precision = 8;
  while (precision > 2 && value > 1000) {
    value = value / 10;
    precision = precision - 1;
  }
  return precision;
}

export function getLocale() {
  let locale = "en";
  if (navigator.language.includes("zh")) {
    locale = "zh";
  } else if (navigator.language.includes("ja")) {
    locale = "ja";
  }
  return locale;
}

export function mixinImageResize(logo: string, size = 32 * 3) {
  const reg = /=s[0-9]{1,4}$/;
  if (reg.test(logo)) {
    return logo.replace(reg, `=s${size}`);
  }
  return logo;
}

export function fiatUnit(vue: Vue) {
  const lang = vue.$vuetify.lang.current;
  return lang.includes("zh") ? "￥" : "$";
}
