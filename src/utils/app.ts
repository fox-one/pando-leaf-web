import { EVENTS, TERMS_VERSION } from "~/constants";

export async function initApp(vm: Vue) {
  try {
    await loadMarket(vm);

    if (vm.$route.name === "auth") {
      vm.$store.commit("app/SET_INITING", false);

      return;
    }

    await vm.$utils.account.checkFennecAuth(vm);
    await vm.$store.dispatch("account/loadProfile");
    await loadAccount(vm);
    setUpTask(vm);

    vm.$store.commit("app/SET_INITING", false);
  } catch (error: any) {
    vm.$utils.helper.errorHandler(vm, error);
  }
}

export async function loadMarket(vm: Vue) {
  await Promise.all([
    vm.$store.dispatch("asset/loadAssets"),
    vm.$store.dispatch("asset/loadNetworkAssets"),
    vm.$store.dispatch("oracle/loadOracles"),
    vm.$store.dispatch("collateral/loadCollaterals"),
  ]);
}

export async function loadAccount(vm: Vue) {
  try {
    await Promise.all([
      vm.$store.dispatch("vault/loadVaults"),
      vm.$utils.asset.getAssets(vm),
    ]);
  } catch (error) {}
}

export async function refresh(vm: Vue) {
  await loadMarket(vm);
  if (vm.$store.getters["auth/isLogged"]) {
    await loadAccount(vm);
  }
}

let intervalId;

export function setUpTask(vm: Vue) {
  if (intervalId) {
    clearInterval(intervalId);
  }

  intervalId = setInterval(() => {
    refresh(vm);
  }, 5000);
}

export function checkTerms(vm: Vue) {
  const termsAccepted = vm.$store.state.app.termsAccepted;
  const termsVersion = vm.$store.state.app.termsVersion;
  const visited = vm.$store.state.app.visited;

  if (visited && (!termsAccepted || termsVersion !== TERMS_VERSION)) {
    vm.$root.$emit(EVENTS.OPEN_TERMS_MODAL);
  }
}
