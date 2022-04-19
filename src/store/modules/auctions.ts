import { make } from "vuex-pathify";

import type { MutationTree, GetterTree, ActionTree } from "vuex";
import { FlipAction, FlipPhase } from "~/enums";

const state = (): State.Auctions => ({
  ongoing: {
    flips: [],
    params: {
      phase: FlipPhase.bid,
      limit: 8,
      offset: 0,
    },
    total: 0,
    loading: false,
  },
  done: {
    flips: [],
    params: {
      phase: FlipPhase.deal,
      limit: 8,
      offset: 0,
    },
    total: 0,
    loading: false,
  },
  loading: false,
  limit: 20,
  events: [],
});

const getters: GetterTree<State.Auctions, unknown> = {
  allFlips(state) {
    return [...state.ongoing.flips, ...state.done.flips];
  },

  getFlipById(state, getters) {
    return (id: string) => getters.allFlips.find((v) => v.id === id);
  },

  flipsDone(state) {
    return state.done.flips;
  },

  flipsAuctioning(state) {
    return state.ongoing.flips;
  },

  haveFlips(state, getters) {
    return getters.allFlips?.length > 0;
  },

  yourLastBidEvent(state) {
    return state.events?.find((e) => e.is_me);
  },

  flipKickEvent(state) {
    return state.events?.find((v) => v.action === FlipAction.FlipKick);
  },
};

const mutations: MutationTree<State.Auctions> = {
  ...make.mutations(state),

  SET_ONGOING_LOADING(state, loading) {
    state.ongoing.loading = loading;
  },

  SET_DONE_LOADING(state, loading) {
    if (loading) state.done.flips = [];
    state.done.loading = loading;
  },

  SET_ONGOING_PARAMS(state, params) {
    state.ongoing.params = params;
  },

  SET_DONE_PARAMS(state, params) {
    state.done.params = params;
  },

  SET_ONGOING_RESULT(state, { flips, total }) {
    state.ongoing.flips = flips;
    state.ongoing.total = total;
  },

  SET_DONE_RESULT(state, { flips, total }) {
    state.done.flips = flips;
    state.done.total = total;
  },

  RESET_ONGOING_RESULT(state) {
    state.ongoing.flips = [];
    state.ongoing.params.offset = 0;
  },

  RESET_DONE_RESULT(state) {
    state.done.flips = [];
    state.done.params.offset = 0;
  },

  RESET(state) {
    state.ongoing.flips = [];
    state.ongoing.params = {
      phase: FlipPhase.bid,
      limit: 8,
      offset: 0,
    };
    state.done.flips = [];
    state.done.params = {
      phase: FlipPhase.deal,
      limit: 8,
      offset: 0,
    };
    state.events = [];
  },
};

const actions: ActionTree<State.Auctions, any> = {
  async refreshOngoing({ state, commit }, { withLoading }) {
    if (state.ongoing.loading) return;
    if (withLoading) {
      commit("SET_ONGOING_LOADING", true);
    }
    const response = await this.$http.queryFlips(state.ongoing.params);
    commit("SET_ONGOING_RESULT", response);
    if (withLoading) {
      commit("SET_ONGOING_LOADING", false);
    }
  },

  async refreshDone({ state, commit }, { withLoading = true }) {
    if (state.done.loading) return;
    if (withLoading) {
      commit("SET_DONE_LOADING", true);
    }
    const response = await this.$http.queryFlips(state.done.params);
    commit("SET_DONE_RESULT", response);
    if (withLoading) {
      commit("SET_DONE_LOADING", false);
    }
  },

  async resetOngoing({ state, commit }, { withLoading = true }) {
    if (state.ongoing.loading) return;
    if (withLoading) {
      commit("RESET_ONGOING_RESULT", true);
    }
    const response = await this.$http.queryFlips(state.ongoing.params);
    commit("SET_ONGOING_RESULT", response);
    if (withLoading) {
      commit("SET_ONGOING_LOADING", false);
    }
  },

  async resetDone({ state, commit }) {
    if (state.done.loading) return;
    commit("SET_DONE_LOADING", true);

    const response = await this.$http.queryFlips(state.done.params);

    commit("SET_DONE_RESULT", response);
    commit("SET_DONE_LOADING", false);
  },

  async clear({ commit }) {
    commit("RESET");
  },
};

export default {
  namespaced: true,
  getters,
  state,
  mutations,
  actions,
};
