import Vue from "vue";
import Vuex from "vuex";
import modules from "./modules";
import pathify from "vuex-pathify";
import getters from "./getters";

// options
pathify.options.mapping = "standard";
pathify.options.deep = 2;

export default function () {
  Vue.use(Vuex);

  return new Vuex.Store({
    state: {},
    getters,
    modules,
    plugins: [pathify.plugin],
  });
}
