import { APP_TOKEN, CONFIG, EVENTS, NODE_ENV } from "@/constants";

const scope = "['PROFILE:READ', 'ASSETS:READ']";

export async function requestAuthMixin(vm: Vue) {
  if (NODE_ENV === "development" && APP_TOKEN) {
    await updateProfile(vm, { token: APP_TOKEN, scope, channel: "mixin" });

    return;
  }

  const host = window.location.origin;
  const redirectUrl = encodeURIComponent(host + "/#/auth/");
  const path = `https://mixin-oauth.firesbox.com/?client_id=${CONFIG.MIXIN_CLIENT_ID}&scope=PROFILE:READ+ASSETS:READ&response_type=code&redirect_url=${redirectUrl}`;

  localStorage.setItem("authPath", window.location.href);
  window.location.href = path;
}

export async function authMixin(vm: Vue, code: string) {
  const res = await vm.$http.auth(code);
  const redirect = localStorage.getItem("authPath") || "/";

  await updateProfile(vm, {
    token: res.token,
    scope: res.scope,
    channel: "mixin",
  });
  document.location.replace(redirect);
}

export async function authFennec(vm: Vue) {
  await vm.$fennec.connect("Pando Leaf");

  const token = await vm.$fennec.ctx!.wallet.signToken({
    payload: { from: "pando-leaf" },
  });

  await updateProfile(vm, { token, scope, channel: "fennec" });
}

async function updateProfile(
  vm: Vue,
  payload: { token: string; scope: string; channel: string }
) {
  vm.$store.commit("auth/SET_OAUTH_INFO", payload);
  await vm.$utils.app.loadAccount(vm);
}

export async function checkFennecAuth(vm: Vue) {
  if (vm.$store.state.auth.channel === "fennec") {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        vm.$fennec
          .connect("Pando Leaf")
          .then(() => {
            resolve(true);
          })
          .catch(() => {
            reject();
          });
      }, 1000);
    });
  }
}

export async function logout(vm: Vue) {
  return Promise.all([
    vm.$store.commit("auth/CLEAR"),
    vm.$store.dispatch("vault/clear"),
    vm.$store.dispatch("asset/clear"),
  ]);
}

export function openAuth(vm: Vue) {
  vm.$root.$emit(EVENTS.OPEN_AUTH);
}
