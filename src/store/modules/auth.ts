import { SCOPE } from "@/enums";
import { make } from "vuex-pathify";

import type { GetterTree, ActionTree } from "vuex";

const state = (): State.Auth => ({
  token: "",
  scope: "",
  id: "",
  name: "",
  avatar: "",
  fennecToken: "",
});

const getters: GetterTree<State.Auth, unknown> = {
  isLogged(state) {
    return Boolean(state.token) || Boolean(state.fennecToken);
  },

  canReadAsset(state) {
    return state.scope.indexOf(SCOPE.ASSETS_READ) > -1;
  },
};

const mutations = {
  ...make.mutations(state),
  SET_ME(state: State.Auth, data) {
    state.id = data.id;
    state.name = data.full_name;
    state.avatar = data.avatar;
  },
  SET_PROFILE(state: State.Auth, data: API.AuthResult) {
    state.token = data.token;
    state.scope = data.scope;
    state.id = data.id;
    state.name = data.name;
    state.avatar = data.avatar;
  },
  REMOVE_PROFILE: (state: State.Auth) => {
    state.token = "";
    state.scope = "";
    state.id = "";
    state.name = "";
    state.avatar = "";
    state.fennecToken = "";
  },
};

const actions: ActionTree<State.Auth, unknown> = {
  async login({ commit }, code) {
    const res = await this.$http.auth(code);
    commit("SET_PROFILE", res);
  },

  async getMe({ commit }) {
    const res = await this.$http.getMe();
    commit("SET_ME", {
      id: res.user_id,
      name: res.full_name,
      avatar: res?.avatar_url,
    });
  },

  logout({ commit }) {
    commit("REMOVE_PROFILE");
  },
};

export default {
  namespaced: true,
  getters,
  state,
  mutations,
  actions,
};
