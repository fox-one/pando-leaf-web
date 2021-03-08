import Vue from "vue";
import { MutationTree, GetterTree, ActionTree } from "vuex";
import { IAsset, ICollateral, IMixinAsset } from "~/services/types/vo";

const state = () => ({
  collaterals: [],
  walletAssets: {},
  assets: [],
});

export type AssetsState = {
  collaterals: ICollateral[];
  walletAssets: Map<string, IMixinAsset>;
  assets: IAsset[];
};

const getters: GetterTree<AssetsState, any> = {
  getWalletAssetById(state) {
    return (id) => state.walletAssets[id];
  },
  getAssetById(state) {
    return (id) => state.assets?.find((a) => a.id === id);
  },
  getCollateral(state) {
    return (id) => state.collaterals.find((c) => c.id === id);
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
