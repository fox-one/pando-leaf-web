/* eslint-disable prefer-promise-reject-errors */
import { NuxtAppOptions } from "@nuxt/types";
import { AxiosRequestConfig } from "axios";
import Http from "~/utils/http";
import createApis from "./index";
import { v4 as uuid } from "uuid";
import { CONFIG } from "~/constants";

function generateStructureInterceptor(app: NuxtAppOptions) {
  return [
    (res) => {
      const reqId = res?.headers?.["x-request-id"];
      const resId = res?.config?.headers?.["x-request-id"];
      if (reqId && resId && reqId !== resId) {
        return Promise.reject(
          new Error(
            `X-Request-Id Not Match: request: ${res.headers["x-request-id"]}; response: ${res.config.headers["x-request-id"]}`
          )
        );
      }
      if (res && res.data && res.data.code) {
        return Promise.reject(res.data);
      }
      if (res?.data?.error?.code === 401) {
        if (res.data.error.code === 401) {
          app.store?.dispatch("auth/logout");
          app.store?.dispatch("global/clear");
        }
        return Promise.reject(res.data.error);
      }
      return res.data;
    },
    (error) => {
      if (error.response && error.response.data) {
        const status = error.response.status;
        if (status === 401) {
          app.store?.dispatch("auth/logout");
          app.store?.dispatch("global/clear");
        }
        const { code, message } = error.response.data;
        return Promise.reject({ status, code, message });
      } else {
        return Promise.reject({ status, code: -1 });
      }
    },
  ];
}

function generateAuthInterceptor(app: NuxtAppOptions) {
  return [
    (configs) => {
      let token = "";
      if (configs.token) {
        token = configs.token;
      } else {
        if (app.$fennec.connected) {
          token = app.$fennec.getToken();
        } else {
          token = app.$utils.helper.getToken(app.store);
        }
      }
      if (token) {
        configs.headers.Authorization = `Bearer ${token}`;
      }
      return configs;
    },
  ];
}

function generateI18nInterceptor(app: NuxtAppOptions) {
  return [
    (configs) => {
      const locale = app.$utils.helper.getLocale();
      configs.headers["Accept-Language"] = locale;
      configs.headers["Access-Control-Allow-Origin"] = "*";
      configs.headers["x-request-id"] = uuid();
      return configs;
    },
  ];
}

export default function createHttpService(app: NuxtAppOptions, base) {
  const config: AxiosRequestConfig = { baseURL: base };
  const http = new Http(
    config,
    [generateAuthInterceptor(app), generateI18nInterceptor(app)],
    [generateStructureInterceptor(app)]
  );
  return createApis(http);
}
