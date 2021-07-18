import { GetterTree, ActionTree } from "vuex";
import { make } from "vuex-pathify";

const state = (): State.Oracle => ({
  oracles: [],
});

const getters: GetterTree<State.Oracle, unknown> = {
  getOracleById(state) {
    return (id: string) => state.oracles.find((a) => a.asset_id === id);
  },
};

const mutations = make.mutations(state);

const actions: ActionTree<State.Oracle, any> = {
  async loadOracles({ commit }) {
    const response = await this.$http.oracles();
    commit("SET_ORACLES", response.oracles);
  },
};

export default {
  namespaced: true,
  getters,
  state,
  mutations,
  actions,
};
