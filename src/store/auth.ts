import { MutationTree, GetterTree, ActionTree } from "vuex";
import { SCOPE } from "~/types";

const state = () => ({
  token: "",
  scope: "",
});

export type AuthState = {
  token: string;
  scope: string;
};

const getters: GetterTree<AuthState, any> = {
  isLogged(state) {
    return Boolean(state.token);
  },
  getToken(state) {
    return state.token;
  },
  canReadAsset(state) {
    return state.scope.indexOf(SCOPE.ASSETS_READ) > -1;
  },
};

const mutations: MutationTree<AuthState> = {
  SET_TOKEN(state, data: { token: string; scope: string }) {
    state.token = data.token;
    state.scope = data.scope;
  },
};

const actions: ActionTree<AuthState, any> = {
  async login({ commit, dispatch }, code) {
    const res = await this.$http.auth(code);
    commit("SET_TOKEN", { token: res.access_token, scope: res.scope });
    // dispatch("global/syncAccount");
    // dispatch("global/syncMarkets");
  },
  logout({ dispatch, commit }) {
    commit("SET_TOKEN", { token: "", scope: "" });
    // dispatch("global/clear");
  },
};

export default {
  getters,
  state,
  mutations,
  actions,
};
