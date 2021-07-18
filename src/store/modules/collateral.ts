import { make } from "vuex-pathify";

import type { GetterTree, ActionTree } from "vuex";

// name collateral

const state = (): State.Collateral => ({
  collaterals: [],
});

const getters: GetterTree<State.Collateral, unknown> = {
  getCollateralById(state) {
    return (id: string) => state.collaterals.find((c) => c.id === id);
  },
};

const mutations = make.mutations(state);

const actions: ActionTree<State.Vault, any> = {
  async loadCollaterals({ commit }) {
    const response = await this.$http.listCollaterals();
    commit("SET_COLLATERALS", response.collaterals);
  },
};

export default {
  namespaced: true,
  getters,
  state,
  mutations,
  actions,
};
