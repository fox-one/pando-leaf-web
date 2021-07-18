import { mixin } from "@foxone/utils";
import { make } from "vuex-pathify";

const state = (): State.App => ({
  appbar: {
    style: "home",
    title: "",
    show: true,
    back: false,
  },
  settings: {
    // dark: mixin.isDarkTheme(),
    dark: false,
  },
  bottomNav: {
    value: "",
  },
  toast: {
    show: false,
    color: "info",
    message: "",
  },
  paying: {
    visible: false,
    timer: null,
  },
  visited: false,
});

const mutations = make.mutations(state);

export default {
  namespaced: true,
  state,
  mutations,
};
