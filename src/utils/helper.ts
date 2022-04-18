import Vue from "vue";
import { DurationHour, TransactionStatus } from "@/enums";
import { v4 as uuid } from "uuid";
import parse from "parse-duration";

export function errorHandler(vm: Vue, error: any) {
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

export function showNetworkCongestion(vm: Vue) {
  vm.$uikit.dialog.show({
    title: vm.$t("network.congestion.title") as string,
    text: vm.$t("network.congestion.text") as string,
    confirm: { text: vm.$t("network.congestion.confirm") as string },
    cancel: { show: false },
  });
}

export function getDurationData(
  data,
  duration,
  fn,
  size: number | undefined = undefined
) {
  const end = fn(data[data.length - 1]);
  const formatDuration = DurationHour[duration];
  let start = end - (parse(formatDuration, "s") || 0);
  if (!start) {
    start = fn(data[0]);
  }

  return data
    .filter((x) => fn(x) >= start)
    .filter((x, index, array) => {
      if (!size) {
        return true;
      }

      const interval = Math.floor(array.length / size);

      if (interval === 0) {
        return true;
      }

      return (array.length - 1 - index) % interval === 0;
    });
}
