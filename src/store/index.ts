import Vue from "vue";
import Vuex from "vuex";
import modules from "./modules";
import pathify from "vuex-pathify";

// options
pathify.options.mapping = "standard";
pathify.options.deep = 2;

export default function () {
  Vue.use(Vuex);

  return new Vuex.Store({
    state: {},
    modules,
    plugins: [pathify.plugin],
  });
}
