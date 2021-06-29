import createPersistedState from "vuex-persistedstate";

export default ({ store }) => {
  createPersistedState({
    key: "vuex",
    paths: ["auth", "global", "app.firstUsePandoLeaf"],
  })(store);
};
