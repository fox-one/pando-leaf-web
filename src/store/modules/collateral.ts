import { make } from "vuex-pathify";
import type { GetterTree, ActionTree } from "vuex";

// name collateral
const state = (): State.Collateral => ({
  collaterals: [],
  fiats: [],
});

const getters: GetterTree<State.Collateral, unknown> = {
  getCollateralById(state) {
    return (id: string) => state.collaterals.find((c) => c.id === id);
  },
  getOverview(state, getters, rootState, rootGetters) {
    if (!state.collaterals || state.collaterals.length === 0) {
      return {
        supply: "-",
        collaterals: "-",
        collaterilazation: "-",
      };
    }
    let col = 0;
    let dai = 0;
    state.collaterals.forEach((c) => {
      const colAsset = rootGetters["asset/getAssetById"](c?.gem);
      const daiAsset = rootGetters["asset/getAssetById"](c?.dai);
      const colAmount = Number(c.ink || "0");
      const daiAmount = Number(c.art || "0") * Number(c.rate || "1");
      const colPrice = Number(colAsset?.price || "0");
      const daiPrice = Number(daiAsset?.price || "0");
      col += colAmount * colPrice;
      dai += daiAmount * daiPrice;
    });
    return {
      collaterals: col,
      supply: dai,
      collaterilazation: col / dai,
    };
  },
};

const mutations = make.mutations(state);

const actions: ActionTree<State.Vault, any> = {
  async loadCollaterals({ commit }) {
    const response = await this.$http.listCollaterals();
    commit("SET_COLLATERALS", response.collaterals);
  },

  async loadFiats({ commit }) {
    const resp = await this.$http.getFiats();
    commit("SET_FIATS", resp);
  },
};

export default {
  namespaced: true,
  getters,
  state,
  mutations,
  actions,
};
