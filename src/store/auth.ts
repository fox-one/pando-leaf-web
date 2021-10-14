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
    return state.token
      ? state.token
      : state.fennecToken
      ? state.fennecToken
      : "";
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
  SET_ME(state, { id, name, avatar }) {
    (state.id = id), (state.name = name), (state.avatar = avatar);
  },
  SET_FENNEC_TOKEN(state, data: { token: string; scope: string }) {
    state.fennecToken = data.token;
    state.scope = data.scope;
  },
};

const actions: ActionTree<AuthState, any> = {
  async login({ commit }, code) {
    const res = await this.$http.auth(code);
    commit("SET_TOKEN", res.data);
  },
  async getMe({ commit }) {
    const res = await this.$http.getMe();
    commit("SET_ME", {
      id: res?.data?.user_id,
      name: res?.data?.full_name,
      avatar: res?.data?.avatar_url,
    });
  },
  logout({ commit }) {
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
