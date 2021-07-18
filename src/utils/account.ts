import { initApp } from "./app";
import {
  APP_AVATAR,
  APP_ID,
  APP_NAME,
  APP_SCOPE,
  APP_TOKEN,
  CONFIG,
  NODE_ENV,
} from "@/constants";

export async function requestLogin(vm: Vue) {
  if (NODE_ENV === "development" && APP_TOKEN) {
    vm.$store?.commit("auth/SET_PROFILE", {
      token: APP_TOKEN,
      scope: APP_SCOPE,
      id: APP_ID,
      name: APP_NAME,
      avatar: APP_AVATAR,
    });
    await initApp(vm);
    return;
  }

  const host = window.location.origin;
  const redirectUrl = encodeURIComponent(host + "/#/auth/");
  localStorage.setItem("authPath", window.location.href);
  let path = `https://mixin-oauth.firesbox.com/?client_id=${CONFIG.MIXIN_CLIENT_ID}&scope=PROFILE:READ+ASSETS:READ+SNAPSHOTS:READ&response_type=code`;
  path += `&redirect_url=${redirectUrl}`;
  window.location.href = path;
}

export async function logout(vm: Vue) {
  return Promise.all([
    vm.$store.dispatch("auth/logout"),
    vm.$store.dispatch("vault/clear"),
    vm.$store.dispatch("asset/clear"),
  ]);
}

export async function loadProfile(vm: Vue) {
  return Promise.all([
    vm.$utils.asset.loadWalletAssets(vm),
    vm.$store.dispatch("auth/getMe"),
    vm.$store.dispatch("vault/loadVaults"),
  ]);
}
