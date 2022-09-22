import { mixin } from "@foxone/utils";
import { MutationTree } from "vuex";
import { make } from "vuex-pathify";

const state = (): State.App => ({
  appbar: {
    style: "home",
    title: "",
    show: true,
    back: false,
    customContent: null,
    extension: null,
    extensionHeight: 48,
  },
  settings: {
    dark: mixin.isDarkTheme(),
  },
  bottomNav: {
    value: "",
  },
  fiat: {
    symbol: "$",
    name: "USD",
  },
  visited: false,
  initing: true,
  termsAccepted: false,
  termsVersion: "0.0.0",
  safetyWarningShown: false,
});

const mutations: MutationTree<State.App> = {
  ...make.mutations(state),
  SET_APPBAR(state, value) {
    const defaultValue = {
      title: "",
      style: "",
      show: true,
      back: true,
      color: "",
    };
    state.appbar = { ...defaultValue, ...value };
  },
};

export default {
  namespaced: true,
  state,
  mutations,
};
