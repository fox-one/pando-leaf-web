import { GetterTree, MutationTree, ActionTree } from "vuex";
import { make } from "vuex-pathify";

const state = (): State.Account => ({
  profile: null,
});

const getters: GetterTree<State.Account, any> = {
  userId(state) {
    return state.profile?.user_id;
  },
};

const mutations: MutationTree<State.Account> = {
  ...make.mutations(state),
  CLEAR(state) {
    state.profile = null;
  },
};

const actions: ActionTree<State.Account, any> = {
  async loadProfile({ commit, rootGetters }) {
    if (rootGetters["auth/isLogged"]) {
      const profile = await this.$http.getMe();
      commit("SET_PROFILE", profile);
    }
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions,
};
