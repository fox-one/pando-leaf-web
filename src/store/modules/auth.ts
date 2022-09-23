import { MutationTree, GetterTree } from "vuex";
import { make } from "vuex-pathify";

const state = (): State.Auth => ({
  token: "",
  scope: "",
  channel: "",
});

const getters: GetterTree<State.Auth, any> = {
  isLogged(state) {
    return Boolean(state.token);
  },
  canReadAsset() {
    return true;
  },
};

const mutations: MutationTree<State.Auth> = {
  ...make.mutations(state),
  SET_OAUTH_INFO(state, data) {
    state.token = data.token;
    state.scope = data.scope;
    state.channel = data.channel;
  },
  CLEAR(state) {
    state.token = "";
    state.scope = "";
    state.channel = "";
  },
};

export default {
  namespaced: true,
  getters,
  state,
  mutations,
};
