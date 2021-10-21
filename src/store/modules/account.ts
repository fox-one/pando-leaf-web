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
    const profile = await this.$http.getMe();
    if (rootGetters["auth/isLogged"]) {
      commit("SET_PROFILE", profile);
    }
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
