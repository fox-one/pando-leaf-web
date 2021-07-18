import { make } from "vuex-pathify";

import type { GetterTree, ActionTree } from "vuex";

const state = (): State.Vault => ({
  vaults: [],
});

const getters: GetterTree<State.Vault, unknown> = {
  getVaultById(state) {
    return (id: string) => state.vaults.find((v) => v.id === id);
  },

  haveVault(state) {
    return state.vaults && state.vaults?.length > 0;
  },
};

const mutations = make.mutations(state);

const actions: ActionTree<State.Vault, any> = {
  async loadVaults({ commit }) {
    const response = await this.$http.getMyVaults();
    commit("SET_VAULTS", response.vaults);
  },

  async clear({ commit }) {
    commit("SET_VAULTS", []);
  },
};

export default {
  namespaced: true,
  getters,
  state,
  mutations,
  actions,
};
