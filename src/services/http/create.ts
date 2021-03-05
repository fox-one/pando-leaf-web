/* eslint-disable prefer-promise-reject-errors */
import { NuxtAppOptions } from "@nuxt/types";
import { AxiosRequestConfig } from "axios";
import Http from "~/utils/http";
import createApis from "./index";

function generateStructureInterceptor(app: NuxtAppOptions) {
  return [
    (res) => {
      if (res?.data?.code) {
        return Promise.reject(res.data);
      }
      if (res?.data?.error?.code === 401) {
        return Promise.reject(res.data.error);
      }
      return res.data;
    },
    (error) => {
      if (error.response && error.response.data) {
        const status = error.response.status;
        if (status === 401) {
          app.store?.dispatch("auth/logout");
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
      const token = app.$utils.helper.getToken(app);
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
