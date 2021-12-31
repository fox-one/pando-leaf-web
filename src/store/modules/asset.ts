import Vue from "vue";
import { make } from "vuex-pathify";

import type { GetterTree, ActionTree, MutationTree } from "vuex";

const state = () => ({
  walletAssets: [],
  assets: [],
  networkAssets: [],
});

const getters: GetterTree<State.Asset, any> = {
  walletBalance(state) {
    return state.walletAssets.reduce((total, next) => {
      return total + +next.price_usd * +next.balance;
    }, 0);
  },
  walletAssetsMap(state) {
    return state.walletAssets.reduce((m, x) => ({ ...m, [x.asset_id]: x }), {});
  },
  networkAssetsMap(state) {
    return state.networkAssets.reduce(
      (m, x) => ({ ...m, [x.asset_id]: x }),
      {}
    );
  },
  assetsMap(state) {
    return state.assets.reduce((m, x) => ({ ...m, [x.id]: x }), {});
  },
  getWalletAssetById(_, getters) {
    return (id: string) => getters["walletAssetsMap"][id];
  },
  getAssetById(_, getters) {
    return (id: string) => getters["assetsMap"][id];
  },
  getNetworkAssetById(_, getters) {
    return (id: string) => getters["networkAssetsMap"][id];
  },
};

const mutations: MutationTree<State.Asset> = {
  ...make.mutations(state),
  SET_WALLET_ASSETS(state, data: API.MixinAsset[]) {
    state.walletAssets = data;
  },

  SET_WALLET_ASSET(state, { data, id }) {
    const index = state.walletAssets.findIndex((x) => x.asset_id === id);
    if (index !== -1) {
      Vue.set(state.walletAssets, index, data);
    } else {
      Vue.set(state.walletAssets, state.walletAssets.length, data);
    }
  },
  SET_NETWORK_ASSETS(state, data: API.MixinAsset[]) {
    state.networkAssets = data;
  },
};

const actions: ActionTree<State.Asset, unknown> = {
  async loadAssets({ commit }) {
    const response = await this.$http.getAssets();
    commit("SET_ASSETS", response.assets);
  },

  async loadWalletAssets({ commit }) {
    const response = await this.$http.getAssetsFromMixin();
    commit("SET_WALLET_ASSETS", response || []);
  },

  async loadWalletAsset({ commit }, id) {
    const response = await this.$http.getAssetFromMixin(id);
    commit("SET_WALLET_ASSET", { id, data: response });
  },

  async loadFennecWalletAssets({ commit, state }, { fennec }) {
    const walletAssets = await fennec.ctx?.wallet?.getAssets();
    commit("SET_WALLET_ASSETS", walletAssets || []);
  },

  async loadFennecWalletAsset({ commit }, { fennec, assetId }) {
    const walletAsset = await fennec.ctx?.wallet?.getAsset(assetId);
    if (walletAsset) {
      commit("SET_WALLET_ASSET", { id: assetId, data: walletAsset });
    }
  },

  async loadNetworkAssets({ commit }) {
    const assets = await this.$http.getNetworkAssets();
    commit("SET_NETWORK_ASSETS", assets || []);
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
