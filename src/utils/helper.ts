import Vue from "vue";
import { TransactionStatus } from "@/enums";
import { v4 as uuid } from "uuid";

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
  vm.$uikit.toast.error({
    message: i18nMessage.includes("errorcode.") ? message : i18nMessage,
  });
}

export function handleTxResult(vm: Vue, tx: API.Transaction) {
  if (tx.status === TransactionStatus.OK) {
    vm.$uikit.toast.success({
      message: vm.$t("common.action-success") as string,
    });
    vm.$router.replace("/");
    return;
  }

  if (tx.status === TransactionStatus.Abort) {
    vm.$uikit.toast.error({
      message: vm.$t(`errorcode.${tx.msg}`) as string,
    });
  }
}

export function uuidV4() {
  return uuid();
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

export function fiatUnit(vue: Vue) {
  const lang = vue.$vuetify.lang.current;
  return lang.includes("zh") ? "￥" : "$";
}
