import { MutationTree, GetterTree, ActionTree } from "vuex";
import { AuthResult } from "~/services/types/vo";
import { SCOPE } from "~/types";

const state = () => ({
  token: "",
  scope: "",
  id: "",
  name: "",
  avatar: "",
  fennecToken: "",
});

export type AuthState = {
  token: string;
  scope: string;
  id: string;
  name: string;
  avatar: string;
  fennecToken: string;
};

const getters: GetterTree<AuthState, any> = {
  isLogged(state) {
    return Boolean(state.token) || Boolean(state.fennecToken);
  },
  getToken(state) {
    return state.token;
  },
  canReadAsset(state) {
    return state.scope.indexOf(SCOPE.ASSETS_READ) > -1;
  },
};

const mutations: MutationTree<AuthState> = {
  SET_TOKEN(state, data: AuthResult) {
    state.token = data.token;
    state.scope = data.scope;
    state.id = data.id;
    state.name = data.name;
    state.avatar = data.avatar;
    state.fennecToken = "";
  },
  SET_FENNEC_TOKEN(state, data: { token: string; scope: string }) {
    state.fennecToken = data.token;
  },
};

const actions: ActionTree<AuthState, any> = {
  async login({ commit }, code) {
    const res = await this.$http.auth(code);
    commit("SET_TOKEN", res.data);
  },
  logout({ dispatch, commit }) {
    commit("SET_TOKEN", {
      token: "",
      scope: "",
      id: "",
      name: "",
      avatar: "",
    });
  },
};

export default {
  getters,
  state,
  mutations,
  actions,
};
