import dayjs from "dayjs";

export async function initApp(vue: Vue) {
  const store = vue.$store;
  dayjs.locale(vue.$vuetify.lang.current);
  await Promise.all([
    store.dispatch("auth/getMe"),
    store.dispatch("collateral/loadCollaterals"),
    store.dispatch("vault/loadVaults"),
    store.dispatch("asset/loadAssets"),
    store.dispatch("oracle/loadOracles"),
  ]);
}
