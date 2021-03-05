export async function initApp(vue: Vue) {
  const store = vue.$store;
  await Promise.all([
    // store.dispatch("global/syncAccount"),
    // store.dispatch("global/syncMarkets"),
  ]);
}
