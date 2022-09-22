export async function getAssets(vm: Vue) {
  if (vm.$store.getters["auth/isLogged"]) {
    const assets = await vm.$passport.getAssets();

    if (assets?.length > 0) {
      vm.$store.commit("asset/SET_WALLET_ASSETS", assets);
    }
  }
}

export async function loadWalletAsset(vm: Vue, id: string) {
  if (vm.$store.getters["auth/isLogged"]) {
    const asset = await vm.$passport.getAsset(id);

    vm.$store.commit("asset/SET_WALLET_ASSET", asset);
  }
}
