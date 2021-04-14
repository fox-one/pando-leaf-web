import Vue from "vue";
import {
  APP_AVATAR,
  APP_ID,
  APP_NAME,
  APP_SCOPE,
  APP_TOKEN,
  CONFIG,
  NODE_ENV,
} from "~/constants";
import i18n from "~/i18n";
import { initApp } from "./app";
import { v4 as uuid } from "uuid";
import number from "./number";
import { RISK } from "~/types";

export function toast(vue: Vue, data: { message: string; color?: string }) {
  vue.$store.commit("app/SET_TOAST", data);
}

export function errorHandler(
  vue: Vue,
  error: {
    status?: number;
    message?: string;
    msg?: string;
    code: string | number;
  }
) {
  const fallback = "未知错误";
  const errorcode = error.code !== -1 ? error.code : error.status;
  const i18nMessage = vue.$t(`errorcode.${errorcode}`).toString();
  const message = `${errorcode || ""} ${
    errorcode !== 400 ? i18nMessage : error.message || error.msg || fallback
  }`;
  toast(vue, {
    message: i18nMessage.includes("errorcode.") ? message : i18nMessage,
    color: "error",
  });
}

export function demandPrecision(value: number): number {
  let precision = 8;
  while (precision > 2 && value > 1000) {
    value = value / 10;
    precision = precision - 1;
  }
  return precision;
}

export function trimDecimalZero(num): string {
  if (num === undefined || num === null || num === "") {
    return num;
  }
  if (Number.isInteger(Number.parseFloat(num))) {
    return Number.parseFloat(num).toFixed(0);
  }
  if (num.charAt(num.length - 1) === "0") {
    return trimDecimalZero(num.substr(0, num.length - 1));
  }
  return num;
}

export function getMixinContext() {
  let ctx: any = {};
  const win: any = window;
  if (win.webkit?.messageHandlers?.MixinContext) {
    ctx = JSON.parse(prompt("MixinContext.getContext()") as any);
    ctx.platform = ctx.platform || "iOS";
  } else if (typeof win.MixinContext?.getContext === "function") {
    ctx = JSON.parse(win.MixinContext.getContext());
    ctx.platform = ctx.platform || "Android";
  }
  return ctx;
}

export function isMixin() {
  const platform = getMixinContext().platform;
  return platform === "iOS" || platform === "Android";
}

export function loadMixinTheme() {
  const platform = getMixinContext().platform;
  const win: any = window;
  switch (platform) {
    case "iOS":
      win.webkit.messageHandlers.reloadTheme.postMessage("");
      return;
    case "Android":
      win.MixinContext.reloadTheme();
  }
}

export function isDarkTheme() {
  try {
    const context = getMixinContext();
    if (context?.appearance) {
      return context.appearance === "dark";
    }
  } catch (error) {}
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
}

export function getToken(app) {
  return app.store.getters["auth/getToken"];
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

export function genPaymentUrl(data: {
  recipient: string;
  assetId: string;
  amount: string;
  traceId: string;
  memo: string;
}) {
  const { recipient, assetId, amount, traceId, memo } = data;
  return `mixin://pay?recipient=${recipient}&asset=${assetId}&amount=${amount}&trace=${traceId}&memo=${memo}`;
}

export function requestLogin(vue) {
  if (NODE_ENV === "development" && APP_TOKEN) {
    vue.$store?.commit("auth/SET_TOKEN", {
      token: APP_TOKEN,
      scope: APP_SCOPE,
      id: APP_ID,
      name: APP_NAME,
      avatar: APP_AVATAR,
    });
    initApp(vue);
    return;
  }
  const host = window.location.origin;
  const redirectUrl = encodeURIComponent(host + "/#/auth/");
  localStorage.setItem("authPath", window.location.href);
  let path = `https://mixin-oauth.firesbox.com/?client_id=${CONFIG.MIXIN_CLIENT_ID}&scope=PROFILE:READ+ASSETS:READ+SNAPSHOTS:READ&response_type=code`;
  path += `&redirect_url=${redirectUrl}`;
  window.location.href = path;
}

export function debounce(fn: any, delay: number) {
  let timeoutId = 0 as any;
  return (...args: any[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

export function throttle<T extends (...args: any[]) => any>(
  fn: T,
  limit: number
) {
  let throttling = false;
  return (...args: Parameters<T>): void | ReturnType<T> => {
    if (!throttling) {
      throttling = true;
      setTimeout(() => (throttling = false), limit);
      return fn(...args);
    }
  };
}

export function uuidV4() {
  return uuid();
}

export function showPaying(
  vue: Vue,
  data: {
    timer: any;
  }
) {
  vue.$store.commit("app/SET_PAYING", {
    visible: true,
    timer: data.timer,
  });
}

export function hidePaying(vue: Vue) {
  vue.$store.commit("app/SET_PAYING", {
    visible: false,
  });
}

export function showPayDialog(vue: Vue, data: { paymentUrl: string }) {
  vue.$store.commit("app/SET_PAYMENT_URL", {
    visible: true,
    paymentUrl: data.paymentUrl,
  });
}

export function hidePaymentDialog(vue: Vue) {
  vue.$store.commit("app/SET_PAYMENT_URL", {
    visible: false,
    paymentUrl: "",
  });
}

export function risk(currentRatio, minimumRatio) {
  const risk = Number(currentRatio) / Number(minimumRatio);
  if (!number.isValid(risk)) return "greyscale-1";
  if (risk < 0) {
    return "greyscale-1";
  } else if (risk <= 1.1) {
    return "red";
  } else if (risk <= 1.5) {
    return "orange";
  } else {
    return "green";
  }
}

export function riskLevel(currentRatio, minimumRatio) {
  const risk = Number(currentRatio) / Number(minimumRatio);
  if (!number.isValid(risk)) return RISK.NA;
  if (risk < 0) {
    return RISK.NA;
  } else if (risk <= 1.1) {
    return RISK.HIGH;
  } else if (risk <= 1.5) {
    return RISK.MEDIUM;
  } else {
    return RISK.LOW;
  }
}

export function mixinImageResize(logo: string, size = 32 * 3) {
  const reg = /=s[0-9]{1,4}$/;
  if (reg.test(logo)) {
    return logo.replace(reg, `=s${size}`);
  }
  return logo;
}
