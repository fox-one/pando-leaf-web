import { mixin } from "@foxone/utils";
import { MutationTree } from "vuex";
import { make } from "vuex-pathify";

const state = (): State.App => ({
  appbar: {
    style: "home",
    title: "",
    show: true,
    back: false,
  },
  settings: {
    dark: mixin.isDarkTheme(),
  },
  bottomNav: {
    value: "",
  },
  paying: {
    visible: false,
    timer: null,
  },
  visited: false,
  initing: true,
});

const mutations: MutationTree<State.App> = {
  ...make.mutations(state),
  SET_PAYING(state, data) {
    if (data.visible === false && state.paying.timer) {
      clearTimeout(state.paying.timer as any);
    }
    state.paying = { ...state.paying, ...data };
  },
};

export default {
  namespaced: true,
  state,
  mutations,
};
