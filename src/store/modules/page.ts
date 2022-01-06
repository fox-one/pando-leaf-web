import { make } from "vuex-pathify";

import type { MutationTree } from "vuex";

const state = (): State.Page => ({
  detail: {
    tabIndex: 0,
  },
});

const mutations: MutationTree<State.Page> = {
  ...make.mutations(state),
};

export default {
  namespaced: true,
  mutations,
  state,
};
