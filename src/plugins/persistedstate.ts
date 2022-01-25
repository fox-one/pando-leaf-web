import createPersistedState from "vuex-persistedstate";

export default ({ store }) => {
  createPersistedState({
    key: "vuex",
    paths: [
      "auth",
      "app.termsAccepted",
      "app.termsVersion",
      "app.visited",
      "account",
      "asset.walletAssets",
      "page.home",
    ],
  })(store);
};
