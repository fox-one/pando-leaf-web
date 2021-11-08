import createPersistedState from "vuex-persistedstate";

export default ({ store }) => {
  createPersistedState({
    key: "vuex",
    paths: ["auth", "app.visited", "account", "asset.walletAssets"],
  })(store);
};
