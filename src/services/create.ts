/* eslint-disable prefer-promise-reject-errors */
import { NuxtAppOptions } from "@nuxt/types";
import { AxiosRequestConfig } from "axios";
import Http from "./http";
import createApis from "./index";
import { v4 as uuid } from "uuid";

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

      if (res?.data?.code) {
        return Promise.reject(res.data);
      }

      if (res?.data?.error?.code === 401) {
        app.$utils.account.logout({ $store: app.store } as any);

        return Promise.reject(res.data.error);
      }

      return res.data.data;
    },

    (error) => {
      if (error?.response?.data) {
        const status = error.response.status;

        if (status === 401) {
          app.$utils.account.logout({ $store: app.store } as any);
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
          token = app.store?.state.auth.token;
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
