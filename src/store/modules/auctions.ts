import { make } from "vuex-pathify";

import type { MutationTree, GetterTree, ActionTree } from "vuex";
import { FlipAction } from "~/enums";

const state = (): State.Auctions => ({
  flips: [],
  loading: false,
  limit: 20,
  cursor: null,
  hasNext: true,
});

const getters: GetterTree<State.Auctions, unknown> = {
  getFlipById(state) {
    return (id: string) => state.flips.find((v) => v.id === id);
  },

  flipsDone(state) {
    return state.flips.filter((v) => v.action === FlipAction.FlipDeal);
  },

  flipsAuctioning(state) {
    return state.flips.filter((v) => v.action !== FlipAction.FlipDeal);
  },

  haveFlips(state) {
    return state.flips && state.flips?.length > 0;
  },
};

const mutations: MutationTree<State.Auctions> = {
  ...make.mutations(state),
  SET_RESULT(state, { pagination, flips }) {
    state.cursor = pagination.next_cursor;
    state.hasNext = pagination.has_next;
    state.flips = flips;
  },
  RESET(state) {
    state.hasNext = true;
    state.cursor = null;
    state.flips = [];
  },
};
const actions: ActionTree<State.Auctions, any> = {
  async loadMore({ state, commit }) {
    if (state.loading || !state.hasNext) return;
    commit("SET_LOADING", true);
    const response = await this.$http.getFlips({
      limit: state.limit,
      cursor: state.cursor,
    });
    commit("SET_RESULT", response);
    commit("SET_LOADING", false);
  },

  async refresh({ state, commit }) {
    if (state.loading) return;
    commit("SET_LOADING", true);
    commit("RESET");
    const response = await this.$http.getFlips({
      limit: state.limit,
      cursor: null,
    });
    commit("SET_RESULT", response);
    commit("SET_LOADING", false);
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
