import { make } from "vuex-pathify";

import type { MutationTree } from "vuex";
import { SortBy } from "~/enums";

const state = (): State.Page => ({
  detail: {
    tabIndex: 0,
  },
  auction: {
    tabIndex: 0,
  },
  home: {
    sorter: SortBy.COLLATERAL_RATIO_ASC,
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
