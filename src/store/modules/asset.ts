import Vue from "vue";
import { make } from "vuex-pathify";

import type { GetterTree, ActionTree, MutationTree } from "vuex";

const state = () => ({
  walletAssets: {},
  assets: [],
});

const getters: GetterTree<State.Asset, any> = {
  getWalletAssetById(state) {
    return (id: string) => state.walletAssets[id];
  },
  getAssetById(state) {
    return (id: string) => {
      return state.assets.find((a) => a.id === id);
    };
  },
};

const mutations: MutationTree<State.Asset> = {
  ...make.mutations(state),
  SET_WALLET_ASSETS(state, data: API.MixinAsset[]) {
    state.walletAssets = data.reduce(
      (acc, asset) => ({ ...acc, [asset.asset_id]: asset }),
      {}
    );
  },

  SET_WALLET_ASSET(state, { data, id }) {
    Vue.set(state.walletAssets, id, data);
  },
};

const actions: ActionTree<State.Asset, unknown> = {
  async loadAssets({ commit }) {
    const response = await this.$http.getAssets();
    commit("SET_ASSETS", response.assets);
  },

  async loadWalletAssets({ commit }) {
    const response = await this.$http.getAssets();
    commit("SET_ASSETS", response.assets);
  },

  async loadWalletAsset({ commit }, id) {
    const response = await this.$http.getAssetFromMixin(id);
    commit("SET_WALLET_ASSET", { id, data: response });
  },

  async loadFennecWalletAssets({ commit }, { fennec }) {
    const walletAssets = await fennec?.getAssets();
    commit("SET_WALLET_ASSETS", walletAssets || []);
  },

  async loadFennecWalletAsset({ commit }, { fennec, assetId }) {
    const walletAsset = await fennec?.getAsset(assetId);
    if (walletAsset) {
      commit("SET_WALLET_ASSET", { id: assetId, data: walletAsset });
    }
  },

  async clear({ commit }) {
    commit("SET_WALLET_ASSETS", []);
  },
};

export default {
  namespaced: true,
  getters,
  state,
  mutations,
  actions,
};
