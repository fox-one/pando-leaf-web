import Vue from "vue";
import { MutationTree, GetterTree, ActionTree } from "vuex";
import {
  IAsset,
  ICollateral,
  IMixinAsset,
  IOracle,
  IVault,
} from "~/services/types/vo";

const state = () => ({
  oracles: [],
});

export type AssetsState = {
  oracles: IOracle[];
};

const getters: GetterTree<AssetsState, any> = {
  findByAssetId(state) {
    return (id) => state.oracles?.find((a) => a.asset_id === id);
  },
};

const mutations: MutationTree<AssetsState> = {
  SET_ORACLES(state, data: IOracle[]) {
    state.oracles = data;
  },
};

const actions: ActionTree<AssetsState, any> = {
  async sync({ commit }) {
    const response = await this.$http.oracles();
    commit("SET_ORACLES", response?.data?.oracles);
  },
};

export default {
  getters,
  state,
  mutations,
  actions,
};
