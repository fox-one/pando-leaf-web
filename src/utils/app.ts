import { EVENTS, TERMS_VERSION } from "~/constants";
import { sync } from "./account";

export async function initApp(vm: Vue) {
  try {
    await loadMarketData(vm);

    await sync(vm);

    await loadAccountData(vm);

    setUpTask(vm);

    vm.$store.commit("app/SET_INITING", false);
  } catch (error: any) {
    vm.$utils.helper.errorHandler(vm, error);
  }
}

export async function loadMarketData(vm: Vue) {
  await Promise.all([
    vm.$store.dispatch("asset/loadAssets"),
    vm.$store.dispatch("asset/loadNetworkAssets"),
    vm.$store.dispatch("oracle/loadOracles"),
    vm.$store.dispatch("collateral/loadCollaterals"),
    vm.$store.dispatch("collateral/loadFiats"),
  ]);
}

export async function loadAccountData(vm: Vue) {
  try {
    await Promise.all([
      // vm.$store.dispatch("account/loadProfile"),
      vm.$store.dispatch("vault/loadVaults"),
      vm.$utils.asset.getAssets(vm),
    ]);
  } catch (error) {
    // ignore
  }
}

export async function refresh(vm: Vue) {
  await loadMarketData(vm);
  if (vm.$store.getters["auth/isLogged"]) {
    await loadAccountData(vm);
  }
}

let intervalId;

export function setUpTask(vm: Vue) {
  if (intervalId) {
    clearInterval(intervalId);
  }

  intervalId = setInterval(() => {
    refresh(vm);
  }, 150000);
}

export function checkTerms(vm: Vue) {
  const termsAccepted = vm.$store.state.app.termsAccepted;
  const termsVersion = vm.$store.state.app.termsVersion;
  const visited = vm.$store.state.app.visited;

  if (visited && (!termsAccepted || termsVersion !== TERMS_VERSION)) {
    vm.$root.$emit(EVENTS.OPEN_TERMS_MODAL);
  }
}
