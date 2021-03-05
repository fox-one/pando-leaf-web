import Vue from "vue";
import { MutationTree, GetterTree, ActionTree } from "vuex";
import { IMixinAsset } from "~/services/types/vo";

const state = () => ({
  walletAssets: {},
});

export type AssetsState = {
  walletAssets: Map<string, IMixinAsset>;
};

const getters: GetterTree<AssetsState, any> = {
  getAssetById(state) {
    return (id) => state.walletAssets[id];
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
};

const actions: ActionTree<AssetsState, any> = {
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
