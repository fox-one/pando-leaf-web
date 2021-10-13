export async function getAssets(vm: Vue) {
  const store = vm.$store;
  if (vm.$fennec.connected) {
    return store.dispatch("asset/loadFennecWalletAssets", {
      fennec: vm.$fennec,
    });
  } else {
    return store.dispatch("asset/loadWalletAssets");
  }
}

export async function loadWalletAsset(vm: Vue, assetId: string) {
  const store = vm.$store;
  if (vm.$fennec.connected) {
    return store.dispatch("asset/loadFennecWalletAsset", {
      fennec: vm.$fennec,
      assetId,
    });
  } else {
    return store.dispatch("asset/loadWalletAsset", assetId);
  }
}
