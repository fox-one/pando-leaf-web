import Vue from "vue";
import { MutationTree, GetterTree, ActionTree } from "vuex";
import { IAsset, ICollateral, IMixinAsset, IVault } from "~/services/types/vo";

const state = () => ({
  collaterals: [],
  walletAssets: {},
  assets: [],
  myVaults: [],
});

export type AssetsState = {
  collaterals: ICollateral[];
  walletAssets: Map<string, IMixinAsset>;
  assets: IAsset[];
  myVaults: IVault[];
};

const getters: GetterTree<AssetsState, any> = {
  haveVault(state) {
    return state.myVaults && state.myVaults?.length !== 0;
  },
  getWalletAssetById(state) {
    return (id) => state.walletAssets[id];
  },
  getAssetById(state) {
    return (id) => state.assets?.find((a) => a.id === id);
  },
  getCollateral(state) {
    return (id) => state.collaterals.find((c) => c.id === id);
  },
  getVault(state) {
    return (id) => state.myVaults.find((v) => v.id === id);
  },
};

const mutations: MutationTree<AssetsState> = {
  SET_WALLET_ASSETS(state, data: IMixinAsset[]) {
    const newWalletAssets = Object.assign({}, state.walletAssets);
    data.forEach((v) => {
      newWalletAssets[v.asset_id] = v;
    });
    state.walletAssets = newWalletAssets;
  },
  SET_WALLET_ASSET(state, { data, id }) {
    Vue.set(state.walletAssets, id, data);
  },
  SET_ASSETS(state, data: IAsset[]) {
    state.assets = data;
  },
  SET_COLLATERALS(state, data: ICollateral[]) {
    state.collaterals = data;
  },
  SET_MY_VAULTS(state, data: IVault[]) {
    state.myVaults = data;
  },
};

const actions: ActionTree<AssetsState, any> = {
  async syncMarkets({ commit }) {
    const response = await this.$http.listCollaterals();
    commit("SET_COLLATERALS", response?.data?.collaterals);
  },
  async syncAssets({ commit }) {
    const response = await this.$http.getAssets();
    commit("SET_ASSETS", response?.data?.assets);
  },
  async syncWallets({ commit }) {
    const response = await this.$http.getAssetsFromMixin();
    commit("SET_WALLET_ASSETS", response?.data);
  },
  async syncWalletAsset({ commit }, id) {
    const response = await this.$http.getAssetFromMixin(id);
    commit("SET_WALLET_ASSET", response?.data);
  },
  async syncMyVaults({ commit }) {
    const response = await this.$http.getMyVaults();
    commit("SET_MY_VAULTS", response?.data?.vaults);
  },
  clear({ commit }) {
    commit("SET_WALLET_ASSETS", []);
  },
};

export default {
  getters,
  state,
  mutations,
  actions,
};
