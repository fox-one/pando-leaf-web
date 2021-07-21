import dayjs from "dayjs";

export async function initApp(vue: Vue) {
  const store = vue.$store;
  dayjs.locale(vue.$vuetify.lang.current);
  await Promise.all([
    // store.dispatch("global/syncAccount"),
    store.dispatch("global/syncMarkets"),
    store.dispatch("global/syncAssets"),
  ]);
}
